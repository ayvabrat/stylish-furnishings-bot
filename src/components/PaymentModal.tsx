import React, { useState } from 'react';
import { X, Upload, Check, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { AdminSettings } from '@/types/admin';
import { useLanguage } from '@/contexts/LanguageContext';
import axios from 'axios';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentConfirm: (receiptFile: File) => Promise<void>;
  adminSettings: AdminSettings | null;
  finalPrice: number;
  orderReference: string | null;
  customerData?: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryAddress: string;
    city: string;
    postalCode: string;
    additionalNotes: string;
  };
  cartItems?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    images: string[];
  }>;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentConfirm,
  adminSettings,
  finalPrice,
  orderReference,
  customerData,
  cartItems
}) => {
  const { language } = useLanguage();
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  // Debug logging
  console.log('PaymentModal props:', {
    isOpen,
    adminSettings: !!adminSettings,
    finalPrice,
    orderReference
  });

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(language === 'ru' ? 'Пожалуйста, загрузите изображение' : 'Суретті жүктеңіз');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(language === 'ru' ? 'Размер файла не должен превышать 10MB' : 'Файл көлемі 10MB-тан аспауы керек');
        return;
      }

      setReceiptFile(file);
      const url = URL.createObjectURL(file);
      setReceiptUrl(url);
    }
  };

  const sendToTelegram = async (receiptFile: File) => {
    console.log('🚀 Начинаем отправку в Telegram...');
    
    if (!customerData || !cartItems) {
      console.error('❌ Отсутствуют данные клиента или товары');
      throw new Error('Customer data or cart items missing');
    }

    console.log('✅ Данные клиента и товары найдены');
    console.log('📦 Товары:', cartItems);
    console.log('👤 Данные клиента:', customerData);

    const adminIds = ['67486304', '2047023654'];
    
    // Create detailed message
    const orderDetails = cartItems.map(item => 
      `${item.name} - ${item.quantity} шт. - ${item.price * item.quantity} ₽`
    ).join('\n');

    const message = `🛒 НОВЫЙ ЗАКАЗ #${orderReference}

👤 ПОКУПАТЕЛЬ:
Имя: ${customerData.customerName}
Телефон: ${customerData.customerPhone}
Email: ${customerData.customerEmail}

📍 ДОСТАВКА:
Адрес: ${customerData.deliveryAddress}
Город: ${customerData.city}
Индекс: ${customerData.postalCode}
${customerData.additionalNotes ? `Комментарий: ${customerData.additionalNotes}` : ''}

🛍️ ТОВАРЫ:
${orderDetails}

💰 ИТОГО: ${finalPrice} ₽

📄 Чек об оплате прикреплен к сообщению.`;

    console.log('📝 Сообщение для отправки:', message);

    // Send to all admins
    for (const adminId of adminIds) {
      const telegramData = new FormData();
      telegramData.append('chat_id', adminId);
      telegramData.append('photo', receiptFile);
      telegramData.append('caption', message);

      console.log(`📤 Отправляем запрос в Telegram API для админа ${adminId}...`);
      try {
        const response = await axios.post(
          `https://api.telegram.org/bot7789884902:AAHTbhX_tJvPDwPMIhmseXppabXRSHzkTFM/sendPhoto`,
          telegramData
        );
        console.log(`✅ Успешно отправлено в Telegram для админа ${adminId}:`, response.data);
      } catch (error) {
        console.error(`❌ Ошибка отправки в Telegram для админа ${adminId}:`, error);
        if (axios.isAxiosError(error)) {
          console.error('📋 Детали ошибки:', error.response?.data);
          console.error('🔢 Статус код:', error.response?.status);
          console.error('📊 Headers:', error.response?.headers);
        }
        throw error;
      }
    }
  };

  const handleConfirmPayment = async () => {
    console.log('🚀 Кнопка подтверждения оплаты нажата');
    
    if (!receiptFile) {
      console.log('❌ Файл чека не выбран');
      toast.error(language === 'ru' ? 'Пожалуйста, загрузите чек об оплате' : 'Төлем чегін жүктеңіз');
      return;
    }

    console.log('✅ Файл чека найден, начинаем процесс подтверждения оплаты...');
    console.log('📄 Информация о файле:', {
      name: receiptFile.name,
      size: receiptFile.size,
      type: receiptFile.type
    });
    
    setIsConfirming(true);
    try {
      // Send to Telegram first
      console.log('📤 Шаг 1: Отправка в Telegram...');
      await sendToTelegram(receiptFile);
      console.log('✅ Шаг 1 завершен: Данные отправлены в Telegram');
      
      // Then proceed with original payment confirmation
      console.log('💾 Шаг 2: Подтверждение оплаты в системе...');
      await onPaymentConfirm(receiptFile);
      console.log('✅ Шаг 2 завершен: Оплата подтверждена в системе');
      
      console.log('🎉 Процесс подтверждения оплаты успешно завершен');
      onClose();
    } catch (error) {
      console.error('❌ Ошибка при подтверждении оплаты:', error);
      
      // Более детальное логирование ошибки
      if (error instanceof Error) {
        console.error('📋 Сообщение об ошибке:', error.message);
        console.error('🔍 Stack trace:', error.stack);
      }
      
      toast.error(language === 'ru' ? 'Ошибка подтверждения оплаты' : 'Төлемді растауда қате');
    } finally {
      setIsConfirming(false);
    }
  };

  const resetModal = () => {
    setReceiptFile(null);
    setReceiptUrl(null);
    setIsConfirming(false);
  };

  const handleClose = () => {
    console.log('Payment modal closing...');
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {language === 'ru' ? 'Инструкции по оплате' : 'Төлем нұсқаулары'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-blue-900">
              {language === 'ru' ? 'Реквизиты для перевода:' : 'Аударым деректемелері:'}
            </h3>
            
            {adminSettings && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">{language === 'ru' ? 'Банк:' : 'Банк:'}</span>
                  <span>{adminSettings.paymentDetails.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{language === 'ru' ? 'Номер карты:' : 'Карта нөмірі:'}</span>
                  <span className="font-mono bg-white px-2 py-1 rounded">
                    {adminSettings.paymentDetails.accountNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{language === 'ru' ? 'Получатель:' : 'Алушы:'}</span>
                  <span>{adminSettings.paymentDetails.recipientName}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-blue-900 border-t pt-2">
                  <span>{language === 'ru' ? 'Сумма к оплате:' : 'Төлем сомасы:'}</span>
                  <span>{finalPrice} ₽</span>
                </div>
              </div>
            )}
          </div>

          {/* Upload Receipt Section */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">
              {language === 'ru' ? 'Загрузите чек об оплате *' : 'Төлем чегін жүктеңіз *'}
            </Label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleReceiptUpload}
                className="hidden"
                id="receipt-upload"
              />
              
              {receiptUrl ? (
                <div className="space-y-3">
                  <img 
                    src={receiptUrl} 
                    alt="Receipt" 
                    className="max-w-full max-h-40 mx-auto rounded border"
                  />
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <Check size={16} />
                    <span className="text-sm">
                      {language === 'ru' ? 'Чек загружен' : 'Чек жүктелді'}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('receipt-upload')?.click()}
                  >
                    {language === 'ru' ? 'Изменить файл' : 'Файлды өзгерту'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div>
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('receipt-upload')?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {language === 'ru' ? 'Выбрать файл' : 'Файл таңдау'}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    {language === 'ru' 
                      ? 'Поддерживаются файлы JPG, PNG (до 10MB)'
                      : 'JPG, PNG файлдары қолдау көрсетіледі (10MB дейін)'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isConfirming}
            >
              {language === 'ru' ? 'Отмена' : 'Бас тарту'}
            </Button>
            
            <Button
              onClick={handleConfirmPayment}
              disabled={!receiptFile || isConfirming}
              className="flex-1"
            >
              {isConfirming ? (
                language === 'ru' ? 'Отправка...' : 'Жіберілуде...'
              ) : (
                language === 'ru' ? 'Я оплатил' : 'Мен төледім'
              )}
            </Button>
          </div>

          {orderReference && (
            <p className="text-xs text-center text-gray-500">
              {language === 'ru' ? 'Номер заказа:' : 'Тапсырыс нөмірі:'} #{orderReference}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
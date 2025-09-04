import React, { useState } from 'react';
import { X, Upload, Check, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { AdminSettings } from '@/types/admin';
import { useLanguage } from '@/contexts/LanguageContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentConfirm: (receiptFile: File) => Promise<void>;
  adminSettings: AdminSettings | null;
  finalPrice: number;
  orderReference: string | null;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentConfirm,
  adminSettings,
  finalPrice,
  orderReference
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

  const handleConfirmPayment = async () => {
    console.log('Payment confirmation button clicked');
    
    if (!receiptFile) {
      console.log('No receipt file selected');
      toast.error(language === 'ru' ? 'Пожалуйста, загрузите чек об оплате' : 'Төлем чегін жүктеңіз');
      return;
    }

    console.log('Receipt file found, processing payment confirmation...');
    setIsConfirming(true);
    try {
      await onPaymentConfirm(receiptFile);
      console.log('Payment confirmed successfully');
      onClose();
    } catch (error) {
      console.error('Error confirming payment:', error);
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
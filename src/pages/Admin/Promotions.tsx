
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash, Edit, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchPromoCodes, updatePromoCodes } from '@/services/promotionService';
import { PromotionCode } from '@/types/admin';

const AdminPromotions = () => {
  const { language } = useLanguage();
  const [promoCodes, setPromoCodes] = useState<PromotionCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [promoCodeToEdit, setPromoCodeToEdit] = useState<PromotionCode | null>(null);
  const [promoCodeToDelete, setPromoCodeToDelete] = useState<string | null>(null);
  
  // Form state
  const [formCode, setFormCode] = useState('');
  const [formDiscount, setFormDiscount] = useState('');
  const [formActive, setFormActive] = useState(true);
  
  // Load promo codes
  useEffect(() => {
    const loadPromoCodes = async () => {
      try {
        const data = await fetchPromoCodes();
        setPromoCodes(data);
      } catch (error) {
        console.error('Failed to load promo codes:', error);
        toast.error(language === 'ru' ? 'Ошибка при загрузке промокодов' : 'Промокодтарды жүктеу қатесі');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPromoCodes();
  }, [language]);
  
  // Handle add promo code
  const handleAddPromoCode = async () => {
    if (!formCode.trim()) {
      toast.error(language === 'ru' ? 'Введите код промокода' : 'Промокод кодын енгізіңіз');
      return;
    }
    
    const discount = parseInt(formDiscount);
    if (isNaN(discount) || discount <= 0 || discount > 100) {
      toast.error(language === 'ru' ? 'Скидка должна быть от 1 до 100%' : 'Жеңілдік 1-ден 100%-ға дейін болуы керек');
      return;
    }
    
    // Check if code already exists
    if (promoCodes.some(promo => promo.code.toLowerCase() === formCode.toLowerCase())) {
      toast.error(language === 'ru' ? 'Промокод уже существует' : 'Промокод әлдеқашан бар');
      return;
    }
    
    // Add new promo code
    const newPromoCode: PromotionCode = {
      id: crypto.randomUUID(),
      code: formCode.toUpperCase(),
      discountPercentage: discount,
      isActive: formActive
    };
    
    const updatedPromoCodes = [...promoCodes, newPromoCode];
    
    try {
      await updatePromoCodes(updatedPromoCodes);
      setPromoCodes(updatedPromoCodes);
      toast.success(language === 'ru' ? 'Промокод успешно добавлен' : 'Промокод сәтті қосылды');
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      console.error('Failed to add promo code:', error);
      toast.error(language === 'ru' ? 'Ошибка при добавлении промокода' : 'Промокодты қосу қатесі');
    }
  };
  
  // Handle edit promo code
  const handleEditPromoCode = async () => {
    if (!promoCodeToEdit) return;
    
    if (!formCode.trim()) {
      toast.error(language === 'ru' ? 'Введите код промокода' : 'Промокод кодын енгізіңіз');
      return;
    }
    
    const discount = parseInt(formDiscount);
    if (isNaN(discount) || discount <= 0 || discount > 100) {
      toast.error(language === 'ru' ? 'Скидка должна быть от 1 до 100%' : 'Жеңілдік 1-ден 100%-ға дейін болуы керек');
      return;
    }
    
    // Check if code already exists and it's not the current code
    if (formCode.toLowerCase() !== promoCodeToEdit.code.toLowerCase() && 
        promoCodes.some(promo => promo.code.toLowerCase() === formCode.toLowerCase())) {
      toast.error(language === 'ru' ? 'Промокод уже существует' : 'Промокод әлдеқашан бар');
      return;
    }
    
    // Special handling for ALMATY20 - only allow enabling/disabling
    if (promoCodeToEdit.code === 'ALMATY20') {
      if (!formActive) {
        toast.error(language === 'ru' ? 'Нельзя деактивировать промокод ALMATY20' : 'ALMATY20 промокодын өшіруге болмайды');
        return;
      }
      if (discount !== 20) {
        toast.error(language === 'ru' ? 'Нельзя изменить скидку для промокода ALMATY20' : 'ALMATY20 промокоды үшін жеңілдікті өзгертуге болмайды');
        return;
      }
      if (formCode !== 'ALMATY20') {
        toast.error(language === 'ru' ? 'Нельзя изменить код промокода ALMATY20' : 'ALMATY20 промокод кодын өзгертуге болмайды');
        return;
      }
    }
    
    // Update promo code
    const updatedPromoCodes = promoCodes.map(promo => 
      promo.id === promoCodeToEdit.id 
        ? {
            ...promo,
            code: formCode.toUpperCase(),
            discountPercentage: discount,
            isActive: formActive
          }
        : promo
    );
    
    try {
      await updatePromoCodes(updatedPromoCodes);
      setPromoCodes(updatedPromoCodes);
      toast.success(language === 'ru' ? 'Промокод успешно обновлен' : 'Промокод сәтті жаңартылды');
      setShowEditDialog(false);
      resetForm();
    } catch (error) {
      console.error('Failed to update promo code:', error);
      toast.error(language === 'ru' ? 'Ошибка при обновлении промокода' : 'Промокодты жаңарту қатесі');
    }
  };
  
  // Handle delete promo code
  const handleDeletePromoCode = async () => {
    if (!promoCodeToDelete) return;
    
    // Find promo code to delete
    const promoToDelete = promoCodes.find(promo => promo.id === promoCodeToDelete);
    
    // Don't allow deleting ALMATY20
    if (promoToDelete && promoToDelete.code === 'ALMATY20') {
      toast.error(language === 'ru' ? 'Нельзя удалить промокод ALMATY20' : 'ALMATY20 промокодын жоюға болмайды');
      setPromoCodeToDelete(null);
      return;
    }
    
    const updatedPromoCodes = promoCodes.filter(promo => promo.id !== promoCodeToDelete);
    
    try {
      await updatePromoCodes(updatedPromoCodes);
      setPromoCodes(updatedPromoCodes);
      toast.success(language === 'ru' ? 'Промокод успешно удален' : 'Промокод сәтті жойылды');
    } catch (error) {
      console.error('Failed to delete promo code:', error);
      toast.error(language === 'ru' ? 'Ошибка при удалении промокода' : 'Промокодты жою қатесі');
    } finally {
      setPromoCodeToDelete(null);
    }
  };
  
  // Handle toggle promo code active state
  const handleToggleActive = async (id: string, newState: boolean) => {
    // Find promo code to update
    const promoToUpdate = promoCodes.find(promo => promo.id === id);
    
    // Don't allow deactivating ALMATY20
    if (promoToUpdate && promoToUpdate.code === 'ALMATY20' && !newState) {
      toast.error(language === 'ru' ? 'Нельзя деактивировать промокод ALMATY20' : 'ALMATY20 промокодын өшіруге болмайды');
      return;
    }
    
    const updatedPromoCodes = promoCodes.map(promo => 
      promo.id === id ? { ...promo, isActive: newState } : promo
    );
    
    try {
      await updatePromoCodes(updatedPromoCodes);
      setPromoCodes(updatedPromoCodes);
      toast.success(
        language === 'ru' 
          ? `Промокод ${newState ? 'активирован' : 'деактивирован'}` 
          : `Промокод ${newState ? 'белсендірілді' : 'өшірілді'}`
      );
    } catch (error) {
      console.error('Failed to update promo code:', error);
      toast.error(language === 'ru' ? 'Ошибка при обновлении промокода' : 'Промокодты жаңарту қатесі');
    }
  };
  
  // Reset form state
  const resetForm = () => {
    setFormCode('');
    setFormDiscount('');
    setFormActive(true);
    setPromoCodeToEdit(null);
  };
  
  // Open edit dialog with promo code data
  const openEditDialog = (promoCode: PromotionCode) => {
    setPromoCodeToEdit(promoCode);
    setFormCode(promoCode.code);
    setFormDiscount(promoCode.discountPercentage.toString());
    setFormActive(promoCode.isActive);
    setShowEditDialog(true);
  };
  
  return (
    <Layout>
      <div className="bg-white py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-screen-xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <Link to="/admin" className="mr-4">
                  <ArrowLeft className="h-5 w-5 text-furniture-secondary hover:text-furniture-primary" />
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {language === 'ru' ? 'Промокоды' : 'Промокодтар'}
                </h1>
              </div>
              
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {language === 'ru' ? 'Добавить промокод' : 'Промокод қосу'}
              </Button>
            </div>
            
            {/* Promo Codes Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              {isLoading ? (
                <div className="p-6 text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-furniture-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>{language === 'ru' ? 'Загрузка промокодов...' : 'Промокодтар жүктелуде...'}</p>
                </div>
              ) : promoCodes.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-furniture-secondary">
                    {language === 'ru' ? 'Нет доступных промокодов' : 'Қол жетімді промокодтар жоқ'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-furniture-secondary uppercase tracking-wider">
                          {language === 'ru' ? 'Код' : 'Код'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-furniture-secondary uppercase tracking-wider">
                          {language === 'ru' ? 'Скидка' : 'Жеңілдік'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-furniture-secondary uppercase tracking-wider">
                          {language === 'ru' ? 'Статус' : 'Мәртебе'}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-furniture-secondary uppercase tracking-wider">
                          {language === 'ru' ? 'Действия' : 'Әрекеттер'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {promoCodes.map((promo) => (
                        <tr key={promo.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-furniture-primary">
                              {promo.code}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-furniture-secondary">
                              {promo.discountPercentage}%
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <Switch
                                checked={promo.isActive}
                                onCheckedChange={(checked) => handleToggleActive(promo.id, checked)}
                                disabled={promo.code === 'ALMATY20'} // Don't allow toggling ALMATY20
                              />
                              <span className="ml-2 text-sm">
                                {promo.isActive 
                                  ? (language === 'ru' ? 'Активен' : 'Белсенді')
                                  : (language === 'ru' ? 'Неактивен' : 'Белсенді емес')
                                }
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end items-center space-x-2">
                              <button
                                onClick={() => openEditDialog(promo)}
                                className="text-blue-600 hover:text-blue-900"
                                disabled={promo.code === 'ALMATY20'} // Don't allow editing ALMATY20
                              >
                                <Edit className={`h-4 w-4 ${promo.code === 'ALMATY20' ? 'opacity-50' : ''}`} />
                              </button>
                              <button
                                onClick={() => setPromoCodeToDelete(promo.id)}
                                className="text-red-600 hover:text-red-900"
                                disabled={promo.code === 'ALMATY20'} // Don't allow deleting ALMATY20
                              >
                                <Trash className={`h-4 w-4 ${promo.code === 'ALMATY20' ? 'opacity-50' : ''}`} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Promo Code Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'ru' ? 'Добавить промокод' : 'Промокод қосу'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium">
                {language === 'ru' ? 'Код промокода' : 'Промокод коды'}
              </label>
              <Input
                id="code"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                placeholder="SUMMER2023"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="discount" className="text-sm font-medium">
                {language === 'ru' ? 'Скидка (%)' : 'Жеңілдік (%)'}
              </label>
              <Input
                id="discount"
                type="number"
                min="1"
                max="100"
                value={formDiscount}
                onChange={(e) => setFormDiscount(e.target.value)}
                placeholder="10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formActive}
                onCheckedChange={setFormActive}
              />
              <label htmlFor="active" className="text-sm font-medium">
                {language === 'ru' ? 'Активен' : 'Белсенді'}
              </label>
            </div>
          </div>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddDialog(false);
                resetForm();
              }}
            >
              {language === 'ru' ? 'Отмена' : 'Болдырмау'}
            </Button>
            <Button onClick={handleAddPromoCode}>
              {language === 'ru' ? 'Добавить' : 'Қосу'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Promo Code Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'ru' ? 'Редактировать промокод' : 'Промокодты өңдеу'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="edit-code" className="text-sm font-medium">
                {language === 'ru' ? 'Код промокода' : 'Промокод коды'}
              </label>
              <Input
                id="edit-code"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                placeholder="SUMMER2023"
                disabled={promoCodeToEdit?.code === 'ALMATY20'}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-discount" className="text-sm font-medium">
                {language === 'ru' ? 'Скидка (%)' : 'Жеңілдік (%)'}
              </label>
              <Input
                id="edit-discount"
                type="number"
                min="1"
                max="100"
                value={formDiscount}
                onChange={(e) => setFormDiscount(e.target.value)}
                placeholder="10"
                disabled={promoCodeToEdit?.code === 'ALMATY20'}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-active"
                checked={formActive}
                onCheckedChange={setFormActive}
                disabled={promoCodeToEdit?.code === 'ALMATY20'}
              />
              <label htmlFor="edit-active" className="text-sm font-medium">
                {language === 'ru' ? 'Активен' : 'Белсенді'}
              </label>
            </div>
          </div>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowEditDialog(false);
                resetForm();
              }}
            >
              {language === 'ru' ? 'Отмена' : 'Болдырмау'}
            </Button>
            <Button onClick={handleEditPromoCode}>
              {language === 'ru' ? 'Сохранить' : 'Сақтау'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!promoCodeToDelete} onOpenChange={() => setPromoCodeToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'ru' ? 'Подтверждение удаления' : 'Жоюды растау'}
            </DialogTitle>
          </DialogHeader>
          <p>
            {language === 'ru'
              ? 'Вы уверены, что хотите удалить этот промокод? Это действие нельзя отменить.'
              : 'Бұл промокодты жойғыңыз келетініне сенімдісіз бе? Бұл әрекетті болдырмау мүмкін емес.'}
          </p>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setPromoCodeToDelete(null)}
            >
              {language === 'ru' ? 'Отмена' : 'Болдырмау'}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeletePromoCode}
            >
              {language === 'ru' ? 'Удалить' : 'Жою'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminPromotions;

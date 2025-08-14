
import React, { useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchProducts } from "@/services/productService";
import { createOrder } from "@/services/orderService";
import type { CartItemType, ProductType } from "@/types/product";

const PayTestPage: React.FC = () => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [city, setCity] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const labels = useMemo(
    () => ({
      title: language === "ru" ? "Тестовая оплата" : "Тесттік төлем",
      name: language === "ru" ? "Имя" : "Аты",
      phone: language === "ru" ? "Телефон" : "Телефон",
      city: language === "ru" ? "Город (необязательно)" : "Қала (міндетті емес)",
      address: language === "ru" ? "Адрес (необязательно)" : "Мекенжай (міндетті емес)",
      pay: language === "ru" ? "Оплатить 1₽" : "1₽ төлеу",
    }),
    [language]
  );

  const handlePay = async () => {
    if (!customerName || !customerPhone) {
      toast.error(language === "ru" ? "Заполните имя и телефон" : "Атыңызды және телефонды толтырыңыз");
      return;
    }

    setLoading(true);
    try {
      // 1) Найти тестовый товар 1₽
      const allProducts: ProductType[] = await fetchProducts();
      const testProduct = allProducts.find((p) => p.name === "Тестовый товар" && Number(p.price) === 1);
      if (!testProduct) {
        toast.error(language === "ru" ? "Тестовый товар не найден" : "Тесттік тауар табылмады");
        setLoading(false);
        return;
      }

      const items: CartItemType[] = [{ ...testProduct, quantity: 1 }];
      const totalAmount = 1;

      // 2) Создать заказ в Supabase
      const { orderId, reference } = await createOrder({
        customerName,
        customerPhone,
        city: city || undefined,
        deliveryAddress: deliveryAddress || undefined,
        items,
        totalAmount,
        paymentMethod: "arsenalpay",
        additionalNotes: "Тестовая оплата 1₽ через ArsenalPay",
      });

      console.log("Order created:", orderId, reference);

      // 3) Вызвать edge-функцию для создания платежа ArsenalPay
      const { data, error } = await supabase.functions.invoke("arsenalpay-create", {
        body: { 
          orderId, 
          amount: totalAmount, 
          description: `Оплата заказа ${reference || orderId}`,
          customerEmail: "test@example.com"
        },
      });

      if (error) {
        console.error("invoke error:", error);
        toast.error(language === "ru" ? "Ошибка создания платежа" : "Төлем жасауда қате");
        setLoading(false);
        return;
      }

      const paymentUrl = data?.payment_url;
      if (!paymentUrl) {
        console.error("No payment URL:", data);
        toast.error(language === "ru" ? "Не получили ссылку на оплату" : "Төлем сілтемесі алынбады");
        setLoading(false);
        return;
      }

      // 4) Редирект на ArsenalPay
      window.location.href = paymentUrl;
    } catch (e: any) {
      console.error(e);
      toast.error(language === "ru" ? "Сбой при создании платежа" : "Төлем жасау кезінде ақау");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-white py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">{labels.title}</h1>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">{labels.name}</label>
                <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Иван Иванов" />
              </div>
              <div>
                <label className="block text-sm mb-1">{labels.phone}</label>
                <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="+7 777 000 00 00" />
              </div>
              <div>
                <label className="block text-sm mb-1">{labels.city}</label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Алматы" />
              </div>
              <div>
                <label className="block text-sm mb-1">{labels.address}</label>
                <Input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="ул. Абая, 10" />
              </div>
              <Button onClick={handlePay} disabled={loading}>
                {loading ? (language === "ru" ? "Подготовка..." : "Дайындау...") : labels.pay}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PayTestPage;

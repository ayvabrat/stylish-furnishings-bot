import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const TelegramTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testTelegram = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-telegram');
      
      if (error) {
        console.error('Function error:', error);
        setResult({ success: false, error: error.message });
        toast.error('Ошибка вызова функции');
        return;
      }
      
      console.log('Function result:', data);
      setResult(data);
      
      if (data?.success) {
        toast.success('Тестовое сообщение отправлено!');
      } else {
        toast.error('Ошибка отправки сообщения');
      }
    } catch (error: any) {
      console.error('Test error:', error);
      setResult({ success: false, error: error.message });
      toast.error('Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Тест Telegram бота</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testTelegram}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Отправка...' : 'Отправить тестовое сообщение'}
          </Button>
          
          {result && (
            <div className="p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-2">Результат:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramTest;
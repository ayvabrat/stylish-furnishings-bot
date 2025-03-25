
export interface PromotionCode {
  id: string;
  code: string;
  discountPercentage: number;
  isActive: boolean;
  validUntil?: string;
}

export interface AdminSettings {
  paymentDetails: {
    bankName: string;
    accountNumber: string;
    recipientName: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
}

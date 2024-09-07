export type InitializePaymentInput = {
  amount: number;
  email: string;
  currency: string;
  firstName: string;
  lastName: string;
  metadata: {
    full_name: string;
  };
};

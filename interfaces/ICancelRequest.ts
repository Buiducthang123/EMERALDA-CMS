export interface IBankAccountInfo {
  bankAccountNumber: string;
  recipientName: string;
  bankName: string;
  confirmation: boolean;
}

export interface ICancelRequest {
  id: number;
  order_id: number;
  room_id: number;
  user_id: number;
  refund_amount: number;
  bank_account_info: IBankAccountInfo;
  status: number;
  created_at: string;
  updated_at: string;
}

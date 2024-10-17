import type { ICustomerInfo } from "./ICustomerInfo";

export interface IOrder {
    id: number;
    room_ids: number[];
    customer_info: ICustomerInfo;
    voucher_code: string | null;
    user_id: number;
    total_price: number;
    payable_amount: number;
    prepayment_amount: number;
    status: string;
    refunded_status: number;
    created_at: string;
    updated_at: string;
  }
  
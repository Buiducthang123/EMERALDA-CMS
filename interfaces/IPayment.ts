import type { IOrder } from "./IOder";
import type { IUser } from "./IUser";

export interface IPayment {
    id: number;
    order_id: number;
    user_id: number;
    amount: number;
    status: string;
    transaction_id: string | null;
    payment_date: string | null;
    created_at: string;
    updated_at: string;
    user?: IUser;
    order?: IOrder;
  }
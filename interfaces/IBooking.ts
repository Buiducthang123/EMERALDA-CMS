import type { ICustomerInfo } from "./ICustomerInfo";
import type { IOrder } from "./IOder";
import type { IRoom } from "./IRoom";
import type { IUser } from "./IUser";


export interface IBooking {
  id: number;
  order_id: number;
  user_id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  paid_amount: number;
  status: string|number;
  created_at: string;
  updated_at: string;
  room?: IRoom;
  user?: IUser;
  order?: IOrder;
}
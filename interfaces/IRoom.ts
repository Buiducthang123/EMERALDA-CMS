import type { IRoomType } from "./IRoomType";

export interface IRoom {
    id: number;
    room_number: string;
    room_type_id: number;
    status: number;
    price: number;
    description: string | null;
    room_type: IRoomType | any ;
    created_at: string;
    updated_at: string;
}

import type { IRoomType } from "./IRoomType";

export interface IRoom {
    id: number;
    room_number: string;
    room_type_id: number;
    main_image: string | null;
    thumbnails: any[] | null;
    status: string;
    price: number;
    description: string | null;
    amenities: any[] | null;
    room_type: IRoomType;
    adults?: number;
    children?: number;
    created_at: string;
    updated_at: string;
}

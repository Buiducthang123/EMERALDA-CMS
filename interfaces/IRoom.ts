import type { IRoomType } from "./IRoomType";

export interface IRoom {
    id: number;
    room_number: string;
    room_type_id: number;
    main_image: string | null;
    thumbnails: any[] | null;
    status: number;
    price: number;
    description: string | null;
    amenities: any[] | null;
    features: any[] | null;
    room_type: IRoomType | any ;
    adults?: number;
    children?: number;
    area?: number;
    created_at: string;
    updated_at: string;
}

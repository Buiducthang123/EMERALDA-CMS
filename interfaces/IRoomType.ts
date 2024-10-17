export interface IRoomType {
    id: number;
    name: string;
    slug:string;
    main_image: string | null;
    thumbnails: string[] | null;
    max_people: number;
    area: number;
    price: number;
    intro_description: string;
    description?: string ;
    amenities: any[] | null;
    total_rooms: number;
    created_at: string;
    updated_at: string;
}
export interface IVoucher {
    id: string;
    name: string;
    main_image?: string;
    code: string;
    description?: string;
    discount_amount: number;
    valid_from: string; // Ngay bat dau
    valid_until: string; // Ngay ket thuc
    created_at: string;
    updated_at: string;
}
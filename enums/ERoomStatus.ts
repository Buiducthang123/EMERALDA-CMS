export enum ERoomStatus {
    AVAILABLE = 1,
    BOOKED = 2,
    MAINTENANCE = 3
}

export const RoomStatusText: Record<ERoomStatus|string, string> = {
    [ERoomStatus.AVAILABLE]: "Có sẵn",
    [ERoomStatus.BOOKED]: "Đã đặt",
    [ERoomStatus.MAINTENANCE]: "Bảo trì"
}
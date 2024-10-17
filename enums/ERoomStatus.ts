export enum ERoomStatus {
    AVAILABLE = 1,
    MAINTENANCE = 2
}

export const RoomStatusText: Record<ERoomStatus|string, string> = {
    [ERoomStatus.AVAILABLE]: "Bình thường",
    [ERoomStatus.MAINTENANCE]: "Bảo trì"
}
export enum ECancelRequestStatus {
    PENDING = 1,
    WAITING_COMPLETE = 2,
    REJECTED = 3,
    CANCELED = 4,
    COMPLETED = 5,
}

export const ECancelRequestStatusLabel: Record<ECancelRequestStatus, string|number> = {
    [ECancelRequestStatus.PENDING]: 'Chờ xác nhận',
    [ECancelRequestStatus.WAITING_COMPLETE]: 'Xác nhận / chờ hoàn tiền ',
    [ECancelRequestStatus.REJECTED]: 'Từ chối',
    [ECancelRequestStatus.CANCELED]: 'Đã hủy',
    [ECancelRequestStatus.COMPLETED]: 'Đã hoàn thành',
};
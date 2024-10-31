export enum EBookingStatus {
  PENDING_APPROVAL = 1, // Chờ xác nhận thanh toán
  WAITING_CHECK_IN = 2,  // chờ nhận phòng
  CHECKED_IN = 3, // Đã nhận phòng
  CHECKED_OUT = 4, // Đã trả phòng
  CANCELLED = 5, // Đã hủy
}

export const EBookingStatusText: Record<EBookingStatus, string> = {
   [EBookingStatus.PENDING_APPROVAL]: 'Chờ xác nhận thanh toán',
   [EBookingStatus.WAITING_CHECK_IN]: 'Chờ nhận phòng / Đã đặt cọc',
   [EBookingStatus.CHECKED_IN]: 'Đã nhận phòng',
   [EBookingStatus.CHECKED_OUT]: 'Đã trả phòng',
   [EBookingStatus.CANCELLED]: 'Hủy',
};
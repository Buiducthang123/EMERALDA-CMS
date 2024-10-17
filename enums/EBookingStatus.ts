export enum EBookingStatus {
    PENDING = 1, // chờ xác nhận
    NOT_CHECKED_IN = 2, // chưa nhận phòng
    CHECKED_IN = 3, // đã nhận phòng
    CHECKED_OUT = 4, // đã trả phòng
    CANCELLED = 5 // đã hủy
  }
  
 export const BookingStatusLabel: Record<EBookingStatus, string|number> = {
    [EBookingStatus.PENDING]: 'Chờ xác nhận',
    [EBookingStatus.NOT_CHECKED_IN]: 'Chưa nhận phòng',
    [EBookingStatus.CHECKED_IN]: 'Đã nhận phòng',
    [EBookingStatus.CHECKED_OUT]: 'Đã trả phòng',
    [EBookingStatus.CANCELLED]: 'Đã hủy'
  };


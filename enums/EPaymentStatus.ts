
enum EPaymentStatus {
    UNPAID = 1, // chưa thanh toán
    DEPOSIT = 2, // đã đặt cọc
    PAID = 3, // đã thanh toán
    CANCELLED = 4, // đã hủy
}

const EPaymentStatusLabel: Record<EPaymentStatus, string> = {
    [EPaymentStatus.UNPAID]: 'Chưa thanh toán',
    [EPaymentStatus.DEPOSIT]: 'Đã đặt cọc',
    [EPaymentStatus.PAID]: 'Đã thanh toán',
    [EPaymentStatus.CANCELLED]: 'Đã hủy',
  };

  export { EPaymentStatus, EPaymentStatusLabel,  };
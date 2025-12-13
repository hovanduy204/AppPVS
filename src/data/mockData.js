// Mock Data cho ứng dụng MTThangLong

// Mock User Data
export const mockUser = {
  id: '1',
  username: 'user001',
  fullName: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  phone: '0901234567',
  address: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
  householdCode: 'HH001234',
  identityCard: '123456789012',
  dateOfBirth: '1990-01-15',
  isLoggedIn: false,
  population: 4, // Số nhân khẩu hiện tại
  accountType: 'household', // 'household' hoặc 'company'
  companyName: null,
  taxCode: null,
};

// Mock Company Data
export const mockCompanyUser = {
  id: '2',
  username: 'company001',
  fullName: 'Nguyễn Văn B',
  email: 'company@example.com',
  phone: '0901234569',
  address: '456 Đường XYZ, Phường ABC, Quận 2, TP.HCM',
  householdCode: 'CT001234',
  identityCard: '123456789020',
  dateOfBirth: '1985-05-10',
  isLoggedIn: false,
  population: 15, // Số nhân viên hiện tại
  accountType: 'company',
  companyName: 'Công ty TNHH ABC',
  taxCode: '0123456789',
};

// Mock Population Members
export const mockPopulationMembers = [
  {
    id: '1',
    fullName: 'Nguyễn Văn A',
    relationship: 'Chủ hộ',
    identityCard: '123456789012',
    dateOfBirth: '1990-01-15',
    gender: 'Nam',
    phone: '0901234567',
  },
  {
    id: '2',
    fullName: 'Nguyễn Thị B',
    relationship: 'Vợ',
    identityCard: '123456789013',
    dateOfBirth: '1992-05-20',
    gender: 'Nữ',
    phone: '0901234568',
  },
  {
    id: '3',
    fullName: 'Nguyễn Văn C',
    relationship: 'Con trai',
    identityCard: '123456789014',
    dateOfBirth: '2015-08-10',
    gender: 'Nam',
    phone: null,
  },
  {
    id: '4',
    fullName: 'Nguyễn Thị D',
    relationship: 'Con gái',
    identityCard: '123456789015',
    dateOfBirth: '2018-03-25',
    gender: 'Nữ',
    phone: null,
  },
];

// Bảng giá theo số nhân khẩu (Hộ gia đình)
// Mặc định: 21,000 VNĐ/người/tháng cho tất cả các trường hợp
export const priceTableByPopulation = [
  {
    id: '1',
    range: 'Tất cả',
    min: 1,
    max: 999,
    pricePerPerson: 21000,
    description: '21,000 VNĐ/người/tháng',
  },
];

// Bảng giá theo số nhân viên (Công ty/Doanh nghiệp)
export const priceTableByCompany = [
  {
    id: 'C1',
    range: '1-5 nhân viên',
    min: 1,
    max: 5,
    pricePerPerson: 300000,
    description: 'Công ty nhỏ từ 1-5 nhân viên',
  },
  {
    id: 'C2',
    range: '6-10 nhân viên',
    min: 6,
    max: 10,
    pricePerPerson: 280000,
    description: 'Công ty từ 6-10 nhân viên',
  },
  {
    id: 'C3',
    range: '11-20 nhân viên',
    min: 11,
    max: 20,
    pricePerPerson: 250000,
    description: 'Công ty từ 11-20 nhân viên',
  },
  {
    id: 'C4',
    range: '21-50 nhân viên',
    min: 21,
    max: 50,
    pricePerPerson: 220000,
    description: 'Công ty từ 21-50 nhân viên',
  },
  {
    id: 'C5',
    range: '51-100 nhân viên',
    min: 51,
    max: 100,
    pricePerPerson: 200000,
    description: 'Công ty từ 51-100 nhân viên',
  },
  {
    id: 'C6',
    range: 'Trên 100 nhân viên',
    min: 101,
    max: 9999,
    pricePerPerson: 180000,
    description: 'Công ty lớn trên 100 nhân viên',
  },
];

// Hàm tính giá theo số nhân khẩu (Hộ gia đình)
export const calculatePriceByPopulation = (population) => {
  const priceRow = priceTableByPopulation.find(
    (row) => population >= row.min && population <= row.max
  );
  if (priceRow) {
    return {
      pricePerPerson: priceRow.pricePerPerson,
      totalPrice: priceRow.pricePerPerson * population,
      range: priceRow.range,
    };
  }
  return {
    pricePerPerson: 0,
    totalPrice: 0,
    range: 'Không xác định',
  };
};

// Hàm tính giá theo số nhân viên (Công ty)
export const calculatePriceByCompany = (employees) => {
  const priceRow = priceTableByCompany.find(
    (row) => employees >= row.min && employees <= row.max
  );
  if (priceRow) {
    return {
      pricePerPerson: priceRow.pricePerPerson,
      totalPrice: priceRow.pricePerPerson * employees,
      range: priceRow.range,
    };
  }
  return {
    pricePerPerson: 0,
    totalPrice: 0,
    range: 'Không xác định',
  };
};

// Hàm tính giá tổng quát (tự động chọn theo loại tài khoản)
export const calculatePrice = (count, accountType = 'household') => {
  if (accountType === 'company') {
    return calculatePriceByCompany(count);
  }
  return calculatePriceByPopulation(count);
};

// Mock Company Employees
export const mockCompanyEmployees = [
  {
    id: 'E1',
    fullName: 'Nguyễn Văn B',
    position: 'Giám đốc',
    employeeCode: 'NV001',
    identityCard: '123456789020',
    dateOfBirth: '1985-05-10',
    gender: 'Nam',
    phone: '0901234569',
    email: 'director@company.com',
    startDate: '2020-01-01',
  },
  {
    id: 'E2',
    fullName: 'Trần Thị C',
    position: 'Phó giám đốc',
    employeeCode: 'NV002',
    identityCard: '123456789021',
    dateOfBirth: '1988-08-15',
    gender: 'Nữ',
    phone: '0901234570',
    email: 'deputy@company.com',
    startDate: '2020-03-01',
  },
  {
    id: 'E3',
    fullName: 'Lê Văn D',
    position: 'Trưởng phòng',
    employeeCode: 'NV003',
    identityCard: '123456789022',
    dateOfBirth: '1990-12-20',
    gender: 'Nam',
    phone: '0901234571',
    email: 'manager@company.com',
    startDate: '2021-01-15',
  },
  // Thêm thêm nhân viên để đủ 15 người...
];

// Mock Payment Amount Data
// Với 4 người: 
// - Phí theo nhân khẩu: 4 x 21,000 = 84,000 VNĐ
// - Phí quản lý: 30,000 VNĐ
// - VAT 10%: (84,000 + 30,000) x 10% = 11,400 VNĐ
// - Tổng: 125,400 VNĐ
export const mockPaymentAmount = {
  currentMonth: {
    month: '09/2025',
    totalAmount: 125400,
    breakdown: [
      { name: 'Phí dịch vụ', amount: 84000 },
      { name: 'Quản lý', amount: 30000 },
      { name: 'Phí khác (VAT 10%)', amount: 11400 },
    ],
  },
  debt: {
    totalDebt: 125400,
    periods: [
      { period: '09/2025', amount: 125400, status: 'Chưa thanh toán' },
    ],
  },
  collectionHistory: [
    { period: '08/2025', amount: 125400, status: 'Đã thanh toán', paymentDate: '2025-08-05' },
    { period: '07/2025', amount: 125400, status: 'Đã thanh toán', paymentDate: '2025-07-03' },
    { period: '06/2025', amount: 125400, status: 'Đã thanh toán', paymentDate: '2025-06-01' },
  ],
};

// Mock Transaction History
export const mockTransactions = [
  {
    id: 'TXN001',
    orderCode: 'ORD202509001',
    amount: 125400,
    period: '09/2025',
    paymentMethod: 'MoMo',
    status: 'Thành công',
    transactionDate: '2025-09-05T10:30:00',
    description: 'Thanh toán phí tháng 09/2025',
  },
  {
    id: 'TXN002',
    orderCode: 'ORD202508002',
    amount: 125400,
    period: '08/2025',
    paymentMethod: 'PayOS',
    status: 'Thành công',
    transactionDate: '2025-08-03T14:20:00',
    description: 'Thanh toán phí tháng 08/2025',
  },
  {
    id: 'TXN003',
    orderCode: 'ORD202507003',
    amount: 125400,
    period: '07/2025',
    paymentMethod: 'QR Code',
    status: 'Thành công',
    transactionDate: '2025-07-02T09:15:00',
    description: 'Thanh toán phí tháng 07/2025',
  },
  {
    id: 'TXN004',
    orderCode: 'ORD202506004',
    amount: 125400,
    period: '06/2025',
    paymentMethod: 'MoMo',
    status: 'Thành công',
    transactionDate: '2025-06-01T16:45:00',
    description: 'Thanh toán phí tháng 06/2025',
  },
];

// Mock Receipts/Invoices
export const mockReceipts = [
  {
    id: 'RCP001',
    receiptNumber: 'BL202508001',
    orderCode: 'ORD202508002',
    period: '08/2025',
    amount: 125400,
    issueDate: '2025-08-05',
    status: 'Đã thanh toán',
    pdfUrl: 'https://example.com/receipts/RCP001.pdf',
    breakdown: [
      { name: 'Phí dịch vụ', amount: 84000 },
      { name: 'Quản lý', amount: 30000 },
      { name: 'Phí khác (VAT 10%)', amount: 11400 },
    ],
  },
  {
    id: 'RCP002',
    receiptNumber: 'BL202507002',
    orderCode: 'ORD202507003',
    period: '07/2025',
    amount: 125400,
    issueDate: '2025-07-03',
    status: 'Đã thanh toán',
    pdfUrl: 'https://example.com/receipts/RCP002.pdf',
    breakdown: [
      { name: 'Phí dịch vụ', amount: 84000 },
      { name: 'Quản lý', amount: 30000 },
      { name: 'Phí khác (VAT 10%)', amount: 11400 },
    ],
  },
];

// Mock Notifications
export const mockNotifications = [
  {
    id: 'NOTIF001',
    type: 'debt_reminder',
    title: 'Nhắc nợ thanh toán',
    message: 'Bạn có số tiền chưa thanh toán cho kỳ 09/2025. Vui lòng thanh toán trước ngày 15/09/2025.',
    date: '2025-09-05T08:00:00',
    isRead: false,
    channel: 'Email',
  },
  {
    id: 'NOTIF002',
    type: 'payment_success',
    title: 'Thanh toán thành công',
    message: 'Giao dịch ORD202508002 đã được thanh toán thành công. Số tiền: 125,400 VNĐ',
    date: '2025-08-05T10:35:00',
    isRead: false,
    channel: 'Zalo',
  },
  {
    id: 'NOTIF003',
    type: 'debt_reminder',
    title: 'Nhắc nợ thanh toán',
    message: 'Bạn có số tiền chưa thanh toán cho kỳ 09/2025. Vui lòng thanh toán sớm.',
    date: '2025-09-03T09:00:00',
    isRead: true,
    channel: 'Email',
  },
  {
    id: 'NOTIF004',
    type: 'payment_success',
    title: 'Thanh toán thành công',
    message: 'Giao dịch ORD202507003 đã được thanh toán thành công. Số tiền: 125,400 VNĐ',
    date: '2025-07-03T14:25:00',
    isRead: true,
    channel: 'Zalo',
  },
];

// Mock Support Requests
export const mockSupportRequests = [
  {
    id: 'SUP001',
    type: 'incorrect_population',
    title: 'Báo sai số nhân khẩu',
    description: 'Số nhân khẩu hiện tại không đúng với thực tế',
    status: 'Đang xử lý',
    createdAt: '2025-01-05T10:00:00',
    response: null,
  },
  {
    id: 'SUP002',
    type: 'not_received',
    title: 'Chưa nhận biên lai',
    description: 'Tôi đã thanh toán nhưng chưa nhận được biên lai',
    status: 'Đã giải quyết',
    createdAt: '2025-01-02T14:30:00',
    response: 'Biên lai đã được gửi qua email. Vui lòng kiểm tra hộp thư.',
  },
  {
    id: 'SUP003',
    type: 'incorrect_info',
    title: 'Sai thông tin cá nhân',
    description: 'Thông tin số điện thoại trong hệ thống không đúng',
    status: 'Đã giải quyết',
    createdAt: '2025-01-01T09:15:00',
    response: 'Thông tin đã được cập nhật thành công.',
  },
];

// Support Request Types
export const supportRequestTypes = [
  { id: 'incorrect_population', label: 'Báo sai số nhân khẩu', icon: '👥' },
  { id: 'not_received', label: 'Chưa nhận', icon: '📄' },
  { id: 'incorrect_info', label: 'Sai thông tin', icon: '✏️' },
  { id: 'check_receipt', label: 'Kiểm tra biên lai', icon: '🔍' },
];

// Payment Methods
export const paymentMethods = [
  { id: 'payos', name: 'PayOS', icon: '💳' },
  { id: 'momo', name: 'MoMo', icon: '📱' },
  { id: 'qr', name: 'QR Code', icon: '📷' },
];


# MTThangLong - Ứng dụng Quản lý Thanh toán Dịch vụ

Ứng dụng React Native Expo để quản lý thanh toán phí dịch vụ chung cư/khu dân cư.

## Công nghệ sử dụng

- React Native Expo SDK 51
- React Navigation (Stack & Bottom Tabs)
- AsyncStorage để lưu trữ dữ liệu local
- Expo Vector Icons

## Các chức năng chính

1. **Đăng nhập & Quản lý thông tin**
   - Đăng nhập tài khoản
   - Xem và cập nhật thông tin cá nhân

2. **Xem số tiền phải đóng**
   - Chi tiết số tiền tháng
   - Công nợ
   - Lịch sử kỳ thu

3. **Thanh toán online**
   - PayOS
   - MoMo
   - QR Code
   - Hiển thị số tiền, mã hộ, mã đơn hàng

4. **Xem biên lai/Hóa đơn**
   - Xem online
   - Tải PDF
   - Kiểm tra giao dịch

5. **Lịch sử giao dịch**
   - Xem toàn bộ & theo kỳ
   - Tải PDF

6. **Nhận thông báo**
   - Nhắc nợ
   - Thanh toán thành công
   - Email/Zalo

7. **Gửi yêu cầu hỗ trợ**
   - Báo sai số nhân khẩu
   - Chưa nhận
   - Sai thông tin
   - Kiểm tra biên lai

8. **Cài đặt**
   - Đăng xuất
   - Các tùy chọn khác

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy ứng dụng
npm start

# Chạy trên Android
npm run android

# Chạy trên iOS
npm run ios

# Chạy trên Web
npm run web
```

## Cấu trúc thư mục

```
MTThangLong/
├── src/
│   ├── data/
│   │   └── mockData.js          # Mock data cho tất cả chức năng
│   ├── navigation/
│   │   └── AppNavigator.js      # Cấu hình navigation
│   ├── screens/
│   │   ├── LoginScreen.js       # Màn hình đăng nhập
│   │   ├── HomeScreen.js        # Trang chủ
│   │   ├── PaymentAmountScreen.js # Xem số tiền phải đóng
│   │   ├── PaymentScreen.js     # Thanh toán online
│   │   ├── ReceiptScreen.js     # Xem biên lai/hóa đơn
│   │   ├── TransactionHistoryScreen.js # Lịch sử giao dịch
│   │   ├── NotificationScreen.js # Thông báo
│   │   ├── SupportScreen.js     # Hỗ trợ
│   │   ├── ProfileScreen.js     # Thông tin cá nhân
│   │   └── SettingsScreen.js    # Cài đặt
│   ├── styles/
│   │   ├── colors.js            # Màu sắc
│   │   └── commonStyles.js      # Styles chung
│   └── utils/
│       └── storage.js           # Utilities cho AsyncStorage
├── App.js                       # Entry point
└── package.json
```

## Mock Data

Tất cả dữ liệu hiện tại là mock data được định nghĩa trong `src/data/mockData.js`. Trong môi trường production, bạn sẽ cần tích hợp với API thật.

## Demo Login

Để đăng nhập, nhập bất kỳ username và password nào (không cần đúng format).

## Yêu cầu hệ thống

- Node.js 18
- Expo SDK 51
- npm hoặc yarn

## License

Private


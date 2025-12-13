import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { paymentMethods, mockUser } from '../data/mockData';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentScreen({ route, navigation }) {
  const { amount } = route.params || { amount: 0 };
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handlePayment = () => {
    if (!selectedMethod) {
      Alert.alert('Thông báo', 'Vui lòng chọn phương thức thanh toán');
      return;
    }

    // Mock payment - trong thực tế sẽ gọi API
    Alert.alert(
      'Thành công',
      `Thanh toán ${amount.toLocaleString('vi-VN')} VNĐ bằng ${paymentMethods.find(m => m.id === selectedMethod)?.name} thành công!`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.content}>
        {/* Thông tin thanh toán */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Thông tin thanh toán</Text>
          <View style={styles.infoRow}>
            <Text style={commonStyles.textSecondary}>Mã hộ:</Text>
            <Text style={commonStyles.text}>{mockUser.householdCode}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={commonStyles.textSecondary}>Mã đơn hàng:</Text>
            <Text style={commonStyles.text}>ORD{Date.now()}</Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={commonStyles.textSecondary}>Số tiền:</Text>
            <Text style={styles.amount}>{amount.toLocaleString('vi-VN')} VNĐ</Text>
          </View>
        </View>

        {/* Phương thức thanh toán */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Chọn phương thức thanh toán</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                selectedMethod === method.id && styles.paymentMethodSelected,
              ]}
              onPress={() => setSelectedMethod(method.id)}
              activeOpacity={0.7}
            >
              <View style={styles.paymentMethodContent}>
                <View style={styles.paymentIconContainer}>
                  <Text style={styles.paymentIcon}>{method.icon}</Text>
                </View>
                <Text style={styles.paymentName}>{method.name}</Text>
              </View>
              {selectedMethod === method.id && (
                <View style={styles.checkmarkContainer}>
                  <Ionicons name="checkmark-circle" size={28} color={colors.primary} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Nút thanh toán */}
        <TouchableOpacity
          style={[commonStyles.button, styles.payButton]}
          onPress={handlePayment}
        >
          <Text style={commonStyles.buttonText}>Xác nhận thanh toán</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  amountContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 8,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  paymentMethodSelected: {
    borderColor: colors.primary,
    backgroundColor: '#E3F2FD',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  paymentIcon: {
    fontSize: 28,
  },
  paymentName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  checkmarkContainer: {
    marginLeft: 12,
  },
  payButton: {
    marginTop: 24,
  },
});


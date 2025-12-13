import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { mockPaymentAmount } from '../data/mockData';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentAmountScreen({ navigation }) {
  const { currentMonth, debt, collectionHistory } = mockPaymentAmount;

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.content}>
        {/* Chi tiết số tiền tháng hiện tại */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Chi tiết số tiền tháng</Text>
          <Text style={styles.period}>{currentMonth.month}</Text>
          <Text style={styles.totalAmount}>
            {currentMonth.totalAmount.toLocaleString('vi-VN')} VNĐ
          </Text>

          <View style={styles.breakdown}>
            {currentMonth.breakdown.map((item, index) => (
              <View key={index} style={styles.breakdownItem}>
                <Text style={commonStyles.text}>{item.name}</Text>
                <Text style={commonStyles.text}>
                  {item.amount.toLocaleString('vi-VN')} VNĐ
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[commonStyles.button, styles.payButton]}
            onPress={() => navigation.navigate('PaymentScreen', { amount: currentMonth.totalAmount })}
            activeOpacity={0.8}
          >
            <Ionicons name="card" size={20} color={colors.white} />
            <Text style={[commonStyles.buttonText, { marginLeft: 8 }]}>
              Thanh toán ngay
            </Text>
          </TouchableOpacity>
        </View>

        {/* Công nợ */}
        {debt.totalDebt > 0 && (
          <View style={commonStyles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="warning" size={24} color={colors.warning} />
              <Text style={commonStyles.subtitle}>Công nợ</Text>
            </View>
            <Text style={styles.debtAmount}>
              {debt.totalDebt.toLocaleString('vi-VN')} VNĐ
            </Text>

            <View style={styles.debtList}>
              {debt.periods.map((period, index) => (
                <View key={index} style={styles.debtItem}>
                  <View>
                    <Text style={commonStyles.text}>Kỳ thu: {period.period}</Text>
                    <Text style={commonStyles.textSecondary}>{period.status}</Text>
                  </View>
                  <Text style={styles.debtItemAmount}>
                    {period.amount.toLocaleString('vi-VN')} VNĐ
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[commonStyles.button, commonStyles.buttonDanger]}
              onPress={() => navigation.navigate('PaymentScreen', { amount: debt.totalDebt })}
            >
              <Text style={commonStyles.buttonText}>Thanh toán công nợ</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Lịch sử kỳ thu */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Lịch sử kỳ thu</Text>
          {collectionHistory.map((item, index) => (
            <View key={index} style={styles.historyItem}>
              <View style={styles.historyInfo}>
                <Text style={commonStyles.text}>Kỳ thu: {item.period}</Text>
                <Text style={commonStyles.textSecondary}>
                  Ngày thanh toán: {item.paymentDate}
                </Text>
              </View>
              <View style={styles.historyRight}>
                <Text style={styles.historyAmount}>
                  {item.amount.toLocaleString('vi-VN')} VNĐ
                </Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  period: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  breakdown: {
    marginBottom: 16,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  payButton: {
    flexDirection: 'row',
    marginTop: 8,
    borderRadius: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  debtAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.warning,
    marginBottom: 16,
  },
  debtList: {
    marginBottom: 16,
  },
  debtItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  debtItemAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.warning,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  historyInfo: {
    flex: 1,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  statusBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
});


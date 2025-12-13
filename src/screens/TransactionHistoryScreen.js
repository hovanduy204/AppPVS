import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { mockTransactions } from '../data/mockData';
import { Ionicons } from '@expo/vector-icons';

export default function TransactionHistoryScreen({ navigation }) {
  const [filter, setFilter] = useState('all'); // 'all', 'period'

  const periods = [...new Set(mockTransactions.map(t => t.period))];
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  const filteredTransactions =
    filter === 'all'
      ? mockTransactions
      : mockTransactions.filter(t => t.period === selectedPeriod);

  const handleDownloadPDF = (transaction) => {
    Alert.alert('Thành công', `Đã tải PDF cho giao dịch ${transaction.orderCode}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={commonStyles.container}>
      {/* Filter */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => {
            setFilter('all');
            setSelectedPeriod(null);
          }}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'all' && styles.filterTextActive,
            ]}
          >
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'period' && styles.filterButtonActive]}
          onPress={() => setFilter('period')}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'period' && styles.filterTextActive,
            ]}
          >
            Theo kỳ
          </Text>
        </TouchableOpacity>
      </View>

      {/* Period Selector */}
      {filter === 'period' && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.periodSelector}
        >
          {periods.map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period && styles.periodTextActive,
                ]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Transactions List */}
      <ScrollView style={styles.content}>
        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color={colors.lightGray} />
            <Text style={styles.emptyText}>Không có giao dịch</Text>
          </View>
        ) : (
          filteredTransactions.map((transaction) => (
            <View key={transaction.id} style={commonStyles.card}>
              <View style={styles.transactionHeader}>
                <View>
                  <Text style={commonStyles.subtitle}>{transaction.description}</Text>
                  <Text style={commonStyles.textSecondary}>
                    {formatDate(transaction.transactionDate)}
                  </Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{transaction.status}</Text>
                </View>
              </View>

              <View style={styles.transactionInfo}>
                <View style={styles.infoRow}>
                  <Text style={commonStyles.textSecondary}>Mã đơn hàng:</Text>
                  <Text style={commonStyles.text}>{transaction.orderCode}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={commonStyles.textSecondary}>Kỳ thu:</Text>
                  <Text style={commonStyles.text}>{transaction.period}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={commonStyles.textSecondary}>Phương thức:</Text>
                  <Text style={commonStyles.text}>{transaction.paymentMethod}</Text>
                </View>
                <View style={styles.amountRow}>
                  <Text style={commonStyles.textSecondary}>Số tiền:</Text>
                  <Text style={styles.amount}>
                    {transaction.amount.toLocaleString('vi-VN')} VNĐ
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => handleDownloadPDF(transaction)}
              >
                <Ionicons name="download-outline" size={20} color={colors.primary} />
                <Text style={styles.downloadText}>Tải PDF</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.white,
  },
  periodSelector: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
  },
  periodText: {
    fontSize: 14,
    color: colors.text,
  },
  periodTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  transactionInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  downloadText: {
    marginLeft: 8,
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
});


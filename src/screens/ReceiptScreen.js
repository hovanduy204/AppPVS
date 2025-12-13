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
import { mockReceipts } from '../data/mockData';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export default function ReceiptScreen({ navigation }) {
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const handleViewOnline = (receipt) => {
    setSelectedReceipt(receipt);
    Alert.alert('Xem biên lai', `Biên lai số: ${receipt.receiptNumber}`);
  };

  const handleDownloadPDF = async (receipt) => {
    try {
      // Mock download - trong thực tế sẽ tải file PDF thật
      Alert.alert('Thành công', `Đã tải biên lai ${receipt.receiptNumber}.pdf`);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải biên lai');
    }
  };

  const handleCheckTransaction = (receipt) => {
    Alert.alert(
      'Kiểm tra giao dịch',
      `Mã đơn hàng: ${receipt.orderCode}\nTrạng thái: ${receipt.status}\nNgày phát hành: ${receipt.issueDate}`
    );
  };

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.content}>
        {mockReceipts.map((receipt) => (
          <View key={receipt.id} style={commonStyles.card}>
            <View style={styles.receiptHeader}>
              <View>
                <Text style={commonStyles.subtitle}>Biên lai số: {receipt.receiptNumber}</Text>
                <Text style={commonStyles.textSecondary}>
                  Kỳ thu: {receipt.period}
                </Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{receipt.status}</Text>
              </View>
            </View>

            <View style={styles.amountSection}>
              <Text style={styles.amount}>
                {receipt.amount.toLocaleString('vi-VN')} VNĐ
              </Text>
            </View>

            <View style={styles.breakdown}>
              <Text style={styles.breakdownTitle}>Chi tiết:</Text>
              {receipt.breakdown.map((item, index) => (
                <View key={index} style={styles.breakdownItem}>
                  <Text style={commonStyles.text}>{item.name}</Text>
                  <Text style={commonStyles.text}>
                    {item.amount.toLocaleString('vi-VN')} VNĐ
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.receiptInfo}>
              <View style={styles.infoRow}>
                <Text style={commonStyles.textSecondary}>Mã đơn hàng:</Text>
                <Text style={commonStyles.text}>{receipt.orderCode}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={commonStyles.textSecondary}>Ngày phát hành:</Text>
                <Text style={commonStyles.text}>{receipt.issueDate}</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleViewOnline(receipt)}
              >
                <Ionicons name="eye-outline" size={20} color={colors.primary} />
                <Text style={styles.actionText}>Xem online</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDownloadPDF(receipt)}
              >
                <Ionicons name="download-outline" size={20} color={colors.secondary} />
                <Text style={styles.actionText}>Tải PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleCheckTransaction(receipt)}
              >
                <Ionicons name="checkmark-circle-outline" size={20} color={colors.success} />
                <Text style={styles.actionText}>Kiểm tra</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {selectedReceipt && (
          <View style={styles.detailModal}>
            <View style={styles.detailContent}>
              <Text style={commonStyles.subtitle}>Chi tiết biên lai</Text>
              <Text style={commonStyles.text}>
                Biên lai số: {selectedReceipt.receiptNumber}
              </Text>
              <Text style={commonStyles.text}>
                Kỳ thu: {selectedReceipt.period}
              </Text>
              <Text style={commonStyles.text}>
                Số tiền: {selectedReceipt.amount.toLocaleString('vi-VN')} VNĐ
              </Text>
              <TouchableOpacity
                style={[commonStyles.button, { marginTop: 16 }]}
                onPress={() => setSelectedReceipt(null)}
              >
                <Text style={commonStyles.buttonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
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
  amountSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  amount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  breakdown: {
    marginBottom: 16,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  receiptInfo: {
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 4,
    fontSize: 12,
    color: colors.text,
  },
  detailModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    width: '90%',
  },
});


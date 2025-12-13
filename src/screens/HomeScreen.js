import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Platform,
  Dimensions,
} from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { mockUser, mockPaymentAmount, mockNotifications, mockTransactions } from '../data/mockData';
import { storage } from '../utils/storage';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await storage.getUser();
    setUser(userData || mockUser);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUser();
    setRefreshing(false);
  };

  const unreadCount = mockNotifications.filter(n => !n.isRead).length;
  const recentTransactions = mockTransactions.slice(0, 3);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  return (
    <ScrollView
      style={commonStyles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Header với gradient */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={28} color={colors.primary} />
              </View>
            </View>
            <View style={styles.userText}>
              <Text style={styles.greeting}>Xin chào</Text>
              <Text style={styles.name} numberOfLines={1}>
                {user?.fullName || 'Người dùng'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notification')}
            style={styles.notificationButton}
          >
            <View style={styles.notificationIconContainer}>
              <Ionicons name="notifications-outline" size={26} color={colors.white} />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Card số tiền phải đóng - nổi bật */}
        <View style={styles.paymentHighlightCard}>
          <View style={styles.paymentCardHeader}>
            <View style={styles.paymentCardTitleRow}>
              <View style={styles.paymentIconWrapper}>
                <Ionicons name="wallet" size={28} color={colors.white} />
              </View>
              <View>
                <Text style={styles.paymentCardLabel}>Số tiền phải đóng</Text>
                <Text style={styles.paymentCardPeriod}>
                  Kỳ thu: {mockPaymentAmount.currentMonth.month}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Payment')}
              style={styles.viewDetailButton}
            >
              <Ionicons name="chevron-forward" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.paymentAmount}>
            {mockPaymentAmount.currentMonth.totalAmount.toLocaleString('vi-VN')}
          </Text>
          <Text style={styles.paymentCurrency}>VNĐ</Text>
          
          {mockPaymentAmount.debt.totalDebt > 0 && (
            <View style={styles.debtAlert}>
              <Ionicons name="alert-circle" size={18} color={colors.warning} />
              <Text style={styles.debtAlertText}>
                Công nợ: {mockPaymentAmount.debt.totalDebt.toLocaleString('vi-VN')} VNĐ
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.content}>
        {/* Quick Actions - Cải thiện */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thao tác nhanh</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('Payment')}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="card" size={32} color={colors.primary} />
              </View>
              <Text style={styles.quickActionLabel}>Thanh toán</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('History')}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#E8E5FF' }]}>
                <Ionicons name="receipt" size={32} color={colors.secondary} />
              </View>
              <Text style={styles.quickActionLabel}>Lịch sử</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('ReceiptScreen')}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FFF4E6' }]}>
                <Ionicons name="document-text" size={32} color={colors.warning} />
              </View>
              <Text style={styles.quickActionLabel}>Biên lai</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('SupportScreen')}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#E5F9ED' }]}>
                <Ionicons name="help-circle" size={32} color={colors.success} />
              </View>
              <Text style={styles.quickActionLabel}>Hỗ trợ</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quản lý nhân khẩu/Nhân viên */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <TouchableOpacity
              onPress={() => navigation.navigate('PopulationManagementScreen')}
              style={styles.populationCard}
            >
              <View style={styles.populationCardLeft}>
                <View style={styles.populationIconContainer}>
                  <Ionicons 
                    name={user?.accountType === 'company' ? 'business' : 'people'} 
                    size={28} 
                    color={colors.primary} 
                  />
                </View>
                <View>
                  <Text style={styles.populationCardTitle}>
                    {user?.accountType === 'company' 
                      ? 'Quản lý nhân viên' 
                      : 'Quản lý nhân khẩu'}
                  </Text>
                  <Text style={styles.populationCardSubtitle}>
                    {user?.population || 4} {user?.accountType === 'company' ? 'nhân viên' : 'người trong hộ'}
                    {user?.accountType === 'company' && user?.companyName && (
                      <Text style={styles.companyNameText}> • {user.companyName}</Text>
                    )}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Thông tin tài khoản */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Ionicons name="home-outline" size={20} color={colors.primary} />
              <Text style={styles.infoCardTitle}>Thông tin tài khoản</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Mã hộ</Text>
                <Text style={styles.infoValue}>{user?.householdCode || 'HH001234'}</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Địa chỉ</Text>
                <Text style={styles.infoValue} numberOfLines={1}>
                  {user?.address?.split(',')[0] || '123 Đường ABC'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Giao dịch gần đây */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          {recentTransactions.map((transaction, index) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionLeft}>
                <View style={styles.transactionIconContainer}>
                  <Ionicons 
                    name={transaction.paymentMethod === 'MoMo' ? 'phone-portrait' : transaction.paymentMethod === 'PayOS' ? 'card' : 'qr-code'} 
                    size={20} 
                    color={colors.primary} 
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDescription} numberOfLines={1}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {formatDate(transaction.transactionDate)}
                  </Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text style={styles.transactionAmount}>
                  {transaction.amount.toLocaleString('vi-VN')} VNĐ
                </Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{transaction.status}</Text>
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
  header: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  userText: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.3,
  },
  notificationButton: {
    padding: 8,
  },
  notificationIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  paymentHighlightCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  paymentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentCardLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  paymentCardPeriod: {
    fontSize: 12,
    color: colors.textLight,
  },
  viewDetailButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -1,
    marginBottom: 4,
  },
  paymentCurrency: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  debtAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF4E6',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  debtAlertText: {
    marginLeft: 8,
    fontSize: 13,
    color: colors.warning,
    fontWeight: '600',
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 60) / 2,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  quickActionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
  },
  infoItem: {
    flex: 1,
  },
  infoDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.success,
    marginBottom: 4,
  },
  statusBadge: {
    backgroundColor: '#E5F9ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    color: colors.success,
    fontWeight: '600',
  },
  populationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  populationCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  populationIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  populationCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  populationCardSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  companyNameText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
});

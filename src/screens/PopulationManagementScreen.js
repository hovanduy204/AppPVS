import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { 
  mockPopulationMembers, 
  priceTableByPopulation, 
  priceTableByCompany,
  calculatePrice,
  mockUser,
  mockCompanyEmployees,
} from '../data/mockData';
import { storage } from '../utils/storage';
import { Ionicons } from '@expo/vector-icons';

export default function PopulationManagementScreen({ navigation }) {
  const [members, setMembers] = useState(mockPopulationMembers);
  const [user, setUser] = useState(null);
  const [currentPopulation, setCurrentPopulation] = useState(4);
  const [accountType, setAccountType] = useState('household'); // 'household' hoặc 'company'

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await storage.getUser();
    const userInfo = userData || mockUser;
    setUser(userInfo);
    setAccountType(userInfo.accountType || 'household');
    
    if (userInfo.accountType === 'company') {
      setMembers(mockCompanyEmployees);
      setCurrentPopulation(userInfo.population || mockCompanyEmployees.length);
    } else {
      setMembers(mockPopulationMembers);
      setCurrentPopulation(userInfo.population || mockPopulationMembers.length);
    }
  };

  const priceInfo = calculatePrice(currentPopulation, accountType);
  const priceTable = accountType === 'company' ? priceTableByCompany : priceTableByPopulation;
  const title = accountType === 'company' ? 'Quản lý nhân viên' : 'Quản lý nhân khẩu';
  const label = accountType === 'company' ? 'Tổng số nhân viên' : 'Tổng số nhân khẩu';
  const unit = accountType === 'company' ? 'nhân viên' : 'người';

  const handleAddMember = () => {
    Alert.alert('Thêm nhân khẩu', 'Chức năng này sẽ được tích hợp với API');
  };

  const handleEditMember = (member) => {
    Alert.alert('Chỉnh sửa', `Chỉnh sửa thông tin ${member.fullName}`);
  };

  const handleRemoveMember = (member) => {
    Alert.alert(
      'Xóa nhân khẩu',
      `Bạn có chắc chắn muốn xóa ${member.fullName}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            setMembers(members.filter((m) => m.id !== member.id));
            setCurrentPopulation(currentPopulation - 1);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.content}>
        {/* Thông tin tổng quan */}
        <View style={[commonStyles.card, styles.summaryCard]}>
          {/* Account Type Badge */}
          <View style={styles.accountTypeContainer}>
            <View style={styles.accountTypeBadge}>
              <Ionicons 
                name={accountType === 'company' ? 'business' : 'home'} 
                size={16} 
                color={colors.white} 
              />
              <Text style={styles.accountTypeText}>
                {accountType === 'company' ? 'Công ty' : 'Hộ gia đình'}
              </Text>
            </View>
            {user?.companyName && (
              <Text style={styles.companyName}>{user.companyName}</Text>
            )}
          </View>
          
          <View style={styles.summaryHeader}>
            <View style={styles.summaryIconContainer}>
              <Ionicons name="people" size={32} color={colors.primary} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>{label}</Text>
              <Text style={styles.summaryValue}>{currentPopulation} {unit}</Text>
            </View>
          </View>
          <View style={styles.priceInfoContainer}>
            <View style={styles.priceInfoRow}>
              <Text style={styles.priceLabel}>Mức giá áp dụng:</Text>
              <Text style={styles.priceValue}>{priceInfo.range}</Text>
            </View>
            <View style={styles.priceInfoRow}>
              <Text style={styles.priceLabel}>Giá / 1 người:</Text>
              <Text style={styles.priceValue}>
                {priceInfo.pricePerPerson.toLocaleString('vi-VN')} VNĐ
              </Text>
            </View>
            <View style={styles.totalPriceContainer}>
              <Text style={styles.totalPriceLabel}>Tổng tiền:</Text>
              <Text style={styles.totalPriceValue}>
                {priceInfo.totalPrice.toLocaleString('vi-VN')} VNĐ
              </Text>
            </View>
          </View>
        </View>

        {/* Bảng giá */}
        <View style={commonStyles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="pricetag-outline" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>
              {accountType === 'company' 
                ? 'Bảng giá theo số nhân viên' 
                : 'Bảng giá theo số nhân khẩu'}
            </Text>
          </View>
          <View style={styles.priceTable}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Số người</Text>
              <Text style={styles.tableHeaderText}>Giá / người</Text>
              <Text style={styles.tableHeaderText}>Mô tả</Text>
            </View>
            {priceTableByPopulation.map((row, index) => {
              const isCurrentRange =
                currentPopulation >= row.min && currentPopulation <= row.max;
              return (
                <View
                  key={row.id}
                  style={[
                    styles.tableRow,
                    isCurrentRange && styles.tableRowActive,
                  ]}
                >
                  <View style={styles.tableCell}>
                    <Text
                      style={[
                        styles.tableCellText,
                        isCurrentRange && styles.tableCellTextActive,
                      ]}
                    >
                      {row.range}
                    </Text>
                    {isCurrentRange && (
                      <View style={styles.currentBadge}>
                        <Text style={styles.currentBadgeText}>Hiện tại</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.tableCell}>
                    <Text
                      style={[
                        styles.tableCellText,
                        styles.tableCellPrice,
                        isCurrentRange && styles.tableCellTextActive,
                      ]}
                    >
                      {row.pricePerPerson.toLocaleString('vi-VN')} VNĐ
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text
                      style={[
                        styles.tableCellText,
                        styles.tableCellDescription,
                        isCurrentRange && styles.tableCellTextActive,
                      ]}
                    >
                      {row.description}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Danh sách */}
        <View style={commonStyles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list-outline" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>
              {accountType === 'company' 
                ? 'Danh sách nhân viên' 
                : 'Danh sách nhân khẩu'}
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddMember}
            >
              <Ionicons name="add-circle" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {members.map((member, index) => (
            <View key={member.id} style={styles.memberCard}>
              <View style={styles.memberHeader}>
                <View style={styles.memberAvatar}>
                  <Ionicons
                    name="person"
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.fullName}</Text>
                  <Text style={styles.memberRelationship}>
                    {accountType === 'company' 
                      ? member.position || 'Nhân viên'
                      : member.relationship}
                  </Text>
                  {accountType === 'company' && member.employeeCode && (
                    <Text style={styles.employeeCode}>
                      Mã NV: {member.employeeCode}
                    </Text>
                  )}
                </View>
                <View style={styles.memberActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEditMember(member)}
                  >
                    <Ionicons name="create-outline" size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleRemoveMember(member)}
                  >
                    <Ionicons name="trash-outline" size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.memberDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="card-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.detailText}>
                    CMND/CCCD: {member.identityCard}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.detailText}>
                    Ngày sinh: {member.dateOfBirth}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="person-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.detailText}>Giới tính: {member.gender}</Text>
                </View>
                {member.phone && (
                  <View style={styles.detailRow}>
                    <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.detailText}>SĐT: {member.phone}</Text>
                  </View>
                )}
                {accountType === 'company' && member.email && (
                  <View style={styles.detailRow}>
                    <Ionicons name="mail-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.detailText}>Email: {member.email}</Text>
                  </View>
                )}
                {accountType === 'company' && member.startDate && (
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.detailText}>
                      Ngày vào làm: {member.startDate}
                    </Text>
                  </View>
                )}
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
    padding: 20,
  },
  summaryCard: {
    backgroundColor: colors.primary,
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.5,
  },
  priceInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
  },
  priceInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  totalPriceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  totalPriceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  addButton: {
    padding: 4,
  },
  priceTable: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tableRowActive: {
    backgroundColor: '#E3F2FD',
    borderColor: colors.primary,
    borderWidth: 2,
  },
  tableCell: {
    flex: 1,
    justifyContent: 'center',
  },
  tableCellText: {
    fontSize: 13,
    color: colors.text,
  },
  tableCellTextActive: {
    fontWeight: '600',
    color: colors.primary,
  },
  tableCellPrice: {
    fontWeight: '600',
  },
  tableCellDescription: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  currentBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  currentBadgeText: {
    fontSize: 10,
    color: colors.white,
    fontWeight: '600',
  },
  accountTypeContainer: {
    marginBottom: 16,
  },
  accountTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  accountTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
    marginLeft: 6,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  employeeCode: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  memberCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  memberRelationship: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  memberActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  memberDetails: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
  },
});


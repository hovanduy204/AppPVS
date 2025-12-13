import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { mockUser } from '../data/mockData';
import { storage } from '../utils/storage';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await storage.getUser();
    setUser(userData || mockUser);
    setEditedUser(userData || mockUser);
  };

  const handleSave = async () => {
    await storage.saveUser(editedUser);
    setUser(editedUser);
    setIsEditing(false);
    Alert.alert('Thành công', 'Thông tin đã được cập nhật');
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color={colors.primary} />
          </View>
          <Text style={styles.name}>{user?.fullName || 'Người dùng'}</Text>
          <Text style={styles.username}>{user?.username || 'user001'}</Text>
        </View>

        {/* Profile Info */}
        <View style={commonStyles.card}>
          <View style={styles.cardHeader}>
            <Text style={commonStyles.subtitle}>Thông tin cơ bản</Text>
            {!isEditing ? (
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Ionicons name="create-outline" size={24} color={colors.primary} />
              </TouchableOpacity>
            ) : (
              <View style={styles.editActions}>
                <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                  <Ionicons name="close-circle-outline" size={24} color={colors.error} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                  <Ionicons name="checkmark-circle-outline" size={24} color={colors.success} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Họ và tên</Text>
            {isEditing ? (
              <TextInput
                style={commonStyles.input}
                value={editedUser?.fullName}
                onChangeText={(text) =>
                  setEditedUser({ ...editedUser, fullName: text })
                }
              />
            ) : (
              <Text style={commonStyles.text}>{user?.fullName}</Text>
            )}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Email</Text>
            {isEditing ? (
              <TextInput
                style={commonStyles.input}
                value={editedUser?.email}
                onChangeText={(text) =>
                  setEditedUser({ ...editedUser, email: text })
                }
                keyboardType="email-address"
              />
            ) : (
              <Text style={commonStyles.text}>{user?.email}</Text>
            )}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Số điện thoại</Text>
            {isEditing ? (
              <TextInput
                style={commonStyles.input}
                value={editedUser?.phone}
                onChangeText={(text) =>
                  setEditedUser({ ...editedUser, phone: text })
                }
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={commonStyles.text}>{user?.phone}</Text>
            )}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Địa chỉ</Text>
            {isEditing ? (
              <TextInput
                style={commonStyles.input}
                value={editedUser?.address}
                onChangeText={(text) =>
                  setEditedUser({ ...editedUser, address: text })
                }
                multiline
              />
            ) : (
              <Text style={commonStyles.text}>{user?.address}</Text>
            )}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Mã {user?.accountType === 'company' ? 'công ty' : 'hộ'}</Text>
            <Text style={commonStyles.text}>{user?.householdCode}</Text>
          </View>

          {user?.accountType === 'company' && user?.companyName && (
            <View style={styles.infoSection}>
              <Text style={styles.label}>Tên công ty</Text>
              <Text style={commonStyles.text}>{user.companyName}</Text>
            </View>
          )}

          {user?.accountType === 'company' && user?.taxCode && (
            <View style={styles.infoSection}>
              <Text style={styles.label}>Mã số thuế</Text>
              <Text style={commonStyles.text}>{user.taxCode}</Text>
            </View>
          )}

          <View style={styles.infoSection}>
            <Text style={styles.label}>
              {user?.accountType === 'company' ? 'Số nhân viên' : 'Số nhân khẩu'}
            </Text>
            <Text style={commonStyles.text}>
              {user?.population || 4} {user?.accountType === 'company' ? 'người' : 'người'}
            </Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>CMND/CCCD</Text>
            <Text style={commonStyles.text}>{user?.identityCard}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Ngày sinh</Text>
            <Text style={commonStyles.text}>{user?.dateOfBirth}</Text>
          </View>
        </View>

        {/* Population Management Button */}
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('PopulationManagementScreen')}
        >
          <Ionicons name="people-outline" size={24} color={colors.text} />
          <Text style={styles.settingsText}>Quản lý nhân khẩu</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Settings Button */}
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('SettingsScreen')}
        >
          <Ionicons name="settings-outline" size={24} color={colors.text} />
          <Text style={styles.settingsText}>Cài đặt</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editActions: {
    flexDirection: 'row',
  },
  cancelButton: {
    marginRight: 12,
  },
  infoSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  settingsText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
});


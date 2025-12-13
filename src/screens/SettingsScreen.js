import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { storage } from '../utils/storage';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }) {
  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await storage.removeUser();
            await storage.setLoggedIn(false);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.content}>
        {/* App Info */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Thông tin ứng dụng</Text>
          <View style={styles.infoRow}>
            <Text style={commonStyles.textSecondary}>Phiên bản</Text>
            <Text style={commonStyles.text}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={commonStyles.textSecondary}>Tên ứng dụng</Text>
            <Text style={commonStyles.text}>MTThangLong</Text>
          </View>
        </View>

        {/* Settings Options */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Cài đặt</Text>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            <Text style={styles.settingText}>Thông báo</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="language-outline" size={24} color={colors.text} />
            <Text style={styles.settingText}>Ngôn ngữ</Text>
            <Text style={styles.settingValue}>Tiếng Việt</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="shield-checkmark-outline" size={24} color={colors.text} />
            <Text style={styles.settingText}>Bảo mật</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="help-circle-outline" size={24} color={colors.text} />
            <Text style={styles.settingText}>Trợ giúp</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="information-circle-outline" size={24} color={colors.text} />
            <Text style={styles.settingText}>Về ứng dụng</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[commonStyles.button, commonStyles.buttonDanger, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.white} />
          <Text style={[commonStyles.buttonText, { marginLeft: 8 }]}>
            Đăng xuất
          </Text>
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  settingText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  settingValue: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    marginTop: 24,
  },
});


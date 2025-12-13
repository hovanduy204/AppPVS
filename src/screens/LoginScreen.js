import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { mockUser, mockCompanyUser } from '../data/mockData';
import { storage } from '../utils/storage';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Mock login - trong thực tế sẽ gọi API
    if (username && password) {
      let user;
      
      // Kiểm tra nếu đăng nhập với tài khoản công ty
      if (username.toLowerCase().includes('company') || username === 'company001') {
        user = { 
          ...mockCompanyUser, 
          username, 
          isLoggedIn: true 
        };
      } else {
        user = { 
          ...mockUser, 
          username, 
          isLoggedIn: true 
        };
      }
      
      await storage.saveUser(user);
      await storage.setLoggedIn(true);
      navigation.replace('MainTabs');
    } else {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="home" size={48} color={colors.white} />
            </View>
          </View>
          <Text style={styles.logo}>APP PVS DEMO</Text>
          <Text style={styles.subtitle}>Quản lý thanh toán dịch vụ</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[commonStyles.input, styles.inputWithIcon]}
              placeholder="Tên đăng nhập"
              placeholderTextColor={colors.textLight}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[commonStyles.input, styles.inputWithIcon]}
              placeholder="Mật khẩu"
              placeholderTextColor={colors.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[commonStyles.button, styles.loginButton]} 
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={commonStyles.buttonText}>Đăng nhập</Text>
          </TouchableOpacity>

          <View style={styles.demoInfo}>
            <Ionicons name="information-circle-outline" size={16} color={colors.textLight} />
            <Text style={styles.demoText}>Demo: Nhập bất kỳ để đăng nhập</Text>
          </View>

          <View style={styles.accountTypeSelector}>
            <Text style={styles.accountTypeLabel}>Loại tài khoản:</Text>
            <View style={styles.accountTypeButtons}>
              <TouchableOpacity
                style={[
                  styles.accountTypeButton,
                  styles.accountTypeButtonActive,
                ]}
                onPress={() => {
                  // Mặc định là hộ gia đình
                }}
              >
                <Ionicons name="home-outline" size={16} color={colors.white} />
                <Text style={styles.accountTypeButtonText}>Hộ gia đình</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.accountTypeButton}
                onPress={() => {
                  Alert.alert(
                    'Đăng nhập công ty',
                    'Tài khoản công ty:\nUsername: company001\nPassword: (bất kỳ)\n\nHoặc nhập "company" vào username để đăng nhập với tài khoản công ty demo'
                  );
                }}
              >
                <Ionicons name="business-outline" size={16} color={colors.primary} />
                <Text style={[styles.accountTypeButtonText, { color: colors.primary }]}>
                  Công ty
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 56,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 18,
    zIndex: 1,
  },
  inputWithIcon: {
    paddingLeft: 48,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  demoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  demoText: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 6,
  },
  accountTypeSelector: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  accountTypeLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  accountTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  accountTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    marginHorizontal: 6,
  },
  accountTypeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  accountTypeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    marginLeft: 6,
  },
});


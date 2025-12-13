import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Try to enable screens
try {
  const { enableScreens } = require('react-native-screens');
  enableScreens();
} catch (e) {
  // Ignore if it fails
}

// Screens
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import PaymentAmountScreen from '../screens/PaymentAmountScreen';
import PaymentScreen from '../screens/PaymentScreen';
import ReceiptScreen from '../screens/ReceiptScreen';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SupportScreen from '../screens/SupportScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PopulationManagementScreen from '../screens/PopulationManagementScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Payment') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Notification') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          backgroundColor: '#FFFFFF',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: '#007AFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Trang chủ', headerShown: false }} />
      <Tab.Screen name="Payment" component={PaymentAmountScreen} options={{ title: 'Thanh toán' }} />
      <Tab.Screen name="History" component={TransactionHistoryScreen} options={{ title: 'Lịch sử giao dịch' }} />
      <Tab.Screen name="Notification" component={NotificationScreen} options={{ title: 'Thông báo' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Thông tin cá nhân' }} />
    </Tab.Navigator>
  );
}

// Root Navigator
export default function AppNavigator() {
  const navigationRef = React.useRef(null);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        // Navigation is ready
      }}
      onStateChange={(state) => {
        // Handle state changes if needed
      }}
    >
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen 
          name="PaymentScreen" 
          component={PaymentScreen} 
          options={{ headerShown: true, title: 'Thanh toán online' }}
        />
        <Stack.Screen 
          name="ReceiptScreen" 
          component={ReceiptScreen} 
          options={{ headerShown: true, title: 'Biên lai/Hóa đơn' }}
        />
        <Stack.Screen 
          name="SupportScreen" 
          component={SupportScreen} 
          options={{ headerShown: true, title: 'Hỗ trợ' }}
        />
        <Stack.Screen 
          name="SettingsScreen" 
          component={SettingsScreen} 
          options={{ headerShown: true, title: 'Cài đặt' }}
        />
        <Stack.Screen 
          name="PopulationManagementScreen" 
          component={PopulationManagementScreen} 
          options={{ headerShown: true, title: 'Quản lý nhân khẩu' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { mockNotifications } from '../data/mockData';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
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

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'debt_reminder':
        return { name: 'warning', color: colors.warning };
      case 'payment_success':
        return { name: 'checkmark-circle', color: colors.success };
      default:
        return { name: 'information-circle', color: colors.primary };
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <View style={commonStyles.container}>
      {unreadCount > 0 && (
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Bạn có {unreadCount} thông báo chưa đọc
          </Text>
        </View>
      )}

      <ScrollView style={styles.content}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-outline" size={64} color={colors.lightGray} />
            <Text style={styles.emptyText}>Không có thông báo</Text>
          </View>
        ) : (
          notifications.map((notification) => {
            const icon = getNotificationIcon(notification.type);
            return (
              <TouchableOpacity
                key={notification.id}
                style={[
                  commonStyles.card,
                  !notification.isRead && styles.unreadCard,
                ]}
                onPress={() => markAsRead(notification.id)}
              >
                <View style={styles.notificationHeader}>
                  <View style={styles.iconContainer}>
                    <Ionicons name={icon.name} size={24} color={icon.color} />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>
                      {notification.title}
                    </Text>
                    <Text style={commonStyles.text}>
                      {notification.message}
                    </Text>
                    <View style={styles.notificationFooter}>
                      <Text style={commonStyles.textSecondary}>
                        {formatDate(notification.date)}
                      </Text>
                      <View style={styles.channelBadge}>
                        <Text style={styles.channelText}>
                          {notification.channel}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {!notification.isRead && (
                    <View style={styles.unreadDot} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    padding: 16,
    alignItems: 'center',
  },
  headerText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
  },
  iconContainer: {
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  channelBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  channelText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  unreadCard: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
    marginTop: 4,
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


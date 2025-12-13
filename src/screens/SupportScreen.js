import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { supportRequestTypes, mockSupportRequests } from '../data/mockData';
import { Ionicons } from '@expo/vector-icons';

export default function SupportScreen({ navigation }) {
  const [requests, setRequests] = useState(mockSupportRequests);
  const [selectedType, setSelectedType] = useState(null);
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = () => {
    if (!selectedType || !description.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    const newRequest = {
      id: `SUP${Date.now()}`,
      type: selectedType,
      title: supportRequestTypes.find(t => t.id === selectedType)?.label || '',
      description,
      status: 'Đang xử lý',
      createdAt: new Date().toISOString(),
      response: null,
    };

    setRequests([newRequest, ...requests]);
    setShowForm(false);
    setSelectedType(null);
    setDescription('');
    Alert.alert('Thành công', 'Yêu cầu hỗ trợ đã được gửi');
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang xử lý':
        return colors.warning;
      case 'Đã giải quyết':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.content}>
        {/* New Request Button */}
        <TouchableOpacity
          style={commonStyles.button}
          onPress={() => setShowForm(!showForm)}
        >
          <Ionicons name="add-circle-outline" size={20} color={colors.white} />
          <Text style={[commonStyles.buttonText, { marginLeft: 8 }]}>
            Gửi yêu cầu hỗ trợ mới
          </Text>
        </TouchableOpacity>

        {/* Request Form */}
        {showForm && (
          <View style={commonStyles.card}>
            <Text style={commonStyles.subtitle}>Loại yêu cầu</Text>
            <View style={styles.typeGrid}>
              {supportRequestTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeButton,
                    selectedType === type.id && styles.typeButtonSelected,
                  ]}
                  onPress={() => setSelectedType(type.id)}
                >
                  <Text style={styles.typeIcon}>{type.icon}</Text>
                  <Text
                    style={[
                      styles.typeText,
                      selectedType === type.id && styles.typeTextSelected,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[commonStyles.subtitle, { marginTop: 16 }]}>
              Mô tả chi tiết
            </Text>
            <TextInput
              style={styles.textArea}
              placeholder="Nhập mô tả chi tiết về yêu cầu của bạn..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.formActions}>
              <TouchableOpacity
                style={[commonStyles.button, commonStyles.buttonSecondary]}
                onPress={() => {
                  setShowForm(false);
                  setSelectedType(null);
                  setDescription('');
                }}
              >
                <Text style={commonStyles.buttonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[commonStyles.button, { flex: 1, marginLeft: 12 }]}
                onPress={handleSubmit}
              >
                <Text style={commonStyles.buttonText}>Gửi yêu cầu</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Requests List */}
        <View style={styles.requestsList}>
          <Text style={commonStyles.subtitle}>Lịch sử yêu cầu</Text>
          {requests.map((request) => (
            <View key={request.id} style={commonStyles.card}>
              <View style={styles.requestHeader}>
                <View style={styles.requestTitleRow}>
                  <Text style={styles.requestIcon}>
                    {supportRequestTypes.find(t => t.id === request.type)?.icon}
                  </Text>
                  <View style={styles.requestTitleContent}>
                    <Text style={commonStyles.subtitle}>{request.title}</Text>
                    <Text style={commonStyles.textSecondary}>
                      {formatDate(request.createdAt)}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(request.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{request.status}</Text>
                </View>
              </View>

              <Text style={[commonStyles.text, { marginTop: 8 }]}>
                {request.description}
              </Text>

              {request.response && (
                <View style={styles.responseContainer}>
                  <Text style={styles.responseLabel}>Phản hồi:</Text>
                  <Text style={styles.responseText}>{request.response}</Text>
                </View>
              )}
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
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  typeButton: {
    width: '48%',
    marginRight: '2%',
    marginBottom: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.lightGray,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  typeButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: '#E3F2FD',
  },
  typeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  typeText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
  typeTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  textArea: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.lightGray,
    marginTop: 8,
    minHeight: 100,
  },
  formActions: {
    flexDirection: 'row',
    marginTop: 16,
  },
  requestsList: {
    marginTop: 24,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  requestTitleRow: {
    flexDirection: 'row',
    flex: 1,
  },
  requestIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  requestTitleContent: {
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  responseContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  responseLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  responseText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});


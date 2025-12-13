import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

let ErrorBoundary;
let AppNavigator;

// Lazy load to catch import errors
try {
  ErrorBoundary = require('./ErrorBoundary').ErrorBoundary;
} catch (e) {
  console.error('Error loading ErrorBoundary:', e);
  // Fallback ErrorBoundary
  ErrorBoundary = class extends React.Component {
    render() {
      return this.props.children;
    }
  };
}

try {
  AppNavigator = require('./src/navigation/AppNavigator').default;
} catch (e) {
  console.error('Error loading AppNavigator:', e);
  AppNavigator = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Lỗi khởi tạo ứng dụng</Text>
    </View>
  );
}

export default function App() {
  const [isReady, setIsReady] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    try {
      // Small delay to ensure everything is initialized
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 200);
      return () => clearTimeout(timer);
    } catch (e) {
      console.error('App initialization error:', e);
      setError(e.message);
      setIsReady(true);
    }
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Lỗi: {error}</Text>
      </View>
    );
  }

  try {
    return (
      <ErrorBoundary>
        <AppNavigator />
        <StatusBar style="auto" />
      </ErrorBoundary>
    );
  } catch (e) {
    console.error('App render error:', e);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Lỗi render: {e.message}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

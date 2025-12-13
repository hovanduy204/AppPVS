import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from './ErrorBoundary';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ErrorBoundary>
      <AppNavigator />
      <StatusBar style="auto" />
    </ErrorBoundary>
  );
}

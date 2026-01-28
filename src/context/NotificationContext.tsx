import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  clearNotifications: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    setNotifications(prev => [...prev, newNotification]);

    // Show alert for important notifications
    if (notification.type === 'success' || notification.type === 'warning') {
      Alert.alert(notification.title, notification.message);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Auto-clear notifications after 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(prev => prev.filter(n => 
        new Date().getTime() - n.timestamp.getTime() < 10000
      ));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      clearNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

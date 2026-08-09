// src/context/WebSocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { wsService } from '../services/websocket';
import { BinaryMessage, MessageType } from '../network';

interface WebSocketContextType {
  clientId: number | null;
  isConnected: boolean;
  sendMessage: (data: any) => void;
  sendBinary: (msg: BinaryMessage) => void;
  onMessage: (type: MessageType | 'all', handler: (data: BinaryMessage) => void) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clientId, setClientId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connect = async () => {
      try {
        const id = await wsService.connect('default');
        setClientId(id);
        setIsConnected(true);
        console.log('✅ Connected with clientId:', id);
      } catch (error) {
        console.error('Failed to connect:', error);
      }
    };

    connect();

    return () => {
      wsService.disconnect();
    };
  }, []);

  const sendMessage = (data: any) => {
    wsService.send(data);
  };

  const sendBinary = (msg: BinaryMessage) => {
    if (wsService) {
      wsService.sendBinary(msg);
    } else {
      console.warn('wsService not available');
    }
  };

  const onMessage = (type: MessageType | 'all', handler: (data: BinaryMessage) => void) => {
    wsService.on(type, handler);
  };

  return (
    <WebSocketContext.Provider value={{ clientId, isConnected, sendMessage, sendBinary, onMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};
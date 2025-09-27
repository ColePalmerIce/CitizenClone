import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  type: string;
  title: string;
  message: string;
  amount?: number;
  newBalance?: string;
  timestamp: string;
}

export function useWebSocket(userId?: string) {
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    // Create WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}`;
    
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      setIsConnected(true);
      // Authenticate with user ID
      ws.current?.send(JSON.stringify({
        type: 'authenticate',
        userId: userId
      }));
    };

    ws.current.onmessage = (event) => {
      try {
        const notification: Notification = JSON.parse(event.data);
        
        if (notification.type === 'balance_update') {
          toast({
            title: notification.title,
            description: notification.message,
            duration: 5000,
          });
          
          // Trigger page refresh for balance updates
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('balance-updated', {
              detail: { newBalance: notification.newBalance }
            }));
          }
        }
      } catch (error) {
        console.error('Error parsing notification:', error);
      }
    };

    ws.current.onclose = () => {
      setIsConnected(false);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      ws.current?.close();
    };
  }, [userId, toast]);

  return { isConnected };
}
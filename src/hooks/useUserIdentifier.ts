import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const STORAGE_KEY = '@tinderclone/userIdentifier';

const generateIdentifier = () =>
  `user-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const useUserIdentifier = () => {
  const [userIdentifier, setUserIdentifier] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadIdentifier = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          if (!cancelled) {
            setUserIdentifier(stored);
          }
          return;
        }

        const newIdentifier = generateIdentifier();
        await AsyncStorage.setItem(STORAGE_KEY, newIdentifier);
        if (!cancelled) {
          setUserIdentifier(newIdentifier);
        }
      } catch {
        if (!cancelled) {
          setUserIdentifier(null);
        }
      }
    };

    loadIdentifier();

    return () => {
      cancelled = true;
    };
  }, []);

  return userIdentifier;
};


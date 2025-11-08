import { Platform } from 'react-native';

const FALLBACK_BASE_URL = Platform.select({
  ios: 'http://127.0.0.1:8000',
  android: 'http://10.0.2.2:8000',
  default: 'http://127.0.0.1:8000',
});

const ENV_BASE_URL = "https://tinder-app-api.vercel.app/api"

export const API_BASE_URL = ENV_BASE_URL ?? FALLBACK_BASE_URL ?? '';

if (!API_BASE_URL && __DEV__) {
  console.warn(
    '[API] Base URL is empty. Please set API_BASE_URL environment variable or update src/config/api.ts',
  );
}


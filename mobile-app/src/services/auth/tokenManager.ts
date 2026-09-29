import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

let accessToken: string | null = null;
let refreshToken: string | null = null;

// Called by AuthContext when a refresh attempt fails (refresh token expired
// or revoked) — lets the UI react (drop session, redirect to login) without
// this module depending on React.
let onSessionExpired: (() => void) | null = null;

export const tokenManager = {
  async loadFromStorage() {
    const [storedAccess, storedRefresh] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
    ]);
    accessToken = storedAccess;
    refreshToken = storedRefresh;
    return { accessToken, refreshToken };
  },

  async setTokens(newAccessToken: string, newRefreshToken: string) {
    accessToken = newAccessToken;
    refreshToken = newRefreshToken;
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, newAccessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newRefreshToken),
    ]);
  },

  async setAccessToken(newAccessToken: string) {
    accessToken = newAccessToken;
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, newAccessToken);
  },

  async clear() {
    accessToken = null;
    refreshToken = null;
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  },

  getAccessToken() {
    return accessToken;
  },

  getRefreshToken() {
    return refreshToken;
  },

  setOnSessionExpired(callback: () => void) {
    onSessionExpired = callback;
  },

  notifySessionExpired() {
    if (onSessionExpired) {
      onSessionExpired();
    }
  },
};
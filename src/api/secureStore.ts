import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const KEY = "FAKE_API_TOKEN";

export async function saveToken(value: string): Promise<void> {
  if (Platform.OS === "web") return;
  await SecureStore.setItemAsync(KEY, value);
}

export async function getToken(): Promise<string | undefined> {
  if (Platform.OS === "web") return;
  let result = await SecureStore.getItemAsync(KEY);
  if (result) {
    return result;
  }
}

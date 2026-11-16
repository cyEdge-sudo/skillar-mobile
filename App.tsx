import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";

import { RootNavigator } from "./src/app/navigation/root-navigator";
import { AppProviders } from "./src/app/providers/app-providers";

export default function App() {
  return (
    <AppProviders>
      <StatusBar style="auto" />
      <RootNavigator />
    </AppProviders>
  );
}

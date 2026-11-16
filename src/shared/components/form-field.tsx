import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

import { AppText } from "./themed/app-text";
import { useTheme } from "../theme";

export interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoComplete?: TextInputProps["autoComplete"];
  returnKeyType?: TextInputProps["returnKeyType"];
}

export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  autoComplete = "off",
  returnKeyType = "next",
}: FormFieldProps) {
  const { colors, radius, spacing, typography } = useTheme();

  const styles = StyleSheet.create({
    container: {
      gap: spacing[8],
    },
    input: {
      minHeight: 52,
      borderWidth: 1,
      borderColor: error ? colors.error : colors.border,
      borderRadius: radius[8],
      backgroundColor: colors.surface,
      color: colors.text,
      paddingHorizontal: spacing[16],
      fontSize: typography.bodyMedium.fontSize,
    },
  });

  return (
    <View style={styles.container}>
      <AppText variant="labelLarge">{label}</AppText>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? ""}
        placeholderTextColor={colors.textSecondary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        returnKeyType={returnKeyType}
        style={styles.input}
      />
      {error ? (
        <AppText color="error" variant="caption">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

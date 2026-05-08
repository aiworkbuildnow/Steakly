import { TouchableOpacity, Text } from "react-native";
import * as Haptics from "expo-haptics";

const VARIANTS = {
  green: { bg: "bg-brand-green", text: "text-white" },
  lime: { bg: "bg-brand-lime", text: "text-white" },
  gold: { bg: "bg-brand-gold", text: "text-brand-dark" },
  orange: { bg: "bg-brand-orange", text: "text-white" },
  red: { bg: "bg-brand-red", text: "text-white" },
  outline: { bg: "bg-white border-2 border-brand-green", text: "text-brand-green" },
  ghost: { bg: "bg-gray-100", text: "text-gray-600" },
};

export function PrimaryButton({ children, onPress, disabled, variant = "green", className = "" }) {
  const v = VARIANTS[variant] || VARIANTS.green;

  async function handlePress() {
    if (disabled) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.();
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={disabled ? 1 : 0.75}
      className={`w-full py-4 rounded-2xl items-center justify-center ${v.bg} ${disabled ? "opacity-40" : ""} ${className}`}
    >
      <Text className={`font-bold text-base ${v.text}`}>{children}</Text>
    </TouchableOpacity>
  );
}

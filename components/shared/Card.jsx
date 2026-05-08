import { View } from "react-native";

export function Card({ children, className = "" }) {
  return (
    <View className={`bg-white rounded-3xl shadow-sm ${className}`}>
      {children}
    </View>
  );
}

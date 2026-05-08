import { View, Text } from "react-native";

export function Header({ title = "Fresh Salad Bar", subtitle, right }) {
  return (
    <View className="flex-row items-center justify-between px-5 pt-6 pb-2">
      <View>
        <Text className="text-xl font-bold text-brand-dark leading-tight">{title}</Text>
        {subtitle ? (
          <Text className="text-xs text-brand-green font-semibold mt-0.5">{subtitle}</Text>
        ) : null}
      </View>
      {right ? <View>{right}</View> : null}
    </View>
  );
}

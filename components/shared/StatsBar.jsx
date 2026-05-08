import { View, Text } from "react-native";

export function StatsBar({ streak, points, level }) {
  return (
    <View className="mx-4 my-3 bg-brand-dark rounded-2xl px-5 py-3 flex-row items-center justify-between">
      <View className="flex-row items-center gap-1.5">
        <Text className="text-xl">🔥</Text>
        <View>
          <Text className="text-white font-bold text-base leading-none">{streak}</Text>
          <Text className="text-brand-light text-xs">Day Streak</Text>
        </View>
      </View>

      <View className="h-8 w-px bg-white/20" />

      <View className="flex-row items-center gap-1.5">
        <Text className="text-xl">⭐</Text>
        <View>
          <Text className="text-white font-bold text-base leading-none">{points}</Text>
          <Text className="text-brand-light text-xs">Points</Text>
        </View>
      </View>

      <View className="h-8 w-px bg-white/20" />

      <View className="items-end">
        <Text className="text-brand-gold font-bold text-sm leading-none">{level.label}</Text>
        <Text className="text-brand-light text-xs">Level</Text>
      </View>
    </View>
  );
}

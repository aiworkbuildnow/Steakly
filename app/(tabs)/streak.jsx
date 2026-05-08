import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Header } from "../../components/shared/Header";
import { PrimaryButton } from "../../components/shared/PrimaryButton";
import { useGameStore } from "../../store/useGameStore";

function ActiveStreak({ store }) {
  const { currentStreak, nextStreakReward } = store;
  const weekDay = currentStreak % 7 || (currentStreak > 0 ? 7 : 0);
  const daysToReward = nextStreakReward.days - currentStreak;
  const progress = Math.min(1, (currentStreak % nextStreakReward.days) / nextStreakReward.days);

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <Header title="Streak Engine" subtitle="Keep the fire alive" />
      <View className="mx-4 mt-2">

        <View className="bg-brand-dark rounded-3xl p-6 items-center mb-4">
          <Text className="text-6xl mb-2">🔥</Text>
          <Text className="text-white text-5xl font-black">{currentStreak}</Text>
          <Text className="text-brand-light font-semibold mt-1">Day Streak</Text>
        </View>

        <View className="bg-brand-cream rounded-3xl p-5 mb-4">
          <Text className="text-xs font-semibold text-brand-green uppercase tracking-widest mb-3">This Week</Text>
          <View className="flex-row justify-between gap-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const filled = i < weekDay;
              return (
                <View key={i} className="flex-1 items-center gap-1">
                  <View className={`w-8 h-8 rounded-full items-center justify-center
                    ${filled ? "bg-brand-green" : "bg-gray-200"}`}>
                    <Text className={`text-xs font-bold ${filled ? "text-white" : "text-gray-400"}`}>
                      {filled ? "✓" : i + 1}
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-400">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xs font-semibold text-brand-dark uppercase tracking-wide">Next Reward</Text>
              <Text className="font-bold text-brand-dark mt-0.5">+{nextStreakReward.points} Points</Text>
              <Text className="text-sm text-gray-600">Unlock: {nextStreakReward.label}</Text>
            </View>
            <View className="items-end">
              <Text className="text-3xl font-black text-brand-gold">{daysToReward}</Text>
              <Text className="text-xs text-gray-500">days left</Text>
            </View>
          </View>
          <View className="mt-3 bg-white rounded-full h-2">
            <View
              className="bg-brand-gold h-2 rounded-full"
              style={{ width: `${progress * 100}%` }}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function AtRiskStreak({ store }) {
  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <Header title="Streak At Risk" />
      <View className="mx-4 mt-2">
        <View className="bg-red-50 border border-red-200 rounded-3xl p-6 items-center mb-4">
          <Text className="text-5xl mb-3">⚠️</Text>
          <Text className="font-bold text-brand-red text-xl mb-1 text-center">Don't break it now</Text>
          <Text className="text-gray-600 text-sm text-center">
            You haven't completed today's meal. Your{" "}
            <Text className="font-bold text-brand-dark">{store.currentStreak}-day streak</Text> is at risk.
          </Text>
        </View>

        <View className="bg-brand-cream rounded-2xl p-4 mb-4 items-center">
          <Text className="text-2xl mb-1">🏆</Text>
          <Text className="text-sm text-gray-600">You're this close to</Text>
          <Text className="font-bold text-brand-dark">Day {store.nextStreakReward.days} – {store.nextStreakReward.label}</Text>
          <Text className="text-xs text-brand-green mt-0.5">Only {store.nextStreakReward.days - store.currentStreak} days away</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function MissedStreak({ store }) {
  const [used, setUsed] = useState(false);
  const [restarted, setRestarted] = useState(false);

  if (used) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-8">
        <Text className="text-6xl mb-4">🛡️</Text>
        <Text className="text-2xl font-black text-brand-dark mb-2">Streak Saved!</Text>
        <Text className="text-gray-600 text-center">
          Your {store.currentStreak}-day streak is protected. Don't miss tomorrow.
        </Text>
      </View>
    );
  }

  if (restarted) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-8">
        <Text className="text-6xl mb-4">🌱</Text>
        <Text className="text-2xl font-black text-brand-dark mb-2">Fresh Start</Text>
        <Text className="text-gray-600 text-center">Every champion started at Day 1. Let's go.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <Header title="Streak Broken" />
      <View className="mx-4 mt-2">
        <View className="bg-gray-50 border border-gray-200 rounded-3xl p-6 items-center mb-5">
          <Text className="text-5xl mb-3">💔</Text>
          <Text className="font-bold text-gray-800 text-xl mb-1 text-center">
            You reached: <Text className="text-brand-green">{store.currentStreak} days</Text>
          </Text>
          <Text className="text-gray-500 text-sm text-center">That's still something to be proud of.</Text>
        </View>

        <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Choose your path</Text>

        <TouchableOpacity
          onPress={() => {
            const ok = store.useSaveToken();
            if (ok) setUsed(true);
          }}
          disabled={store.saveTokens < 1}
          className={`bg-yellow-50 border-2 border-brand-gold rounded-2xl p-4 mb-3 flex-row items-center gap-4
            ${store.saveTokens < 1 ? "opacity-40" : ""}`}
          activeOpacity={0.75}
        >
          <View className="w-12 h-12 bg-brand-gold rounded-xl items-center justify-center">
            <Text className="text-2xl">🛡️</Text>
          </View>
          <View className="flex-1">
            <Text className="font-bold text-brand-dark">Use Save Token</Text>
            <Text className="text-sm text-gray-500">Restore your {store.currentStreak}-day streak</Text>
            <Text className="text-xs text-brand-gold font-medium mt-0.5">
              {store.saveTokens > 0 ? `${store.saveTokens} token available` : "No tokens"}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => { store.restartStreak(); setRestarted(true); }}
          className="bg-green-50 border-2 border-brand-green rounded-2xl p-4 flex-row items-center gap-4"
          activeOpacity={0.75}
        >
          <View className="w-12 h-12 bg-brand-green rounded-xl items-center justify-center">
            <Text className="text-2xl">🌱</Text>
          </View>
          <View className="flex-1">
            <Text className="font-bold text-brand-dark">Restart from Day 1</Text>
            <Text className="text-sm text-gray-500">Fresh start, stronger comeback</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default function StreakScreen() {
  const store = useGameStore();
  if (store.streakState === "missed") return <MissedStreak store={store} />;
  if (store.streakState === "at_risk") return <AtRiskStreak store={store} />;
  return <ActiveStreak store={store} />;
}

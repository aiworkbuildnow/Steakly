import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Header } from "../../components/shared/Header";
import { StatsBar } from "../../components/shared/StatsBar";
import { PrimaryButton } from "../../components/shared/PrimaryButton";
import { useGameStore } from "../../store/useGameStore";

export default function HomeScreen() {
  const store = useGameStore();
  const [showSuccess, setShowSuccess] = useState(false);
  const { currentDay, currentStreak, points, level, todayPlan, todayEvent, streakState, mealConfirmedToday } = store;

  function handleConfirm() {
    store.confirmMeal();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }

  const weekProgress = currentStreak % 7 || (currentStreak > 0 ? 7 : 0);

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <Header
        title="Fresh Salad Bar"
        subtitle={`Day ${currentDay} – ${level.label} Phase`}
        right={
          <View className="bg-brand-cream rounded-full px-3 py-1">
            <Text className="text-brand-dark text-xs font-semibold">{store.saveTokens} 🛡️</Text>
          </View>
        }
      />

      <StatsBar streak={currentStreak} points={points} level={level} />

      {/* Event Banner */}
      {todayEvent ? (
        <View className={`mx-4 mb-3 rounded-2xl p-4
          ${todayEvent.type === "double" ? "bg-yellow-50 border border-brand-gold" :
            todayEvent.type === "mystery" ? "bg-purple-50 border border-purple-200" :
            "bg-green-50 border border-brand-lime"}`}
        >
          <View className="flex-row items-center gap-3">
            <Text className="text-2xl">{todayEvent.icon}</Text>
            <View className="flex-1">
              <Text className="font-bold text-brand-dark text-sm">{todayEvent.title}</Text>
              <Text className="text-xs text-gray-600 mt-0.5">{todayEvent.description}</Text>
            </View>
          </View>
        </View>
      ) : null}

      {/* At Risk Banner */}
      {streakState === "at_risk" ? (
        <View className="mx-4 mb-3 bg-red-50 border border-red-200 rounded-2xl p-4">
          <View className="flex-row items-center gap-3">
            <Text className="text-2xl">⚠️</Text>
            <View className="flex-1">
              <Text className="font-bold text-brand-red text-sm">Streak At Risk</Text>
              <Text className="text-xs text-gray-600">
                You haven't completed today's meal. Your {currentStreak}-day streak is at risk.
              </Text>
            </View>
          </View>
        </View>
      ) : null}

      {/* Today's Plan */}
      <View className="mx-4 mb-4 bg-brand-cream rounded-3xl p-5">
        <Text className="text-xs font-semibold text-brand-green uppercase tracking-widest mb-3">Today's Plan</Text>

        <View className="gap-3">
          <View className="bg-white rounded-2xl p-4 flex-row items-center gap-3">
            <View className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center">
              <Text className="text-xl">🥗</Text>
            </View>
            <View>
              <Text className="text-xs text-gray-400 font-medium">Lunch</Text>
              <Text className="font-bold text-brand-dark text-sm">{todayPlan.lunch}</Text>
            </View>
          </View>

          <View className="bg-white rounded-2xl p-4 flex-row items-center gap-3">
            <View className="w-10 h-10 bg-green-50 rounded-xl items-center justify-center">
              <Text className="text-xl">🌿</Text>
            </View>
            <View>
              <Text className="text-xs text-gray-400 font-medium">Dinner</Text>
              <Text className="font-bold text-brand-dark text-sm">{todayPlan.dinner}</Text>
            </View>
          </View>
        </View>

        {/* Weekly progress */}
        <View className="mt-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xs font-semibold text-gray-500">Week Progress</Text>
            <Text className="text-xs text-brand-green font-bold">
              Next reward: Day {store.nextStreakReward.days}
            </Text>
          </View>
          <View className="flex-row gap-1.5">
            {Array.from({ length: 7 }).map((_, i) => {
              const filled = i < weekProgress;
              return (
                <View
                  key={i}
                  className={`flex-1 h-2 rounded-full ${filled ? "bg-brand-green" : "bg-gray-200"}`}
                />
              );
            })}
          </View>
          <View className="flex-row mt-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <Text key={i} className="flex-1 text-xs text-gray-400 text-center">{i + 1}</Text>
            ))}
          </View>
        </View>
      </View>

      {/* CTA */}
      <View className="mx-4 mb-8">
        {showSuccess ? (
          <View className="bg-brand-lime rounded-2xl p-5 items-center">
            <Text className="text-3xl mb-1">🎉</Text>
            <Text className="font-bold text-white text-base">Meal logged!</Text>
            <Text className="text-white/80 text-sm">
              Streak +1 · +{todayEvent?.type === "double" ? "20" : "10"} points
            </Text>
          </View>
        ) : (
          <PrimaryButton
            onPress={handleConfirm}
            disabled={mealConfirmedToday}
            variant={mealConfirmedToday ? "outline" : "green"}
          >
            {mealConfirmedToday ? "✓ Meal Confirmed Today" : "Confirm Meal"}
          </PrimaryButton>
        )}
      </View>
    </ScrollView>
  );
}

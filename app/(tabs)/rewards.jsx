import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Header } from "../../components/shared/Header";
import { useGameStore } from "../../store/useGameStore";

export default function RewardsScreen() {
  const store = useGameStore();
  const [flash, setFlash] = useState(null);
  const { rewards, points, redeemedRewards } = store;

  function handleRedeem(reward) {
    const ok = store.redeemReward(reward.id);
    if (ok) {
      setFlash(reward);
      setTimeout(() => setFlash(null), 3000);
    }
  }

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <Header title="Rewards" subtitle="Spend your hard-earned points" />

      <View className="mx-4 mt-2 mb-4 bg-brand-gold rounded-3xl p-5 items-center">
        <Text className="text-white/80 text-sm font-medium mb-1">Your Balance</Text>
        <Text className="text-white text-5xl font-black">{points}</Text>
        <Text className="text-white/80 text-sm mt-1">Points</Text>
      </View>

      {flash ? (
        <View className="mx-4 mb-3 bg-brand-lime rounded-2xl p-4 items-center">
          <Text className="text-2xl mb-1">{flash.icon}</Text>
          <Text className="font-bold text-white">{flash.label} redeemed!</Text>
          <Text className="text-white/80 text-sm">{flash.description}</Text>
        </View>
      ) : null}

      <View className="mx-4 gap-3">
        {rewards.map((reward) => {
          const canAfford = points >= reward.points;
          const isRedeemed = redeemedRewards.includes(reward.id);

          return (
            <TouchableOpacity
              key={reward.id}
              onPress={() => handleRedeem(reward)}
              disabled={!canAfford || isRedeemed}
              activeOpacity={0.75}
              className={`rounded-2xl p-4 flex-row items-center gap-4
                ${isRedeemed
                  ? "bg-gray-100 border-2 border-gray-200 opacity-60"
                  : canAfford
                  ? "bg-white border-2 border-yellow-200"
                  : "bg-gray-50 border-2 border-gray-200 opacity-50"
                }`}
            >
              <View className={`w-14 h-14 rounded-2xl items-center justify-center
                ${isRedeemed ? "bg-gray-200" : canAfford ? "bg-yellow-100" : "bg-gray-200"}`}>
                <Text className="text-3xl">{isRedeemed ? "✓" : reward.icon}</Text>
              </View>
              <View className="flex-1">
                <Text className="font-bold text-brand-dark">{reward.label}</Text>
                <Text className="text-xs text-gray-500 mt-0.5">{reward.description}</Text>
              </View>
              <View className="items-end">
                {isRedeemed ? (
                  <Text className="text-xs text-gray-400 font-medium">Applied</Text>
                ) : (
                  <>
                    <Text className={`font-black text-lg ${canAfford ? "text-brand-gold" : "text-gray-400"}`}>
                      {reward.points}
                    </Text>
                    <Text className="text-xs text-gray-400">pts</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="mx-4 mt-4 mb-8 bg-brand-cream rounded-2xl p-4">
        <Text className="text-xs font-semibold text-brand-green uppercase tracking-wide mb-2">Earn More Points</Text>
        {[
          { label: "Confirm a meal", pts: "+10 pts" },
          { label: "Double Point Day", pts: "+20 pts" },
          { label: "Complete 7-day streak", pts: "+100 pts" },
          { label: "Complete 21-day streak", pts: "+200 pts" },
        ].map(({ label, pts }) => (
          <View key={label} className="flex-row justify-between items-center py-1">
            <Text className="text-sm text-gray-600">{label}</Text>
            <Text className="text-sm font-bold text-brand-green">{pts}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

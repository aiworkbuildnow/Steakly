import { View, Text, ScrollView } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Header } from "../../components/shared/Header";
import { PrimaryButton } from "../../components/shared/PrimaryButton";
import { useGameStore } from "../../store/useGameStore";
import { useRouter } from "expo-router";

function RingChart({ value, max, color, size = 72 }) {
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;

  return (
    <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
      <Circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={6} />
      <Circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default function ReportScreen() {
  const router = useRouter();
  const {
    currentStreak, bestStreak, points, totalMealsCompleted,
    totalMealsMissed, weeklyMeals, level, currentDay,
  } = useGameStore();

  const consistency = weeklyMeals.filter(Boolean).length;
  const total = weeklyMeals.length;
  const consistencyPct = Math.round((consistency / total) * 100);

  const insight = consistency >= 6
    ? "Outstanding consistency. You're building an unbreakable habit."
    : consistency >= 4
    ? "You're close to a full streak. One more consistent week!"
    : "Stay focused. Every meal confirmed is a step forward.";

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <Header title="Weekly Report" subtitle={`Week ${Math.ceil(currentDay / 7)} Summary`} />

      <View className="mx-4 mt-2 gap-4">

        {/* Hero */}
        <View className="bg-brand-dark rounded-3xl p-5">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-white/70 text-xs font-medium uppercase tracking-wide">Current Level</Text>
              <Text className="text-brand-gold font-black text-xl mt-0.5">{level.label}</Text>
            </View>
            <Text className="text-4xl">📊</Text>
          </View>
          <View className="flex-row gap-3">
            {[
              { label: "Consistency", value: `${consistency}/${total}`, sub: `${consistencyPct}%` },
              { label: "Best Streak", value: String(bestStreak), sub: "days" },
              { label: "Points", value: String(points), sub: "total" },
            ].map(({ label, value, sub }) => (
              <View key={label} className="flex-1 bg-white/10 rounded-2xl p-3 items-center">
                <Text className="text-white font-black text-xl leading-none">{value}</Text>
                <Text className="text-white/60 text-xs mt-1">{sub}</Text>
                <Text className="text-white/50 text-xs">{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Week calendar */}
        <View className="bg-brand-cream rounded-3xl p-5">
          <Text className="text-xs font-semibold text-brand-green uppercase tracking-widest mb-3">This Week</Text>
          <View className="flex-row justify-between">
            {weeklyMeals.map((done, i) => (
              <View key={i} className="flex-1 items-center gap-1">
                <View className={`w-8 h-8 rounded-full items-center justify-center
                  ${done ? "bg-brand-green" : "bg-gray-200"}`}>
                  <Text className={`text-xs font-bold ${done ? "text-white" : "text-gray-400"}`}>
                    {done ? "✓" : i + 1}
                  </Text>
                </View>
                <Text className="text-xs text-gray-400">
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Meals ring charts */}
        <View className="flex-row gap-3">
          <View className="flex-1 bg-green-50 border border-green-200 rounded-2xl p-4 items-center gap-2">
            <RingChart value={totalMealsCompleted} max={totalMealsCompleted + totalMealsMissed} color="#52B788" />
            <Text className="font-black text-2xl text-brand-green">{totalMealsCompleted}</Text>
            <Text className="text-xs text-gray-500 text-center">Meals Completed</Text>
          </View>
          <View className="flex-1 bg-red-50 border border-red-200 rounded-2xl p-4 items-center gap-2">
            <RingChart value={totalMealsMissed} max={totalMealsCompleted + totalMealsMissed} color="#E76F51" />
            <Text className="font-black text-2xl text-brand-red">{totalMealsMissed}</Text>
            <Text className="text-xs text-gray-500 text-center">Missed</Text>
          </View>
        </View>

        {/* Insight */}
        <View className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
          <View className="flex-row items-start gap-3">
            <Text className="text-2xl">💡</Text>
            <View className="flex-1">
              <Text className="text-xs font-semibold text-brand-dark uppercase tracking-wide mb-1">Weekly Insight</Text>
              <Text className="text-sm text-gray-700">{insight}</Text>
            </View>
          </View>
        </View>

        <View className="mb-8">
          <PrimaryButton variant="green" onPress={() => router.push("/(tabs)/")}>
            Continue Next Week
          </PrimaryButton>
        </View>
      </View>
    </ScrollView>
  );
}

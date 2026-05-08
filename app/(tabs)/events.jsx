import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Header } from "../../components/shared/Header";
import { PrimaryButton } from "../../components/shared/PrimaryButton";
import { useGameStore } from "../../store/useGameStore";

const EVENT_CONFIGS = {
  double: {
    icon: "⚡",
    gradientColors: ["#E9C46A", "#F4A261"],
    bgClass: "bg-yellow-50",
    borderClass: "border-brand-gold",
    headerBg: "bg-brand-gold",
    title: "Double Points Active",
    subtitle: "Today = 2x rewards",
    body: "Every meal confirmed today earns double points. This is your chance to accelerate your rewards.",
    cta: "Activate Today",
    badge: "2X POINTS",
  },
  mystery: {
    icon: "🌟",
    gradientColors: ["#7C3AED", "#4F46E5"],
    bgClass: "bg-purple-50",
    borderClass: "border-purple-300",
    headerBg: "bg-purple-500",
    title: "Mystery Bowl Today",
    subtitle: "A surprise aligned with your goal",
    body: "You'll receive a surprise meal curated by our chef, perfectly aligned with your health goal. Trust the system.",
    cta: "Accept Mystery Bowl",
    badge: "MYSTERY",
  },
  nochoice: {
    icon: "🎯",
    gradientColors: ["#2D6A4F", "#1B4332"],
    bgClass: "bg-green-50",
    borderClass: "border-brand-green",
    headerBg: "bg-brand-green",
    title: "No Choice Day",
    subtitle: "We decide. You eat.",
    body: "Today we take the decision off your plate. We've chosen the perfect meals for you. Just follow the process.",
    cta: "Follow the System",
    badge: "AUTO",
  },
};

function EventCard({ type, active, activated, onActivate }) {
  const cfg = EVENT_CONFIGS[type];

  return (
    <View className={`rounded-3xl border-2 overflow-hidden mb-4 ${active ? cfg.borderClass : "border-gray-200"}`}>
      <View className={`p-5 ${active ? cfg.headerBg : "bg-gray-300"}`}>
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="bg-white/20 self-start px-2 py-0.5 rounded-full mb-2">
              <Text className="text-xs font-bold text-white">{cfg.badge}</Text>
            </View>
            <Text className="text-white font-black text-xl">{cfg.title}</Text>
            <Text className="text-white/80 text-sm">{cfg.subtitle}</Text>
          </View>
          <Text className="text-5xl ml-2">{cfg.icon}</Text>
        </View>
      </View>

      <View className={`${active ? cfg.bgClass : "bg-gray-50"} p-4`}>
        <Text className="text-sm text-gray-600 mb-4">{cfg.body}</Text>
        {active && !activated ? (
          <PrimaryButton
            variant={type === "double" ? "gold" : type === "mystery" ? "outline" : "green"}
            onPress={onActivate}
          >
            {cfg.cta}
          </PrimaryButton>
        ) : activated ? (
          <View className="items-center py-2">
            <Text className="text-brand-green font-bold text-sm">✓ Activated for today</Text>
          </View>
        ) : (
          <View className="items-center py-2">
            <Text className="text-gray-400 text-xs">Not available today</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function EventsScreen() {
  const { todayEvent, simulateMissedDay, simulateAtRisk, resetDemo } = useGameStore();
  const [activated, setActivated] = useState({});

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <Header title="Events" subtitle="Special challenges & boosts" />

      <View className="mx-4 mt-2">
        {todayEvent ? (
          <View className="flex-row items-center gap-2 mb-3">
            <View className="w-2 h-2 rounded-full bg-brand-lime" />
            <Text className="text-xs font-bold text-brand-green uppercase tracking-wide">Active Today</Text>
          </View>
        ) : null}

        {Object.keys(EVENT_CONFIGS).map((type) => (
          <EventCard
            key={type}
            type={type}
            active={todayEvent?.type === type}
            activated={!!activated[type]}
            onActivate={() => setActivated((p) => ({ ...p, [type]: true }))}
          />
        ))}

        {/* Demo Controls */}
        <View className="mt-2 bg-gray-100 rounded-2xl p-4 mb-8">
          <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Demo Controls</Text>
          <View className="gap-2">
            {[
              { label: "⚠️ Simulate At Risk", action: simulateAtRisk, color: "text-brand-red" },
              { label: "💔 Simulate Missed Day", action: simulateMissedDay, color: "text-gray-600" },
              { label: "🔄 Reset Demo State", action: resetDemo, color: "text-brand-green" },
            ].map(({ label, action, color }) => (
              <TouchableOpacity
                key={label}
                onPress={action}
                activeOpacity={0.75}
                className="bg-white rounded-xl px-4 py-3"
              >
                <Text className={`text-sm font-medium ${color}`}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

import { View, Text, ScrollView } from "react-native";
import { Header } from "../../components/shared/Header";
import { useGameStore } from "../../store/useGameStore";

const BASIC_MENU = [
  { name: "Protein Power Bowl", desc: "Grilled chicken, quinoa, greens", cal: 480, icon: "💪" },
  { name: "Light Detox Bowl", desc: "Cucumber, spinach, lemon tahini", cal: 310, icon: "🌿" },
  { name: "Classic Caesar Salad", desc: "Romaine, parmesan, croutons", cal: 390, icon: "🥗" },
  { name: "Green Goddess Wrap", desc: "Avocado, chickpea, herb sauce", cal: 420, icon: "🌯" },
];

const PRO_MENU = [
  { name: "Wagyu Steak Bowl", desc: "Wagyu beef, truffle oil, wild rice", cal: 620, icon: "🥩" },
  { name: "Salmon Poke Bowl", desc: "Fresh salmon, edamame, mango salsa", cal: 520, icon: "🐟" },
  { name: "Quinoa Power Plate", desc: "Tri-color quinoa, roasted veg, tahini", cal: 440, icon: "✨" },
  { name: "Avocado Crunch Bowl", desc: "Avocado, kale, crispy chickpeas", cal: 490, icon: "🥑" },
];

const SECRET_MENU = [
  { name: "The Unstoppable", desc: "Chef's exclusive — changes daily", cal: "???", icon: "🌟" },
  { name: "Midnight Detox", desc: "Activated charcoal, supergreens blend", cal: 280, icon: "🖤" },
  { name: "Gold Bowl", desc: "Turmeric-glazed protein, gold beet, microgreens", cal: 560, icon: "👑" },
];

function MenuItem({ item, locked }) {
  return (
    <View className={`flex-row items-center gap-3 bg-white rounded-2xl p-4 ${locked ? "opacity-40" : ""}`}>
      <View className="w-12 h-12 bg-brand-cream rounded-xl items-center justify-center">
        <Text className="text-2xl">{locked ? "🔒" : item.icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="font-bold text-brand-dark text-sm">{locked ? "Locked Item" : item.name}</Text>
        <Text className="text-xs text-gray-500 mt-0.5">{locked ? "Unlock to reveal" : item.desc}</Text>
      </View>
      {!locked ? (
        <Text className="text-xs text-gray-400">{item.cal} cal</Text>
      ) : null}
    </View>
  );
}

function MenuSection({ title, badge, items, locked, lockMessage, streakNeeded, currentStreak }) {
  const progress = locked ? Math.min(1, currentStreak / streakNeeded) : 1;

  return (
    <View className="mb-5">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <Text className="font-bold text-brand-dark">{title}</Text>
          {badge ? (
            <View className={`px-2 py-0.5 rounded-full ${locked ? "bg-gray-200" : "bg-brand-lime"}`}>
              <Text className={`text-xs font-bold ${locked ? "text-gray-500" : "text-white"}`}>{badge}</Text>
            </View>
          ) : null}
        </View>
        {locked ? (
          <Text className="text-xs text-gray-400 font-medium">🔒 Day {streakNeeded}</Text>
        ) : null}
      </View>

      {locked ? (
        <View className="mb-3 bg-gray-100 rounded-xl p-3">
          <View className="flex-row justify-between items-center mb-1.5">
            <Text className="text-xs text-gray-500">{lockMessage}</Text>
            <Text className="text-xs font-bold text-brand-green">{currentStreak}/{streakNeeded}</Text>
          </View>
          <View className="bg-white rounded-full h-1.5">
            <View className="bg-brand-green h-1.5 rounded-full" style={{ width: `${progress * 100}%` }} />
          </View>
        </View>
      ) : null}

      <View className="gap-2">
        {items.map((item, i) => (
          <MenuItem key={i} item={item} locked={locked} />
        ))}
      </View>
    </View>
  );
}

export default function MenuScreen() {
  const { currentStreak, proUnlocked, secretUnlocked } = useGameStore();

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <Header title="Menu" subtitle="Your streak unlocks more" />

      <View className="mx-4 mt-2">
        {/* Tier unlock badges */}
        <View className="flex-row gap-2 mb-5">
          {[
            { label: "Basic", icon: "📋", unlocked: true, req: "Unlocked" },
            { label: "Pro", icon: "⭐", unlocked: proUnlocked, req: proUnlocked ? "Unlocked" : "Day 7" },
            { label: "Secret", icon: "🌟", unlocked: secretUnlocked, req: secretUnlocked ? "Unlocked" : "Day 21" },
          ].map(({ label, icon, unlocked, req }) => (
            <View key={label} className={`flex-1 rounded-xl p-3 items-center border-2
              ${unlocked ? "bg-green-50 border-brand-lime" : "bg-gray-100 border-gray-200"}`}>
              <Text className="text-lg mb-0.5">{icon}</Text>
              <Text className="text-xs font-bold text-brand-dark">{label}</Text>
              <Text className={`text-xs ${unlocked ? "text-brand-green" : "text-gray-400"}`}>{req}</Text>
            </View>
          ))}
        </View>

        <MenuSection title="Basic Menu" badge="Available" items={BASIC_MENU} locked={false} />
        <MenuSection
          title="Pro Menu"
          badge={proUnlocked ? "Unlocked" : null}
          items={PRO_MENU}
          locked={!proUnlocked}
          lockMessage="Keep your streak going"
          streakNeeded={7}
          currentStreak={currentStreak}
        />
        <MenuSection
          title="Secret Menu"
          badge={secretUnlocked ? "Unlocked" : null}
          items={SECRET_MENU}
          locked={!secretUnlocked}
          lockMessage="For the truly dedicated"
          streakNeeded={21}
          currentStreak={currentStreak}
        />
      </View>
    </ScrollView>
  );
}

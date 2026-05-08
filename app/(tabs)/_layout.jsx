import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { useGameStore } from "../../store/useGameStore";

function TabIcon({ emoji, label, focused, hasAlert }) {
  return (
    <View className="items-center justify-center pt-1 relative" style={{ minWidth: 48 }}>
      {hasAlert ? (
        <View className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full z-10" />
      ) : null}
      <Text style={{ fontSize: 20, lineHeight: 24 }}>{emoji}</Text>
      <Text
        style={{
          fontSize: 10,
          fontWeight: focused ? "700" : "500",
          color: focused ? "#2D6A4F" : "#9ca3af",
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const { streakState } = useGameStore();
  const streakAlert = streakState !== "active";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#f3f4f6",
          height: 64,
          paddingBottom: 8,
          paddingTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Today" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="streak"
        options={{
          title: "Streak",
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🔥" label="Streak" focused={focused} hasAlert={streakAlert} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ focused }) => <TabIcon emoji="🥗" label="Menu" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: "Rewards",
          tabBarIcon: ({ focused }) => <TabIcon emoji="⭐" label="Rewards" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: "Report",
          tabBarIcon: ({ focused }) => <TabIcon emoji="📊" label="Report" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          tabBarIcon: ({ focused }) => <TabIcon emoji="⚡" label="Events" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

import { useState } from "react";
import { HomeScreen } from "./screens/HomeScreen";
import { StreakScreen } from "./screens/StreakScreen";
import { RewardsScreen } from "./screens/RewardsScreen";
import { MenuScreen } from "./screens/MenuScreen";
import { ReportScreen } from "./screens/ReportScreen";
import { EventsScreen } from "./screens/EventsScreen";
import { useGameStore } from "./store/useGameStore";

const NAV_ITEMS = [
  { id: "home", label: "Today", icon: "🏠" },
  { id: "streak", label: "Streak", icon: "🔥" },
  { id: "menu", label: "Menu", icon: "🥗" },
  { id: "rewards", label: "Rewards", icon: "⭐" },
  { id: "report", label: "Report", icon: "📊" },
  { id: "events", label: "Events", icon: "⚡" },
];

function BottomNav({ current, onNav, streakState }) {
  return (
    <nav
      className="fixed bottom-0 bg-white border-t border-gray-100 flex items-center justify-around px-1 py-2 z-50"
      style={{ width: "min(100%, 390px)", left: "50%", transform: "translateX(-50%)" }}
    >
      {NAV_ITEMS.map(({ id, label, icon }) => {
        const isActive = current === id;
        const hasAlert = id === "streak" && streakState !== "active";
        return (
          <button
            key={id}
            onClick={() => onNav(id)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-2xl transition-all duration-150 relative select-none
              ${isActive ? "bg-brand-green/10" : "active:bg-gray-100"}`}
          >
            <span className="text-xl leading-none">{icon}</span>
            <span className={`text-[10px] font-semibold leading-none
              ${isActive ? "text-brand-green" : "text-gray-400"}`}>
              {label}
            </span>
            {hasAlert && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-brand-red rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
}

const SCREENS = {
  home: HomeScreen,
  streak: StreakScreen,
  menu: MenuScreen,
  rewards: RewardsScreen,
  report: ReportScreen,
  events: EventsScreen,
};

export default function App() {
  const [screen, setScreen] = useState("home");
  const { streakState } = useGameStore();

  const Screen = SCREENS[screen] || HomeScreen;

  return (
    <div className="phone-shell">
      <div className="overflow-y-auto h-full" style={{ paddingBottom: 72 }}>
        <Screen navigate={setScreen} />
      </div>
      <BottomNav current={screen} onNav={setScreen} streakState={streakState} />
    </div>
  );
}

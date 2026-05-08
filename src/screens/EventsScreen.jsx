import { useState } from "react";
import { Header } from "../components/shared/Header";
import { PrimaryButton } from "../components/shared/PrimaryButton";
import { useGameStore } from "../store/useGameStore";

const EVENT_CONFIGS = {
  double: {
    icon: "⚡",
    gradient: "from-yellow-400 to-brand-orange",
    bg: "bg-brand-gold/10",
    border: "border-brand-gold",
    title: "Double Points Active",
    subtitle: "Today = 2x rewards",
    body: "Every meal confirmed today earns double points. This is your chance to accelerate your rewards.",
    cta: "Activate Today",
    badge: "2X POINTS",
    badgeColor: "bg-brand-gold text-brand-dark",
  },
  mystery: {
    icon: "🌟",
    gradient: "from-purple-500 to-indigo-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    title: "Mystery Bowl Today",
    subtitle: "A surprise aligned with your goal",
    body: "You'll receive a surprise meal curated by our chef, perfectly aligned with your health goal. No choices needed — just trust the system.",
    cta: "Accept Mystery Bowl",
    badge: "MYSTERY",
    badgeColor: "bg-purple-500 text-white",
  },
  nochoice: {
    icon: "🎯",
    gradient: "from-brand-green to-brand-dark",
    bg: "bg-brand-green/10",
    border: "border-brand-green",
    title: "No Choice Day",
    subtitle: "We decide. You eat.",
    body: "Today we take the decision off your plate. We've chosen the perfect meals for you. Just follow the system and trust the process.",
    cta: "Follow the System",
    badge: "AUTO",
    badgeColor: "bg-brand-green text-white",
  },
};

function EventCard({ type, active, onActivate, activated }) {
  const cfg = EVENT_CONFIGS[type];

  return (
    <div className={`rounded-3xl border-2 overflow-hidden mb-4 ${active ? cfg.border : "border-gray-200"}`}>
      {/* Header gradient */}
      <div className={`bg-gradient-to-r ${active ? cfg.gradient : "from-gray-300 to-gray-400"} p-5`}>
        <div className="flex items-center justify-between">
          <div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${active ? cfg.badgeColor : "bg-white/20 text-white"}`}>
              {cfg.badge}
            </span>
            <div className="text-white font-black text-xl mt-2">{cfg.title}</div>
            <div className="text-white/80 text-sm">{cfg.subtitle}</div>
          </div>
          <div className="text-5xl">{cfg.icon}</div>
        </div>
      </div>

      {/* Body */}
      <div className={`${active ? cfg.bg : "bg-gray-50"} p-4`}>
        <p className="text-sm text-gray-600 mb-4">{cfg.body}</p>
        {active && !activated && (
          <PrimaryButton
            variant={type === "double" ? "gold" : type === "mystery" ? "outline" : "green"}
            onClick={onActivate}
          >
            {cfg.cta}
          </PrimaryButton>
        )}
        {activated && (
          <div className="text-center py-2">
            <span className="text-brand-green font-bold text-sm">✓ Activated for today</span>
          </div>
        )}
        {!active && (
          <div className="text-center py-2">
            <span className="text-gray-400 text-xs">Not available today</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function EventsScreen({ navigate }) {
  const { todayEvent, simulateMissedDay, simulateAtRisk, resetDemo } = useGameStore();
  const [activated, setActivated] = useState({});

  function handleActivate(type) {
    setActivated((prev) => ({ ...prev, [type]: true }));
  }

  return (
    <div className="flex flex-col h-full pb-24">
      <Header title="Events" subtitle="Special challenges & boosts" />

      <div className="mx-4 mt-2 overflow-y-auto">
        {/* Today's event highlight */}
        {todayEvent && (
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
              <span className="text-xs font-bold text-brand-green uppercase tracking-wide">Active Today</span>
            </div>
          </div>
        )}

        {Object.keys(EVENT_CONFIGS).map((type) => (
          <EventCard
            key={type}
            type={type}
            active={todayEvent?.type === type}
            activated={!!activated[type]}
            onActivate={() => handleActivate(type)}
          />
        ))}

        {/* Demo controls */}
        <div className="mt-4 bg-gray-100 rounded-2xl p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Demo Controls</div>
          <div className="space-y-2">
            <button
              onClick={simulateAtRisk}
              className="w-full text-left text-sm bg-white rounded-xl px-4 py-3 font-medium text-brand-red border border-brand-red/20"
            >
              ⚠️ Simulate At Risk State
            </button>
            <button
              onClick={simulateMissedDay}
              className="w-full text-left text-sm bg-white rounded-xl px-4 py-3 font-medium text-gray-600 border border-gray-200"
            >
              💔 Simulate Missed Day
            </button>
            <button
              onClick={resetDemo}
              className="w-full text-left text-sm bg-white rounded-xl px-4 py-3 font-medium text-brand-green border border-brand-green/20"
            >
              🔄 Reset Demo State
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

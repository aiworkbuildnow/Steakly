import { useState } from "react";
import { Header } from "../components/shared/Header";
import { StatsBar } from "../components/shared/StatsBar";
import { PrimaryButton } from "../components/shared/PrimaryButton";
import { useGameStore } from "../store/useGameStore";

export function HomeScreen({ navigate }) {
  const store = useGameStore();
  const [confirmed, setConfirmed] = useState(store.mealConfirmedToday);
  const [showSuccess, setShowSuccess] = useState(false);

  function handleConfirm() {
    store.confirmMeal();
    setConfirmed(true);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }

  const { currentDay, currentStreak, points, level, todayPlan, todayEvent, streakState } = store;

  return (
    <div className="flex flex-col h-full pb-24">
      <Header
        title="Fresh Salad Bar"
        subtitle={`Day ${currentDay} – ${level.label} Phase`}
        right={
          <div className="bg-brand-cream rounded-full px-3 py-1">
            <span className="text-brand-dark text-xs font-semibold">{store.saveTokens} 🛡️ tokens</span>
          </div>
        }
      />

      <StatsBar streak={currentStreak} points={points} level={level} />

      {/* Event Banner */}
      {todayEvent && (
        <div className={`mx-4 mb-3 rounded-2xl p-4 slide-up
          ${todayEvent.type === "double" ? "bg-brand-gold/20 border border-brand-gold" :
            todayEvent.type === "mystery" ? "bg-purple-50 border border-purple-200" :
            "bg-brand-lime/20 border border-brand-lime"}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{todayEvent.icon}</span>
            <div>
              <div className="font-bold text-brand-dark text-sm">{todayEvent.title}</div>
              <div className="text-xs text-gray-600 mt-0.5">{todayEvent.description}</div>
            </div>
          </div>
        </div>
      )}

      {/* At Risk Banner */}
      {streakState === "at_risk" && (
        <div className="mx-4 mb-3 bg-brand-red/10 border border-brand-red/30 rounded-2xl p-4 slide-up">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            <div>
              <div className="font-bold text-brand-red text-sm">Streak At Risk</div>
              <div className="text-xs text-gray-600">You haven't completed today's meal. Your {currentStreak}-day streak is at risk.</div>
            </div>
          </div>
        </div>
      )}

      {/* Today's Plan Card */}
      <div className="mx-4 mb-4 bg-brand-cream rounded-3xl p-5 flex-1">
        <div className="text-xs font-semibold text-brand-green uppercase tracking-wider mb-3">Today's Plan</div>

        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-lime/20 rounded-xl flex items-center justify-center text-xl">🥗</div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Lunch</div>
              <div className="font-bold text-brand-dark text-sm">{todayPlan.lunch}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center text-xl">🌿</div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Dinner</div>
              <div className="font-bold text-brand-dark text-sm">{todayPlan.dinner}</div>
            </div>
          </div>
        </div>

        {/* Streak Progress */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-500">Week Progress</span>
            <span className="text-xs text-brand-green font-bold">
              Next reward: Day {store.nextStreakReward.days}
            </span>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: 7 }).map((_, i) => {
              const dayNum = currentStreak - (currentStreak % 7) + i + 1;
              const done = i < (currentStreak % 7 || 7);
              const isToday = i === (currentStreak % 7 === 0 ? 6 : (currentStreak % 7) - 1);
              return (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full transition-all duration-500 streak-dot
                    ${done ? "bg-brand-green" : "bg-gray-200"}
                    ${isToday && done ? "ring-2 ring-brand-lime ring-offset-1" : ""}`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <span key={i} className="text-xs text-gray-400 flex-1 text-center">{i + 1}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="mx-4">
        {showSuccess ? (
          <div className="bg-brand-lime rounded-2xl p-4 text-center bounce-in">
            <div className="text-3xl mb-1">🎉</div>
            <div className="font-bold text-white text-base">Meal logged!</div>
            <div className="text-white/80 text-sm">Streak +1 · +{todayEvent?.type === "double" ? "20" : "10"} points</div>
          </div>
        ) : (
          <PrimaryButton
            onClick={handleConfirm}
            disabled={confirmed}
            variant={confirmed ? "outline" : "green"}
          >
            {confirmed ? "✓ Meal Confirmed Today" : "Confirm Meal"}
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}

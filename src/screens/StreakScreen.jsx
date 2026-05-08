import { useState } from "react";
import { Header } from "../components/shared/Header";
import { PrimaryButton } from "../components/shared/PrimaryButton";
import { useGameStore } from "../store/useGameStore";

function ActiveStreak({ store, navigate }) {
  const { currentStreak, nextStreakReward } = store;
  const weekDay = currentStreak % 7 || 7;
  const daysToReward = nextStreakReward.days - currentStreak;

  return (
    <div className="flex flex-col h-full pb-24 slide-up">
      <Header title="Streak Engine" subtitle="Keep the fire alive" />

      <div className="mx-4 mt-2">
        {/* Flame card */}
        <div className="bg-gradient-to-br from-brand-dark to-brand-green rounded-3xl p-6 text-center mb-4">
          <div className="text-6xl mb-2">🔥</div>
          <div className="text-white text-5xl font-black">{currentStreak}</div>
          <div className="text-brand-light font-semibold mt-1">Day Streak</div>
        </div>

        {/* Weekly progress dots */}
        <div className="bg-brand-cream rounded-3xl p-5 mb-4">
          <div className="text-xs font-semibold text-brand-green uppercase tracking-wider mb-3">This Week</div>
          <div className="flex items-center justify-between gap-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const filled = i < weekDay;
              const isToday = i === weekDay - 1;
              return (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <div className={`relative w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${filled ? "bg-brand-green text-white" : "bg-gray-200 text-gray-400"}`}>
                    {filled ? "✓" : i + 1}
                    {isToday && (
                      <div className="absolute inset-0 rounded-full bg-brand-lime/40 pulse-ring" />
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next reward */}
        <div className="bg-brand-gold/10 border border-brand-gold/40 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-brand-dark uppercase tracking-wide">Next Reward</div>
              <div className="font-bold text-brand-dark mt-0.5">+{nextStreakReward.points} Points</div>
              <div className="text-sm text-gray-600">Unlock: {nextStreakReward.label}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-brand-gold">{daysToReward}</div>
              <div className="text-xs text-gray-500">days left</div>
            </div>
          </div>
          <div className="mt-3 bg-white rounded-full h-2">
            <div
              className="bg-brand-gold h-2 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, ((currentStreak % nextStreakReward.days) / nextStreakReward.days) * 100)}%` }}
            />
          </div>
        </div>

        <PrimaryButton variant="green" onClick={() => navigate("home")}>
          Back to Today
        </PrimaryButton>
      </div>
    </div>
  );
}

function AtRiskStreak({ store, navigate }) {
  return (
    <div className="flex flex-col h-full pb-24 slide-up">
      <Header title="Streak At Risk" />
      <div className="mx-4 mt-2">
        <div className="bg-brand-red/10 border border-brand-red/40 rounded-3xl p-6 text-center mb-4">
          <div className="text-5xl mb-3">⚠️</div>
          <div className="font-bold text-brand-red text-xl mb-1">Don't break it now</div>
          <div className="text-gray-600 text-sm">
            You haven't completed today's meal. Your <span className="font-bold text-brand-dark">{store.currentStreak}-day streak</span> is at risk.
          </div>
        </div>

        <div className="bg-brand-cream rounded-2xl p-4 mb-4 text-center">
          <div className="text-2xl mb-1">🏆</div>
          <div className="text-sm text-gray-600">You're this close to</div>
          <div className="font-bold text-brand-dark">Day {store.nextStreakReward.days} – {store.nextStreakReward.label}</div>
          <div className="text-xs text-brand-green mt-0.5">Only {store.nextStreakReward.days - store.currentStreak} days away</div>
        </div>

        <PrimaryButton variant="green" onClick={() => navigate("home")} className="mb-3">
          Complete Today's Meal
        </PrimaryButton>
        <PrimaryButton variant="outline" onClick={() => navigate("home")}>
          Remind Me Later
        </PrimaryButton>
      </div>
    </div>
  );
}

function MissedStreak({ store, navigate }) {
  const [used, setUsed] = useState(false);
  const [restarted, setRestarted] = useState(false);

  function handleSaveToken() {
    const ok = store.useSaveToken();
    if (ok) setUsed(true);
  }

  function handleRestart() {
    store.restartStreak();
    setRestarted(true);
    setTimeout(() => navigate("home"), 1500);
  }

  if (used) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 pb-24 bounce-in">
        <div className="text-6xl mb-4">🛡️</div>
        <div className="text-2xl font-black text-brand-dark mb-2">Streak Saved!</div>
        <div className="text-gray-600 text-center mb-6">Your {store.currentStreak}-day streak is protected. Don't miss tomorrow.</div>
        <PrimaryButton variant="green" onClick={() => navigate("home")}>Continue</PrimaryButton>
      </div>
    );
  }

  if (restarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 pb-24 bounce-in">
        <div className="text-6xl mb-4">🌱</div>
        <div className="text-2xl font-black text-brand-dark mb-2">Fresh Start</div>
        <div className="text-gray-600 text-center">Every champion started at Day 1. Let's go.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full pb-24 slide-up">
      <Header title="Streak Broken" />
      <div className="mx-4 mt-2">
        <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 text-center mb-5">
          <div className="text-5xl mb-3">💔</div>
          <div className="font-bold text-gray-800 text-xl mb-1">You reached: <span className="text-brand-green">{store.currentStreak} days</span></div>
          <div className="text-gray-500 text-sm">That's still something to be proud of.</div>
        </div>

        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">Choose your path</div>

        {store.saveTokens > 0 ? (
          <button
            onClick={handleSaveToken}
            className="w-full bg-brand-gold/10 border-2 border-brand-gold rounded-2xl p-4 mb-3 text-left flex items-center gap-4 active:bg-brand-gold/20"
          >
            <div className="w-12 h-12 bg-brand-gold rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🛡️</div>
            <div>
              <div className="font-bold text-brand-dark">Use Save Token</div>
              <div className="text-sm text-gray-500">Restore your {store.currentStreak}-day streak</div>
              <div className="text-xs text-brand-gold font-medium mt-0.5">{store.saveTokens} token available</div>
            </div>
          </button>
        ) : (
          <div className="w-full bg-gray-100 border-2 border-gray-200 rounded-2xl p-4 mb-3 flex items-center gap-4 opacity-50">
            <div className="w-12 h-12 bg-gray-300 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🛡️</div>
            <div>
              <div className="font-bold text-gray-600">Use Save Token</div>
              <div className="text-sm text-gray-400">No tokens available</div>
            </div>
          </div>
        )}

        <button
          onClick={handleRestart}
          className="w-full bg-brand-green/10 border-2 border-brand-green rounded-2xl p-4 flex items-center gap-4 active:bg-brand-green/20"
        >
          <div className="w-12 h-12 bg-brand-green rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🌱</div>
          <div>
            <div className="font-bold text-brand-dark">Restart from Day 1</div>
            <div className="text-sm text-gray-500">Fresh start, stronger comeback</div>
          </div>
        </button>
      </div>
    </div>
  );
}

export function StreakScreen({ navigate }) {
  const store = useGameStore();

  if (store.streakState === "missed") return <MissedStreak store={store} navigate={navigate} />;
  if (store.streakState === "at_risk") return <AtRiskStreak store={store} navigate={navigate} />;
  return <ActiveStreak store={store} navigate={navigate} />;
}

import { useState } from "react";
import { Header } from "../components/shared/Header";
import { useGameStore } from "../store/useGameStore";

export function RewardsScreen({ navigate }) {
  const store = useGameStore();
  const [redeemed, setRedeemed] = useState(null);
  const [flash, setFlash] = useState(null);

  function handleRedeem(reward) {
    if (store.points < reward.points) return;
    if (store.redeemedRewards.includes(reward.id)) return;
    const ok = store.redeemReward(reward.id);
    if (ok) {
      setRedeemed(reward.id);
      setFlash(reward);
      setTimeout(() => setFlash(null), 3000);
    }
  }

  const { rewards, points, redeemedRewards } = store;

  return (
    <div className="flex flex-col h-full pb-24">
      <Header title="Rewards" subtitle="Spend your hard-earned points" />

      {/* Points display */}
      <div className="mx-4 mt-2 mb-4 bg-gradient-to-br from-brand-gold to-brand-orange rounded-3xl p-5 text-center">
        <div className="text-white/80 text-sm font-medium mb-1">Your Balance</div>
        <div className="text-white text-5xl font-black">{points}</div>
        <div className="text-white/80 text-sm mt-1">Points</div>
      </div>

      {/* Flash success */}
      {flash && (
        <div className="mx-4 mb-3 bg-brand-lime rounded-2xl p-4 text-center bounce-in">
          <div className="text-2xl mb-1">{flash.icon}</div>
          <div className="font-bold text-white">{flash.label} redeemed!</div>
          <div className="text-white/80 text-sm">{flash.description}</div>
        </div>
      )}

      {/* Reward cards */}
      <div className="mx-4 space-y-3 overflow-y-auto">
        {rewards.map((reward) => {
          const canAfford = points >= reward.points;
          const isRedeemed = redeemedRewards.includes(reward.id);

          return (
            <button
              key={reward.id}
              onClick={() => handleRedeem(reward)}
              disabled={!canAfford || isRedeemed}
              className={`w-full rounded-2xl p-4 flex items-center gap-4 text-left transition-all
                ${isRedeemed
                  ? "bg-gray-100 border-2 border-gray-200 opacity-60"
                  : canAfford
                  ? "bg-white border-2 border-brand-gold/40 active:bg-brand-gold/10 shadow-sm"
                  : "bg-gray-50 border-2 border-gray-200 opacity-50"
                }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0
                ${isRedeemed ? "bg-gray-200" : canAfford ? "bg-brand-gold/20" : "bg-gray-200"}`}>
                {isRedeemed ? "✓" : reward.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-brand-dark truncate">{reward.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{reward.description}</div>
              </div>
              <div className="flex-shrink-0 text-right">
                {isRedeemed ? (
                  <span className="text-xs text-gray-400 font-medium">Applied</span>
                ) : (
                  <div className={`font-black text-lg ${canAfford ? "text-brand-gold" : "text-gray-400"}`}>
                    {reward.points}
                  </div>
                )}
                {!isRedeemed && <div className="text-xs text-gray-400">pts</div>}
              </div>
            </button>
          );
        })}
      </div>

      {/* How to earn */}
      <div className="mx-4 mt-4 bg-brand-cream rounded-2xl p-4">
        <div className="text-xs font-semibold text-brand-green uppercase tracking-wide mb-2">Earn More Points</div>
        <div className="space-y-1.5">
          {[
            { label: "Confirm a meal", pts: "+10 pts" },
            { label: "Double Point Day", pts: "+20 pts" },
            { label: "Complete 7-day streak", pts: "+100 pts" },
            { label: "Complete 21-day streak", pts: "+200 pts" },
          ].map(({ label, pts }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{label}</span>
              <span className="text-sm font-bold text-brand-green">{pts}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

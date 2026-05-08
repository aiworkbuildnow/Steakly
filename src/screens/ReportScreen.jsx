import { Header } from "../components/shared/Header";
import { PrimaryButton } from "../components/shared/PrimaryButton";
import { useGameStore } from "../store/useGameStore";

function RingChart({ value, max, color, size = 72 }) {
  const pct = Math.min(1, value / max);
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={6} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
    </svg>
  );
}

function DayDot({ done, day }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
        ${done ? "bg-brand-green text-white" : "bg-gray-200 text-gray-400"}`}>
        {done ? "✓" : day}
      </div>
      <span className="text-xs text-gray-400">{["M", "T", "W", "T", "F", "S", "S"][day - 1]}</span>
    </div>
  );
}

export function ReportScreen({ navigate }) {
  const {
    currentStreak,
    bestStreak,
    points,
    totalMealsCompleted,
    totalMealsMissed,
    weeklyMeals,
    level,
    currentDay,
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
    <div className="flex flex-col h-full pb-24">
      <Header title="Weekly Report" subtitle={`Week ${Math.ceil(currentDay / 7)} Summary`} />

      <div className="mx-4 mt-2 overflow-y-auto space-y-4">
        {/* Hero stats */}
        <div className="bg-gradient-to-br from-brand-dark to-brand-green rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-white/70 text-xs font-medium uppercase tracking-wide">Current Level</div>
              <div className="text-brand-gold font-black text-xl mt-0.5">{level.label}</div>
            </div>
            <div className="text-4xl">📊</div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Consistency", value: `${consistency}/${total}`, sub: `${consistencyPct}%` },
              { label: "Best Streak", value: bestStreak, sub: "days" },
              { label: "Points", value: points, sub: "total" },
            ].map(({ label, value, sub }) => (
              <div key={label} className="bg-white/10 rounded-2xl p-3 text-center">
                <div className="text-white font-black text-xl leading-none">{value}</div>
                <div className="text-white/60 text-xs mt-1">{sub}</div>
                <div className="text-white/50 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly calendar */}
        <div className="bg-brand-cream rounded-3xl p-5">
          <div className="text-xs font-semibold text-brand-green uppercase tracking-wider mb-3">This Week</div>
          <div className="flex justify-between">
            {weeklyMeals.map((done, i) => (
              <DayDot key={i} done={done} day={i + 1} />
            ))}
          </div>
        </div>

        {/* Meals completed vs missed */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-brand-green/10 border border-brand-green/30 rounded-2xl p-4 flex flex-col items-center gap-2">
            <RingChart value={totalMealsCompleted} max={totalMealsCompleted + totalMealsMissed} color="#52B788" />
            <div className="font-black text-2xl text-brand-green">{totalMealsCompleted}</div>
            <div className="text-xs text-gray-500 text-center">Meals Completed</div>
          </div>
          <div className="bg-brand-red/10 border border-brand-red/30 rounded-2xl p-4 flex flex-col items-center gap-2">
            <RingChart value={totalMealsMissed} max={totalMealsCompleted + totalMealsMissed} color="#E76F51" />
            <div className="font-black text-2xl text-brand-red">{totalMealsMissed}</div>
            <div className="text-xs text-gray-500 text-center">Missed</div>
          </div>
        </div>

        {/* Insight */}
        <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <div className="text-xs font-semibold text-brand-dark uppercase tracking-wide mb-1">Weekly Insight</div>
              <div className="text-sm text-gray-700">{insight}</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <PrimaryButton variant="green" onClick={() => navigate("home")}>
          Continue Next Week
        </PrimaryButton>
      </div>
    </div>
  );
}

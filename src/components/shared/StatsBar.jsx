export function StatsBar({ streak, points, level }) {
  return (
    <div className="mx-4 my-3 bg-brand-dark rounded-2xl px-5 py-3 flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span className="text-lg">🔥</span>
        <div>
          <div className="text-white font-bold text-base leading-none">{streak}</div>
          <div className="text-brand-light text-xs">Day Streak</div>
        </div>
      </div>
      <div className="h-8 w-px bg-white/20" />
      <div className="flex items-center gap-1.5">
        <span className="text-lg">⭐</span>
        <div>
          <div className="text-white font-bold text-base leading-none">{points}</div>
          <div className="text-brand-light text-xs">Points</div>
        </div>
      </div>
      <div className="h-8 w-px bg-white/20" />
      <div className="text-right">
        <div className="text-brand-gold font-bold text-sm leading-none">{level.label}</div>
        <div className="text-brand-light text-xs">Level</div>
      </div>
    </div>
  );
}

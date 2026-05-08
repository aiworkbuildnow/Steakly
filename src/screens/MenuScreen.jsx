import { Header } from "../components/shared/Header";
import { useGameStore } from "../store/useGameStore";

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
    <div className={`flex items-center gap-3 bg-white rounded-2xl p-4 ${locked ? "opacity-40" : ""}`}>
      <div className="w-12 h-12 bg-brand-cream rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
        {locked ? "🔒" : item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-brand-dark text-sm truncate">{locked ? "Locked Item" : item.name}</div>
        <div className="text-xs text-gray-500 mt-0.5 truncate">{locked ? "Unlock to reveal" : item.desc}</div>
      </div>
      {!locked && (
        <div className="text-right flex-shrink-0">
          <div className="text-xs text-gray-400">{item.cal} cal</div>
        </div>
      )}
    </div>
  );
}

function MenuSection({ title, badge, items, locked, lockMessage, streakNeeded, currentStreak }) {
  const progress = locked ? Math.min(100, (currentStreak / streakNeeded) * 100) : 100;

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-brand-dark">{title}</span>
          {badge && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full
              ${locked ? "bg-gray-200 text-gray-500" : "bg-brand-lime text-white"}`}>
              {badge}
            </span>
          )}
        </div>
        {locked && (
          <span className="text-xs text-gray-400 font-medium">🔒 Day {streakNeeded}</span>
        )}
      </div>

      {locked && (
        <div className="mb-3 bg-gray-100 rounded-xl p-3">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-gray-500">{lockMessage}</span>
            <span className="text-xs font-bold text-brand-green">{currentStreak}/{streakNeeded} days</span>
          </div>
          <div className="bg-white rounded-full h-1.5">
            <div
              className="bg-brand-green h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item, i) => (
          <MenuItem key={i} item={item} locked={locked} />
        ))}
      </div>
    </div>
  );
}

export function MenuScreen({ navigate }) {
  const { currentStreak, proUnlocked, secretUnlocked } = useGameStore();

  return (
    <div className="flex flex-col h-full pb-24">
      <Header title="Menu" subtitle="Your progression unlocks more" />

      <div className="mx-4 mt-2 overflow-y-auto">
        {/* Unlock status */}
        <div className="flex gap-2 mb-5">
          <div className={`flex-1 rounded-xl p-3 text-center border-2
            ${true ? "bg-brand-green/10 border-brand-green" : "bg-gray-100 border-gray-200"}`}>
            <div className="text-lg mb-0.5">📋</div>
            <div className="text-xs font-bold text-brand-dark">Basic</div>
            <div className="text-xs text-brand-green">Unlocked</div>
          </div>
          <div className={`flex-1 rounded-xl p-3 text-center border-2
            ${proUnlocked ? "bg-brand-lime/10 border-brand-lime" : "bg-gray-100 border-gray-200"}`}>
            <div className="text-lg mb-0.5">⭐</div>
            <div className="text-xs font-bold text-brand-dark">Pro</div>
            <div className={`text-xs ${proUnlocked ? "text-brand-lime" : "text-gray-400"}`}>
              {proUnlocked ? "Unlocked" : "Day 7"}
            </div>
          </div>
          <div className={`flex-1 rounded-xl p-3 text-center border-2
            ${secretUnlocked ? "bg-purple-100 border-purple-300" : "bg-gray-100 border-gray-200"}`}>
            <div className="text-lg mb-0.5">🌟</div>
            <div className="text-xs font-bold text-brand-dark">Secret</div>
            <div className={`text-xs ${secretUnlocked ? "text-purple-500" : "text-gray-400"}`}>
              {secretUnlocked ? "Unlocked" : "Day 21"}
            </div>
          </div>
        </div>

        <MenuSection
          title="Basic Menu"
          badge="Available"
          items={BASIC_MENU}
          locked={false}
        />

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
      </div>
    </div>
  );
}

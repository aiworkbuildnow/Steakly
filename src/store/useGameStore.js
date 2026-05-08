import { useState, useCallback } from "react";

const LEVELS = [
  { minDay: 1, maxDay: 3, label: "Starter", color: "text-gray-500" },
  { minDay: 4, maxDay: 7, label: "Consistent", color: "text-brand-lime" },
  { minDay: 8, maxDay: 14, label: "Disciplined", color: "text-brand-green" },
  { minDay: 15, maxDay: 30, label: "Elite", color: "text-brand-gold" },
  { minDay: 31, maxDay: Infinity, label: "Unstoppable", color: "text-brand-orange" },
];

const REWARDS = [
  { id: "addon", points: 50, label: "Free Add-on", icon: "🥑", description: "Applied to your next order" },
  { id: "mystery", points: 100, label: "Mystery Upgrade", icon: "🎁", description: "Surprise upgrade on next order" },
  { id: "probowl", points: 150, label: "Unlock Pro Bowl", icon: "🏆", description: "Access Pro Bowl menu item" },
  { id: "freemeal", points: 200, label: "Free Meal", icon: "🥗", description: "One completely free meal" },
];

const DAILY_PLANS = [
  { lunch: "Protein Power Bowl", dinner: "Light Detox Bowl" },
  { lunch: "Classic Caesar Salad", dinner: "Grilled Veggie Bowl" },
  { lunch: "Spicy Chicken Bowl", dinner: "Green Goddess Wrap" },
  { lunch: "Mediterranean Bowl", dinner: "Avocado Crunch Bowl" },
  { lunch: "Quinoa Power Plate", dinner: "Lean & Green Bowl" },
];

const EVENTS = [
  { id: "mystery", title: "Mystery Bowl Today", icon: "🌟", description: "You'll receive a surprise meal aligned with your goal.", type: "mystery" },
  { id: "nochoice", title: "No Choice Day", icon: "🎯", description: "We decide your meals today. Just follow the system.", type: "nochoice" },
  { id: "doublepoints", title: "Double Points Active", icon: "⚡", description: "Today = 2x rewards", type: "double" },
];

function getLevel(day) {
  return LEVELS.find((l) => day >= l.minDay && day <= l.maxDay) || LEVELS[0];
}

function getPlanForDay(day) {
  return DAILY_PLANS[(day - 1) % DAILY_PLANS.length];
}

function getTodayEvent(day) {
  // Trigger events on specific day patterns to prevent boredom
  if (day % 7 === 3) return EVENTS[2]; // double points every week on day 3
  if (day % 10 === 0) return EVENTS[0]; // mystery day every 10 days
  if (day % 14 === 6) return EVENTS[1]; // no choice day bi-weekly
  return null;
}

const INITIAL_STATE = {
  currentDay: 6,
  currentStreak: 6,
  bestStreak: 6,
  points: 140,
  lastActiveDay: 6,
  mealConfirmedToday: false,
  saveTokens: 1,
  redeemedRewards: [],
  streakState: "active", // "active" | "at_risk" | "missed"
  weeksCompleted: 0,
  totalMealsCompleted: 10,
  totalMealsMissed: 2,
  weeklyMeals: [true, true, false, true, true, false, true],
};

// Singleton state (in-memory for demo; no persistence needed for prototype)
let globalState = { ...INITIAL_STATE };
let listeners = [];

function notify() {
  listeners.forEach((l) => l({ ...globalState }));
}

export function useGameStore() {
  const [state, setState] = useState({ ...globalState });

  const subscribe = useCallback(() => {
    listeners.push(setState);
    return () => {
      listeners = listeners.filter((l) => l !== setState);
    };
  }, []);

  // Subscribe on first render
  useState(() => {
    const unsub = subscribe();
    return unsub;
  });

  const confirmMeal = useCallback(() => {
    if (globalState.mealConfirmedToday) return;
    const isDouble = getTodayEvent(globalState.currentDay)?.type === "double";
    const pointsEarned = isDouble ? 20 : 10;
    globalState = {
      ...globalState,
      mealConfirmedToday: true,
      points: globalState.points + pointsEarned,
      currentStreak: globalState.currentStreak + 1,
      bestStreak: Math.max(globalState.bestStreak, globalState.currentStreak + 1),
      totalMealsCompleted: globalState.totalMealsCompleted + 1,
      currentDay: globalState.currentDay + 1,
      streakState: "active",
    };
    notify();
  }, []);

  const redeemReward = useCallback((rewardId) => {
    const reward = REWARDS.find((r) => r.id === rewardId);
    if (!reward || globalState.points < reward.points) return false;
    if (globalState.redeemedRewards.includes(rewardId)) return false;
    globalState = {
      ...globalState,
      points: globalState.points - reward.points,
      redeemedRewards: [...globalState.redeemedRewards, rewardId],
    };
    notify();
    return true;
  }, []);

  const useSaveToken = useCallback(() => {
    if (globalState.saveTokens < 1) return false;
    globalState = {
      ...globalState,
      saveTokens: globalState.saveTokens - 1,
      streakState: "active",
      currentStreak: globalState.currentStreak,
    };
    notify();
    return true;
  }, []);

  const restartStreak = useCallback(() => {
    globalState = {
      ...globalState,
      currentStreak: 0,
      currentDay: 1,
      streakState: "active",
      mealConfirmedToday: false,
    };
    notify();
  }, []);

  const simulateMissedDay = useCallback(() => {
    globalState = { ...globalState, streakState: "missed" };
    notify();
  }, []);

  const simulateAtRisk = useCallback(() => {
    globalState = { ...globalState, streakState: "at_risk" };
    notify();
  }, []);

  const resetDemo = useCallback(() => {
    globalState = { ...INITIAL_STATE };
    notify();
  }, []);

  const level = getLevel(state.currentDay);
  const todayPlan = getPlanForDay(state.currentDay);
  const todayEvent = getTodayEvent(state.currentDay);
  const proUnlocked = state.currentStreak >= 7;
  const secretUnlocked = state.currentStreak >= 21;
  const nextStreakReward = state.currentStreak < 7 ? { days: 7, label: "Pro Bowl", points: 100 }
    : state.currentStreak < 21 ? { days: 21, label: "Secret Menu", points: 200 }
    : { days: 30, label: "Unstoppable Badge", points: 500 };

  return {
    ...state,
    level,
    todayPlan,
    todayEvent,
    proUnlocked,
    secretUnlocked,
    nextStreakReward,
    rewards: REWARDS,
    confirmMeal,
    redeemReward,
    useSaveToken,
    restartStreak,
    simulateMissedDay,
    simulateAtRisk,
    resetDemo,
  };
}

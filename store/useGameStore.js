import { useState, useEffect } from "react";

const LEVELS = [
  { minDay: 1, maxDay: 3, label: "Starter" },
  { minDay: 4, maxDay: 7, label: "Consistent" },
  { minDay: 8, maxDay: 14, label: "Disciplined" },
  { minDay: 15, maxDay: 30, label: "Elite" },
  { minDay: 31, maxDay: Infinity, label: "Unstoppable" },
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
  if (day % 7 === 3) return EVENTS[2];
  if (day % 10 === 0) return EVENTS[0];
  if (day % 14 === 6) return EVENTS[1];
  return null;
}

const INITIAL_STATE = {
  currentDay: 6,
  currentStreak: 6,
  bestStreak: 6,
  points: 140,
  mealConfirmedToday: false,
  saveTokens: 1,
  redeemedRewards: [],
  streakState: "active",
  totalMealsCompleted: 10,
  totalMealsMissed: 2,
  weeklyMeals: [true, true, false, true, true, false, true],
};

let globalState = { ...INITIAL_STATE };
let listeners = new Set();

function setState(updater) {
  globalState = typeof updater === "function" ? updater(globalState) : updater;
  listeners.forEach((cb) => cb({ ...globalState }));
}

export function useGameStore() {
  const [state, setLocalState] = useState({ ...globalState });

  useEffect(() => {
    listeners.add(setLocalState);
    return () => listeners.delete(setLocalState);
  }, []);

  function confirmMeal() {
    if (globalState.mealConfirmedToday) return;
    const isDouble = getTodayEvent(globalState.currentDay)?.type === "double";
    const pointsEarned = isDouble ? 20 : 10;
    setState((s) => ({
      ...s,
      mealConfirmedToday: true,
      points: s.points + pointsEarned,
      currentStreak: s.currentStreak + 1,
      bestStreak: Math.max(s.bestStreak, s.currentStreak + 1),
      totalMealsCompleted: s.totalMealsCompleted + 1,
      currentDay: s.currentDay + 1,
      streakState: "active",
    }));
  }

  function redeemReward(rewardId) {
    const reward = REWARDS.find((r) => r.id === rewardId);
    if (!reward || globalState.points < reward.points) return false;
    if (globalState.redeemedRewards.includes(rewardId)) return false;
    setState((s) => ({
      ...s,
      points: s.points - reward.points,
      redeemedRewards: [...s.redeemedRewards, rewardId],
    }));
    return true;
  }

  function useSaveToken() {
    if (globalState.saveTokens < 1) return false;
    setState((s) => ({ ...s, saveTokens: s.saveTokens - 1, streakState: "active" }));
    return true;
  }

  function restartStreak() {
    setState((s) => ({
      ...s,
      currentStreak: 0,
      currentDay: 1,
      streakState: "active",
      mealConfirmedToday: false,
    }));
  }

  function simulateMissedDay() {
    setState((s) => ({ ...s, streakState: "missed" }));
  }

  function simulateAtRisk() {
    setState((s) => ({ ...s, streakState: "at_risk" }));
  }

  function resetDemo() {
    setState({ ...INITIAL_STATE });
  }

  const level = getLevel(state.currentDay);
  const todayPlan = getPlanForDay(state.currentDay);
  const todayEvent = getTodayEvent(state.currentDay);
  const proUnlocked = state.currentStreak >= 7;
  const secretUnlocked = state.currentStreak >= 21;
  const nextStreakReward =
    state.currentStreak < 7
      ? { days: 7, label: "Pro Bowl", points: 100 }
      : state.currentStreak < 21
      ? { days: 21, label: "Secret Menu", points: 200 }
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

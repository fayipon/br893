export const welcomeBonus = {
  title: 'PINOYPLAY ₱20 Welcome Bonus',
  rules: [
    'Register a new PINOYPLAY account and log in to receive a ₱20 welcome bonus. The bonus will be credited automatically.',
    'You must complete at least one successful deposit before you can start playing.',
    'Before making a withdrawal, you must wager the welcome bonus 5 times in Slots games. For a ₱20 bonus, the total required wagering is ₱100.',
    'Only valid bets placed on Slots games count toward the wagering requirement.',
  ],
}

export const weeklyCashback = {
  title: '10% Weekly Cashback',
  summary: 'Receive 10% of your accumulated weekly net losses from eligible Slot bets. Rewards unlock at 9:00 AM the following Monday and must be claimed manually in Rewards.',
  rules: [
    'Weekly cashback is 10% of your accumulated net losses from eligible Slot bets, with no reward cap.',
    'Each calculation period runs from Monday 00:00 to Sunday 23:59:59. Rewards unlock at 9:00 AM the following Monday.',
    'After settlement, check Upcoming rewards in the Rewards center. Claim your reward manually when the countdown ends.',
    'Net losses from bets placed while your account has unfinished wagering requirements do not count toward weekly cashback.',
    'Once unlocked in Rewards, the cashback must be claimed within 7 days.',
    'Before withdrawing, wager the cashback reward 10 times in Slot games.',
  ],
}

export const payday = {
  title: 'Payday',
  summary: 'Earn up to ₱5,000 each Payday period. Your accumulated deposits and wagers determine your reward tier.',
  tiers: [
    { level: 'C', deposits: 500, wagers: 5000, reward: 20, wagering: 3 },
    { level: 'B', deposits: 1500, wagers: 15000, reward: 60, wagering: 3 },
    { level: 'B+', deposits: 3000, wagers: 30000, reward: 120, wagering: 3 },
    { level: 'A', deposits: 5000, wagers: 60000, reward: 250, wagering: 3 },
    { level: 'A+', deposits: 10000, wagers: 120000, reward: 500, wagering: 3 },
    { level: 'S', deposits: 20000, wagers: 250000, reward: 1000, wagering: 3 },
    { level: 'SS', deposits: 50000, wagers: 600000, reward: 2500, wagering: 3 },
    { level: 'SSS', deposits: 100000, wagers: 1200000, reward: 5000, wagering: 3 },
  ],
  rules: [
    'There are two calculation periods each month: the 5th at 00:00 through the 19th at 23:59:59, and the 20th at 00:00 through the 4th of the following month at 23:59:59.',
    'After each calculation period ends, claim the Payday reward for your corresponding tier in the Rewards center.',
    'Payday rewards must be claimed within 7 days after they are issued.',
    'Before withdrawing, wager the reward amount 3 times in Slot games.',
  ],
}

export const firstThreeDeposits = {
  title: 'First 3 Deposits',
  summary: 'Three deposit bonuses, up to ₱17,000 in total. Each deposit has its own bonus rate and cap.',
  tiers: [
    { stage: '1st deposit', rate: 100, cap: 2000, wagering: 30, maxWagering: 60000 },
    { stage: '2nd deposit', rate: 80, cap: 5000, wagering: 30, maxWagering: 150000 },
    { stage: '3rd deposit', rate: 50, cap: 10000, wagering: 30, maxWagering: 300000 },
  ],
  rules: [
    'The first, second and third deposit bonuses are 100%, 80% and 50%, capped at ₱2,000, ₱5,000 and ₱10,000 respectively.',
    'Each bonus has a 30× wagering requirement, calculated on the bonus amount received.',
    'The combined maximum bonus across all three deposits is ₱17,000. Each deposit bonus remains subject to its own cap.',
    'Subsequent deposit rewards unlock at 9:00 AM each day.',
  ],
}

export const royalArrival = {
  title: 'New Player Carnival',
  displayTotal: 16000,
  totalRewards: 15995,
  summary: 'Complete 28 wagering and free-reward tasks. Every reward carries a 1× wagering requirement.',
  tasks: [
    {
      "id": 1,
      "type": "wager",
      "target": 100,
      "reward": 5,
      "wagering": 1
    },
    {
      "id": 2,
      "type": "wager",
      "target": 200,
      "reward": 5,
      "wagering": 1
    },
    {
      "id": 3,
      "type": "wager",
      "target": 500,
      "reward": 10,
      "wagering": 1
    },
    {
      "id": 4,
      "type": "free",
      "target": 500,
      "reward": 15,
      "wagering": 1
    },
    {
      "id": 5,
      "type": "wager",
      "target": 1000,
      "reward": 10,
      "wagering": 1
    },
    {
      "id": 6,
      "type": "wager",
      "target": 1500,
      "reward": 15,
      "wagering": 1
    },
    {
      "id": 7,
      "type": "wager",
      "target": 3000,
      "reward": 20,
      "wagering": 1
    },
    {
      "id": 8,
      "type": "free",
      "target": 3000,
      "reward": 25,
      "wagering": 1
    },
    {
      "id": 9,
      "type": "wager",
      "target": 5000,
      "reward": 30,
      "wagering": 1
    },
    {
      "id": 10,
      "type": "wager",
      "target": 10000,
      "reward": 50,
      "wagering": 1
    },
    {
      "id": 11,
      "type": "wager",
      "target": 15000,
      "reward": 100,
      "wagering": 1
    },
    {
      "id": 12,
      "type": "free",
      "target": 15000,
      "reward": 180,
      "wagering": 1
    },
    {
      "id": 13,
      "type": "wager",
      "target": 30000,
      "reward": 150,
      "wagering": 1
    },
    {
      "id": 14,
      "type": "wager",
      "target": 50000,
      "reward": 250,
      "wagering": 1
    },
    {
      "id": 15,
      "type": "wager",
      "target": 70000,
      "reward": 400,
      "wagering": 1
    },
    {
      "id": 16,
      "type": "free",
      "target": 70000,
      "reward": 530,
      "wagering": 1
    },
    {
      "id": 17,
      "type": "wager",
      "target": 100000,
      "reward": 500,
      "wagering": 1
    },
    {
      "id": 18,
      "type": "wager",
      "target": 120000,
      "reward": 600,
      "wagering": 1
    },
    {
      "id": 19,
      "type": "free",
      "target": 120000,
      "reward": 650,
      "wagering": 1
    },
    {
      "id": 20,
      "type": "wager",
      "target": 150000,
      "reward": 650,
      "wagering": 1
    },
    {
      "id": 21,
      "type": "wager",
      "target": 200000,
      "reward": 800,
      "wagering": 1
    },
    {
      "id": 22,
      "type": "free",
      "target": 200000,
      "reward": 1000,
      "wagering": 1
    },
    {
      "id": 23,
      "type": "wager",
      "target": 300000,
      "reward": 1000,
      "wagering": 1
    },
    {
      "id": 24,
      "type": "wager",
      "target": 500000,
      "reward": 1200,
      "wagering": 1
    },
    {
      "id": 25,
      "type": "free",
      "target": 500000,
      "reward": 1300,
      "wagering": 1
    },
    {
      "id": 26,
      "type": "wager",
      "target": 1000000,
      "reward": 1500,
      "wagering": 1
    },
    {
      "id": 27,
      "type": "wager",
      "target": 2000000,
      "reward": 2000,
      "wagering": 1
    },
    {
      "id": 28,
      "type": "free",
      "target": 2000000,
      "reward": 3000,
      "wagering": 1
    }
  ],
}

export const pinoyBannerSlides = [
  { id: 'welcome-bonus', label: '₱20 Welcome Bonus', kind: 'welcome-bonus', title: welcomeBonus.title },
  { id: 'rebate', label: 'Slot Daily Rebate', kind: 'rebate', title: 'Slot Daily Rebate' },
  { id: 'weekly-cashback', label: 'Weekly Cashback', kind: 'weekly-cashback', title: weeklyCashback.title },
  { id: 'payday', label: 'Payday', kind: 'payday', title: payday.title },
  { id: 'first-three-deposits', label: 'First 3 Deposits', kind: 'first-three-deposits', title: firstThreeDeposits.title },
  { id: 'royal-arrival', label: royalArrival.title, kind: 'royal-arrival', title: royalArrival.title },
]

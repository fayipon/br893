import home from './home.json'

const rupee = amount => `₹${Number(amount.replace(/[^\d]/g, '')).toLocaleString('en-IN')}`

export const ipaData = {
  ...home,
  activities: home.activities.map(item => item.amount ? { ...item, amount: rupee(item.amount) } : item),
  banners: [
    {
      title: 'Deposit rewards',
      alt: 'Deposit more, earn crazier! claim your ultimate prize',
      variant: 'jito-deposit',
      image: 'assets/ipa/hero-deposit-teal-v5.png',
      motion: {
        backgroundImage: 'assets/ipa/hero-deposit-motion-textless-v1.png',
        letteringImage: 'assets/ipa/hero-deposit-motion-lettering-v1.png',
        spritesImage: 'assets/ipa/hero-deposit-motion-sprites-v1.png',
      },
    },
    {
      title: 'Daily Deposit Bonus',
      alt: 'Every day — Daily Deposit Bonus. A new day. A new bonus.',
      variant: 'jito-daily',
      image: 'assets/ipa/hero-daily-deposit-v3.png',
      motion: {
        backgroundImage: 'assets/ipa/hero-daily-deposit-textless-v1.png',
        letteringImage: 'assets/ipa/hero-daily-deposit-lettering-v1.png',
        letteringTransform: 'translate(0 0)',
        sloganOrigin: '550px 380px',
        halo: false,
        textLayers: [
          { id: 'eyebrow', x: 0, y: 0, width: 1120, height: 155 },
          { id: 'slogan', x: 0, y: 155, width: 1120, height: 440 },
          { id: 'caption', x: 0, y: 595, width: 1120, height: 100 },
        ],
      },
    },
    {
      title: 'First Deposit 37% Bonus',
      alt: 'First deposit — 37% bonus. Start with more.',
      variant: 'jito-first',
      image: 'assets/ipa/hero-first-deposit-v4.png',
      motion: {
        backgroundImage: 'assets/ipa/hero-first-deposit-background-v1.png',
        letteringImage: 'assets/ipa/hero-first-deposit-lettering-v1.png',
        foregroundImage: 'assets/ipa/hero-first-deposit-car-v1.png',
        letteringTransform: 'translate(8 9) scale(.92 .96)',
        sloganOrigin: '530px 390px',
        sloganDelay: '.1s',
        captionDelay: '.7s',
        halo: false,
        textLayers: [
          { id: 'eyebrow', x: 0, y: 0, width: 1180, height: 155 },
          { id: 'slogan', x: 0, y: 155, width: 1180, height: 495 },
          { id: 'caption', x: 0, y: 650, width: 1180, height: 143 },
        ],
      },
    },
    {
      title: 'IPL Cricket Cashback',
      alt: 'IPL cricket — up to 50% cashback.',
      variant: 'jito-cricket',
      image: 'assets/ipa/hero-cricket-cashback-v5.png',
      motion: {
        backgroundImage: 'assets/ipa/hero-cricket-background-v1.png',
        letteringImage: 'assets/ipa/hero-cricket-amount-v1.png',
        letteringTransform: 'translate(96 64) scale(.8)',
        sloganOrigin: '580px 410px',
        sloganDelay: '.72s',
        shineDelay: '.4s',
        halo: false,
        textLayers: [{ id: 'slogan', x: 0, y: 0, width: 1983, height: 793 }],
        players: [
          { id: 'left', image: 'assets/ipa/hero-cricket-iyer-v1.png', delay: '.05s', x: '-90px', origin: '1000px 740px' },
          { id: 'right', image: 'assets/ipa/hero-cricket-bumrah-v1.png', delay: '.14s', x: '90px', origin: '1780px 740px' },
          { id: 'center', image: 'assets/ipa/hero-cricket-pant-v1.png', delay: '.65s', x: '0px', origin: '1370px 740px' },
        ],
      },
    },
    {
      title: 'Lucky Wheel',
      alt: 'Lucky Wheel — Spin & Win.',
      variant: 'jito-lucky-wheel',
      image: 'assets/ipa/hero-lucky-wheel-v1.png',
      motion: {
        backgroundImage: 'assets/ipa/hero-lucky-wheel-background-v1.png',
        letteringImage: 'assets/ipa/hero-lucky-wheel-lettering-v1.png',
        letteringTransform: 'translate(-20 62) scale(.73)',
        sloganOrigin: '820px 600px',
        sloganDelay: '.03s',
        shineDelay: '.8s',
        halo: false,
        textLayers: [{ id: 'slogan', x: 0, y: 0, width: 1480, height: 793 }],
        wheel: {
          image: 'assets/ipa/hero-lucky-wheel-disc-v1.png',
          projection: 'matrix(.558 -.032 0 .551 1474 397)',
          duration: '12s',
        },
      },
    },
  ],
  promotions: [
    { title: 'Daily Check-in', alt: 'Daily Check-in — 7 Days.', image: 'assets/ipa/promo-daily-checkin-v2.png' },
    { title: 'VIP Club', alt: 'VIP Club — ₹120,000.', image: 'assets/ipa/promo-vip-club-v2.png' },
    { title: 'Cricket Cashback', alt: 'Cricket — 50% Cashback.', image: 'assets/ipa/promo-cricket-cashback-v2.png' },
  ],
  welcomePromotion: {
    title: 'Lucky Wheel popup',
    alt: 'Lucky Wheel — Min ₹100, up to ₹5,000.',
    variant: 'jito-lucky-wheel-popup',
    image: 'assets/ipa/popup-lucky-wheel-v2.png',
    rewards: {
      min: 'assets/ipa/popup-lucky-wheel-min-100-v1.png',
      max: 'assets/ipa/popup-lucky-wheel-max-5000-v1.png',
    },
    motion: {
      backgroundImage: 'assets/ipa/popup-lucky-wheel-background-v1.png',
      letteringImage: 'assets/ipa/popup-lucky-wheel-lettering-v1.png',
      wheelImage: 'assets/ipa/hero-lucky-wheel-disc-v1.png',
    },
  },
}

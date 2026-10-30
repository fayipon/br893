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
  ],
  promotions: [
    { title: 'Mystery Mine', alt: 'Mystery Mine — Up to ₹8,888.', image: 'assets/ipa/promo-mystery-mine-inr-v1.png' },
    { title: 'Invite a friend', alt: 'Invite one friend and get ₹80.', image: 'assets/ipa/promo-invite-friend-inr-v1.png' },
    { title: 'Friend assistance', alt: 'Friend assistance — Get ₹100.', image: 'assets/ipa/promo-friend-assist-inr-v1.png' },
  ],
}

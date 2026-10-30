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
    ...home.banners.filter(banner => banner.variant === 'referral').map(banner => ({
      ...banner,
      title: 'Referral commission',
      alt: 'Refer and earn 5% commission — Up to ₹10,00,000 per month.',
      image: 'assets/ipa/hero-referral-inr-v1.png',
      lettering: banner.lettering.map(layer => layer.id === 'caption' ? { ...layer, image: 'assets/ipa/hero-referral-caption-inr-v1.png' } : layer),
    })),
  ],
  promotions: [
    { title: 'Mystery Mine', alt: 'Mystery Mine — Up to ₹8,888.', image: 'assets/ipa/promo-mystery-mine-inr-v1.png' },
    { title: 'Invite a friend', alt: 'Invite one friend and get ₹80.', image: 'assets/ipa/promo-invite-friend-inr-v1.png' },
    { title: 'Friend assistance', alt: 'Friend assistance — Get ₹100.', image: 'assets/ipa/promo-friend-assist-inr-v1.png' },
  ],
}

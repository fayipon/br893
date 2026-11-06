// All layers share the original 1882 × 836 artboard. Clip before animating so
// the lettering keeps its painted texture, outlines, and final registration.
export const motionCampaigns = {
  weekly: {
    label: 'Weekly Cashback',
    alt: 'Weekly Cashback — 10% back on eligible weekly net losses from Slot games',
    artwork: 'weekly-cashback-v4-rooster.png',
    characterPart: 'rooster',
    amountOrigin: '445px 552px',
    textGroups: [
      { id: 'slogan', kind: 'slogan', path: 'M0 0H1882V329H0Z', delay: '.08s' },
      { id: 'amount', kind: 'amount', path: 'M0 329H1882V836H0Z', delay: '.56s' },
    ],
  },
  payday: {
    label: 'Payday',
    alt: 'Payday — up to ₱5,000 in tier rewards',
    artwork: 'payday-v2-rooster.png',
    characterPart: 'rooster',
    amountOrigin: '475px 570px',
    textGroups: [
      { id: 'slogan', kind: 'slogan', path: 'M0 0H1882V333H0Z', delay: '.08s' },
      // UP TO and the tops of the digits share a few rows; this stepped edge
      // keeps each complete glyph in its own entrance animation.
      { id: 'qualifier', kind: 'slogan', path: 'M0 333H1882V396H310V404H0Z', delay: '.32s' },
      { id: 'amount', kind: 'amount', path: 'M0 404H310V396H1882V836H0Z', delay: '.56s' },
    ],
  },
  deposits: {
    label: 'First 3 Deposits',
    alt: 'First 3 Deposits — total bonus up to ₱17,000',
    artwork: 'first-three-deposits-v2-rooster.png',
    characterPart: 'rooster',
    amountOrigin: '490px 628px',
    textGroups: [
      { id: 'slogan', kind: 'slogan', path: 'M0 0H1882V396H0Z', delay: '.08s' },
      { id: 'qualifier', kind: 'slogan', path: 'M0 396H1882V462H0Z', delay: '.38s' },
      { id: 'amount', kind: 'amount', path: 'M0 462H1882V836H0Z', delay: '.62s' },
    ],
  },
  carnival: {
    label: 'New Player Carnival',
    alt: 'New Player Carnival — approximately ₱16,000 in total rewards',
    artwork: 'new-player-carnival-v1.png',
    characterPart: 'character',
    amountOrigin: '440px 643px',
    textGroups: [
      // Diagonal boundaries follow the slanted lettering without slicing glyphs.
      { id: 'slogan', kind: 'slogan', path: 'M0 0H1882V303L0 410Z', delay: '.08s' },
      { id: 'qualifier', kind: 'slogan', path: 'M0 410L1882 303V448L0 550Z', delay: '.36s' },
      { id: 'amount', kind: 'amount', path: 'M0 550L1882 448V836H0Z', delay: '.62s' },
    ],
  },
}

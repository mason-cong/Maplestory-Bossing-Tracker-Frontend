import easyBanner from '../assets/difficulty/easy-banner.png';
import normalBanner from '../assets/difficulty/normal-banner.png';
import hardBanner from '../assets/difficulty/hard-banner.png';
import chaosBanner from '../assets/difficulty/chaos-banner.png';
import extremeBanner from '../assets/difficulty/extreme-banner.png';

export const difficultyBanners = {
    "EASY": easyBanner,
    "NORMAL": normalBanner,
    "HARD": hardBanner,
    "CHAOS": chaosBanner,
    "EXTREME": extremeBanner,
};

export const getDifficultyBanner = (difficulty) => {
    return difficultyBanners[difficulty?.toUpperCase()] || null;
};
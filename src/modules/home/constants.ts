import heroAvatar from './assets/hero-avatar-320.webp'
import heroAvatarLarge from './assets/hero-avatar-480.webp'

const heroAvatarSrcSet = `${heroAvatar} 320w, ${heroAvatarLarge} 480w`

export const heroImages = [
  {
    animate: { rotate: -8, translateX: -16 },
    id: 1,
    src: heroAvatar,
    srcSet: heroAvatarSrcSet,
  },
  {
    animate: { rotate: -0, translateX: 0 },
    id: 2,
    src: heroAvatar,
    srcSet: heroAvatarSrcSet,
  },
  {
    animate: { rotate: 8, translateX: 16 },
    id: 3,
    src: heroAvatar,
    srcSet: heroAvatarSrcSet,
  },
]

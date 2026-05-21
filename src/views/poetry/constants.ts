import fairMaidenImageSmall from './assets/images/bg-fair-maiden-800.webp'
import fairMaidenImage from './assets/images/bg-fair-maiden-1200.webp'
import literatiImageSmall from './assets/images/bg-literati-800.webp'
import literatiImage from './assets/images/bg-literati-1200.webp'
import magnificentLandImageSmall from './assets/images/bg-magnificent-land-800.webp'
import magnificentLandImage from './assets/images/bg-magnificent-land-1200.webp'
import mortalWorldImageSmall from './assets/images/bg-mortal-world-800.webp'
import mortalWorldImage from './assets/images/bg-mortal-world-1200.webp'
import type { PoetryCategory } from './type'

export const POETRY_CATEGORIES = [
  {
    slug: 'magnificent-land',
    title: '\u5c71\u6cb3',
    subtitle: 'Magnificent Land',
    image: magnificentLandImage,
    imageSrcSet: `${magnificentLandImageSmall} 800w, ${magnificentLandImage} 1200w`,
    alt: 'Magnificent Land category cover',
    order: 1,
  },
  {
    slug: 'fair-maiden',
    title: '\u79c0\u8272',
    subtitle: 'Fair Maiden',
    image: fairMaidenImage,
    imageSrcSet: `${fairMaidenImageSmall} 800w, ${fairMaidenImage} 1200w`,
    alt: 'Fair Maiden category cover',
    order: 2,
  },
  {
    slug: 'literati',
    title: '\u541b\u751f',
    subtitle: 'Literati',
    image: literatiImage,
    imageSrcSet: `${literatiImageSmall} 800w, ${literatiImage} 1200w`,
    alt: 'Literati category cover',
    order: 3,
  },
  {
    slug: 'mortal-world',
    title: '\u4eba\u95f4',
    subtitle: 'Mortal World',
    image: mortalWorldImage,
    imageSrcSet: `${mortalWorldImageSmall} 800w, ${mortalWorldImage} 1200w`,
    alt: 'Mortal World category cover',
    order: 4,
  },
] satisfies PoetryCategory[]

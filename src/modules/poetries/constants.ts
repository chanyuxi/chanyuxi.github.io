import type { PoetryCatalog } from './type'

import fairMaidenImage from './assets/images/bg-fair-maiden-1200.webp'
import fairMaidenImageSmall from './assets/images/bg-fair-maiden-800.webp'
import literatiImage from './assets/images/bg-literati-1200.webp'
import literatiImageSmall from './assets/images/bg-literati-800.webp'
import magnificentLandImage from './assets/images/bg-magnificent-land-1200.webp'
import magnificentLandImageSmall from './assets/images/bg-magnificent-land-800.webp'
import mortalWorldImage from './assets/images/bg-mortal-world-1200.webp'
import mortalWorldImageSmall from './assets/images/bg-mortal-world-800.webp'

export const POETRY_CATEGORIES = [
  {
    alt: 'Magnificent Land catalog cover',
    image: magnificentLandImage,
    imageSrcSet: `${magnificentLandImageSmall} 800w, ${magnificentLandImage} 1200w`,
    order: 1,
    slug: 'magnificent-land',
    subtitle: 'Magnificent Land',
    title: '山河',
  },
  {
    alt: 'Fair Maiden catalog cover',
    image: fairMaidenImage,
    imageSrcSet: `${fairMaidenImageSmall} 800w, ${fairMaidenImage} 1200w`,
    order: 2,
    slug: 'fair-maiden',
    subtitle: 'Fair Maiden',
    title: '秀色',
  },
  {
    alt: 'Literati catalog cover',
    image: literatiImage,
    imageSrcSet: `${literatiImageSmall} 800w, ${literatiImage} 1200w`,
    order: 3,
    slug: 'literati',
    subtitle: 'Literati',
    title: '君生',
  },
  {
    alt: 'Mortal World catalog cover',
    image: mortalWorldImage,
    imageSrcSet: `${mortalWorldImageSmall} 800w, ${mortalWorldImage} 1200w`,
    order: 4,
    slug: 'mortal-world',
    subtitle: 'Mortal World',
    title: '人间',
  },
] satisfies PoetryCatalog[]

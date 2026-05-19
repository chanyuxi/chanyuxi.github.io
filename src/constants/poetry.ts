// TODO: 非全局常量，移动到 views/poetry/constants.ts 领域内
import type { PoetryCategory } from '@/types'
import fairMaidenImageSmall from '@/views/poetry/assets/images/bg-fair-maiden-800.webp'
import fairMaidenImage from '@/views/poetry/assets/images/bg-fair-maiden-1200.webp'
import literatiImageSmall from '@/views/poetry/assets/images/bg-literati-800.webp'
import literatiImage from '@/views/poetry/assets/images/bg-literati-1200.webp'
import magnificentLandImageSmall from '@/views/poetry/assets/images/bg-magnificent-land-800.webp'
import magnificentLandImage from '@/views/poetry/assets/images/bg-magnificent-land-1200.webp'
import mortalWorldImageSmall from '@/views/poetry/assets/images/bg-mortal-world-800.webp'
import mortalWorldImage from '@/views/poetry/assets/images/bg-mortal-world-1200.webp'

export const POETRY_CATEGORIES = [
  {
    slug: 'magnificent-land',
    title: '山河',
    subtitle: 'Magnificent Land',
    image: magnificentLandImage,
    imageSrcSet: `${magnificentLandImageSmall} 800w, ${magnificentLandImage} 1200w`,
    alt: 'Magnificent Land category cover',
    order: 1,
  },
  {
    slug: 'fair-maiden',
    title: '秀色',
    subtitle: 'Fair Maiden',
    image: fairMaidenImage,
    imageSrcSet: `${fairMaidenImageSmall} 800w, ${fairMaidenImage} 1200w`,
    alt: 'Fair Maiden category cover',
    order: 2,
  },
  {
    slug: 'literati',
    title: '君生',
    subtitle: 'Literati',
    image: literatiImage,
    imageSrcSet: `${literatiImageSmall} 800w, ${literatiImage} 1200w`,
    alt: 'Literati category cover',
    order: 3,
  },
  {
    slug: 'mortal-world',
    title: '人间',
    subtitle: 'Mortal World',
    image: mortalWorldImage,
    imageSrcSet: `${mortalWorldImageSmall} 800w, ${mortalWorldImage} 1200w`,
    alt: 'Mortal World category cover',
    order: 4,
  },
] satisfies PoetryCategory[]

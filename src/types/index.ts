export interface PoetryCategory {
  slug: string
  title: string
  subtitle: string
  image: string
  imageSrcSet: string
  alt: string
  order: number
}

export interface PoetryFrontmatter {
  title?: string
  subtitle?: string
  description?: string
  date?: string
  tags?: string[]
  order?: number
  draft?: boolean
}

export interface PoetryPost {
  id: string
  slug: string
  category: string
  title: string
  subtitle?: string
  description?: string
  date?: string
  tags: string[]
  order: number
  content: string
  routePath: string
}

export interface PoetryCategoryWithPosts extends PoetryCategory {
  posts: PoetryPost[]
}

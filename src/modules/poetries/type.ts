export interface PoetryCatalog {
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
  description?: string
  order?: number
  draft?: boolean
}

export interface PoetryPost {
  id: string
  slug: string
  catalog: string
  title: string
  description: string | null
  order: number
  content: string
  routePath: string
}

export interface PoetryCatalogWithPosts extends PoetryCatalog {
  posts: PoetryPost[]
}

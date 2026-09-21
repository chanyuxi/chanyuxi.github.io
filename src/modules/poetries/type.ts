export interface PoetryCatalog {
  alt: string
  image: string
  imageSrcSet: string
  order: number
  slug: string
  subtitle: string
  title: string
}

export interface PoetryCatalogWithPosts extends PoetryCatalog {
  posts: PoetryPost[]
}

export interface PoetryFrontmatter {
  description?: string
  draft?: boolean
  order?: number
  title?: string
}

export interface PoetryPost {
  catalog: string
  content: string
  description: null | string
  id: string
  order: number
  routePath: string
  slug: string
  title: string
}

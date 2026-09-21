import type {
  PoetryCatalogWithPosts,
  PoetryFrontmatter,
  PoetryPost,
} from './type'

import { POETRY_CATEGORIES } from './constants'

type PoetryMarkdownModule = {
  content: string
  frontmatter: PoetryFrontmatter
}

// Eagerly load every poem so the catalog is fully resolved at module init.
const rawPosts = import.meta.glob<PoetryMarkdownModule>(
  './assets/mds/**/*.md',
  { eager: true, import: 'default' },
)

const catalogOrderMap = new Map(
  POETRY_CATEGORIES.map(catalog => [catalog.slug, catalog.order]),
)

export const poetryPosts: PoetryPost[] = Object.entries(rawPosts)
  .map(([path, module]) => createPost(path, module))
  .filter((post): post is PoetryPost => post !== null)
  .sort(comparePosts)

export const poetryCategories = POETRY_CATEGORIES.map(catalog => ({
  ...catalog,
  posts: poetryPosts.filter(post => post.catalog === catalog.slug),
})).sort((a, b) => a.order - b.order) satisfies PoetryCatalogWithPosts[]

export function getPoetryCatalog(catalog: string) {
  return poetryCategories.find(item => item.slug === catalog)
}

export function getPoetryPost(catalog: string, slug: string) {
  return poetryPosts.find(
    post => post.catalog === catalog && post.slug === slug,
  )
}

// Sort by catalog order, then per-post order, then title.
function comparePosts(a: PoetryPost, b: PoetryPost) {
  const aOrder = catalogOrderMap.get(a.catalog) ?? Number.MAX_SAFE_INTEGER
  const bOrder = catalogOrderMap.get(b.catalog) ?? Number.MAX_SAFE_INTEGER

  return aOrder - bOrder || a.order - b.order || a.title.localeCompare(b.title)
}

function createPost(
  path: string,
  { content, frontmatter }: PoetryMarkdownModule,
): null | PoetryPost {
  if (frontmatter.draft) {
    return null
  }

  const { catalog, slug } = parsePath(path)

  return {
    catalog,
    content,
    description: frontmatter.description ?? null,
    id: `${catalog}/${slug}`,
    order: frontmatter.order ?? 0,
    routePath: `/poetries/${catalog}/${slug}`,
    slug,
    title: frontmatter.title ?? extractHeading(content) ?? humanizeSlug(slug),
  }
}

// Fallback title: first H1 in the markdown body.
function extractHeading(content: string) {
  return content.match(/^#\s+(.+)$/m)?.[1]?.trim()
}

// Last-resort title: "fair-maiden_intro" -> "Fair Maiden Intro".
function humanizeSlug(slug: string) {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

function parsePath(path: string) {
  const match = path.match(/\/([^/]+)\/([^/]+)\.md$/)

  if (!match) {
    throw new Error(`Invalid poetry markdown path: ${path}`)
  }

  return { catalog: match[1], slug: match[2] }
}

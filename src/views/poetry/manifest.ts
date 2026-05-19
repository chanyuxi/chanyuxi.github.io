import { POETRY_CATEGORIES } from '@/constants/poetry'
import type {
  PoetryCategoryWithPosts,
  PoetryFrontmatter,
  PoetryPost,
} from '@/types'

type PoetryPostRecord = PoetryPost & {
  categoryOrder: number
  frontmatter: PoetryFrontmatter
}

type PoetryMarkdownModule = {
  frontmatter: PoetryFrontmatter
  content: string
}

const rawPosts = import.meta.glob<PoetryMarkdownModule>(
  './assets/mds/**/*.md',
  {
    eager: true,
    import: 'default',
  }
)

const categoryMap = new Map(
  POETRY_CATEGORIES.map(category => [category.slug, category])
)

const poetryPostRecords = Object.entries(rawPosts)
  .map(([path, module]) => createPost(path, module))
  .filter(post => !post.frontmatter.draft)
  .sort(sortPosts)

export const poetryPosts = poetryPostRecords.map(toPoetryPost)

export const poetryCategories = POETRY_CATEGORIES.map(category => ({
  ...category,
  posts: poetryPosts.filter(post => post.category === category.slug),
})).sort((a, b) => a.order - b.order) satisfies PoetryCategoryWithPosts[]

export function getPoetryCategory(category: string) {
  return poetryCategories.find(item => item.slug === category)
}

export function getPoetryPost(category: string, slug: string) {
  return poetryPosts.find(
    post => post.category === category && post.slug === slug
  )
}

function createPost(
  path: string,
  { frontmatter, content }: PoetryMarkdownModule
) {
  const { category, slug } = parsePath(path)
  const categoryConfig = categoryMap.get(category)

  return {
    id: `${category}/${slug}`,
    slug,
    category,
    title: frontmatter.title ?? getHeadingTitle(content) ?? formatSlug(slug),
    subtitle: frontmatter.subtitle,
    description: frontmatter.description,
    date: frontmatter.date,
    tags: frontmatter.tags ?? [],
    order: frontmatter.order ?? 0,
    content,
    routePath: `/poetry/${category}/${slug}`,
    frontmatter,
    categoryOrder: categoryConfig?.order ?? Number.MAX_SAFE_INTEGER,
  } satisfies PoetryPostRecord
}

function parsePath(path: string) {
  const match = path.match(/\.\/assets\/mds\/([^/]+)\/([^/]+)\.md$/)

  if (!match) {
    throw new Error(`Invalid poetry markdown path: ${path}`)
  }

  const [, category, slug] = match

  return { category, slug }
}

function getHeadingTitle(content: string) {
  return content.match(/^#\s+(.+)$/m)?.[1]?.trim()
}

function formatSlug(slug: string) {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

function sortPosts(a: PoetryPostRecord, b: PoetryPostRecord) {
  const categoryOrder = a.categoryOrder - b.categoryOrder

  if (categoryOrder !== 0) {
    return categoryOrder
  }

  if (a.order !== b.order) {
    return a.order - b.order
  }

  return a.title.localeCompare(b.title)
}

function toPoetryPost(post: PoetryPostRecord): PoetryPost {
  return {
    id: post.id,
    slug: post.slug,
    category: post.category,
    title: post.title,
    subtitle: post.subtitle,
    description: post.description,
    date: post.date,
    tags: post.tags,
    order: post.order,
    content: post.content,
    routePath: post.routePath,
  }
}

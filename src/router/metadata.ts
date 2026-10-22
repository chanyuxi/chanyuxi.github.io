import type { PageMetadata } from './components/route-metadata'

export const routeMetadata = {
  ai: {
    description: 'Start a focused AI conversation and follow your curiosity.',
    title: 'AI Chat | CHANYUXI',
  },
  auth: {
    description: 'Sign in or create an account to access your CHANYUXI profile.',
    title: 'Sign In | CHANYUXI',
  },
  changelog: {
    description: 'Follow the latest releases and changes to the CHANYUXI personal site.',
    title: 'Changelog | CHANYUXI',
  },
  home: {
    description: 'Hello, my name is Chanyuxi. Nice to meet you.',
    title: 'CHANYUXI - Welcome to my blog',
  },
  introduction: {
    description: 'Meet Yongzheng Chen and explore his frontend experience, skills, and work.',
    title: 'Introduction | CHANYUXI',
  },
  myPosts: {
    description: 'Manage your drafts and published posts on CHANYUXI.',
    hideFooter: true,
    title: 'My Posts | CHANYUXI',
  },
  notFound: {
    description: 'The requested CHANYUXI page could not be found.',
    title: 'Page Not Found | CHANYUXI',
  },
  poetries: {
    description: 'Read original Chinese poetry collected by theme on CHANYUXI.',
    title: 'Poetries | CHANYUXI',
  },
  postEditor: {
    description: 'Write, preview, and publish a post on CHANYUXI.',
    title: 'Post Editor | CHANYUXI',
  },
  posts: {
    description: 'Read notes, essays, and stories published on CHANYUXI.',
    hideFooter: true,
    title: 'Posts | CHANYUXI',
  },
  profile: {
    description: 'View your CHANYUXI account profile and activity.',
    hideFooter: true,
    title: 'Profile | CHANYUXI',
  },
  profileSetup: {
    description: 'Add your photo and a short bio to finish setting up CHANYUXI.',
    title: 'Profile Setup | CHANYUXI',
  },
  underDevelopment: {
    description: 'This part of CHANYUXI is still being prepared.',
    title: 'Under Development | CHANYUXI',
  },
} satisfies Record<string, PageMetadata>

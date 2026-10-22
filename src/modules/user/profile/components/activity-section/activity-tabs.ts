import Bookmark from '~icons/lucide/bookmark'
import FileText from '~icons/lucide/file-text'
import MessageCircle from '~icons/lucide/message-circle'

export const activityTabs = [
  {
    description: 'Published posts will appear here.',
    icon: FileText,
    id: 'posts',
    label: 'Posts',
  },
  {
    description: 'Comments you leave will appear here.',
    icon: MessageCircle,
    id: 'comments',
    label: 'Comments',
  },
  {
    description: 'Saved items will appear here.',
    icon: Bookmark,
    id: 'collections',
    label: 'Collections',
  },
] as const

export type ActivityTab = (typeof activityTabs)[number]['id']

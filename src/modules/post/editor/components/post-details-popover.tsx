import type { PostStatus } from '@shared/constants/posts'

import {
  MAX_POST_DESCRIPTION_LENGTH,
  POST_SLUG_MAX_LENGTH,
} from '@shared/constants/posts'
import Eye from '~icons/lucide/eye'
import Settings2 from '~icons/lucide/settings-2'
import Trash2 from '~icons/lucide/trash-2'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'

interface PostDetailsPopoverProps {
  description: string
  isNew: boolean
  onDescriptionChange: (value: string) => void
  onOpenChange: (open: boolean) => void
  onRequestDelete: () => void
  onSlugChange: (value: string) => void
  onTagsChange: (value: string) => void
  open: boolean
  slug: string
  status: PostStatus
  tags: string
}

/** The slug / tags / description form, plus view and delete shortcuts. */
export function PostDetailsPopover({
  description,
  isNew,
  onDescriptionChange,
  onOpenChange,
  onRequestDelete,
  onSlugChange,
  onTagsChange,
  open,
  slug,
  status,
  tags,
}: PostDetailsPopoverProps) {
  return (
    <Popover onOpenChange={onOpenChange} open={open}>
      <PopoverTrigger
        render={(
          <Button
            aria-label="Edit post details"
            size="icon"
            title="Edit post details"
            variant="ghost"
          />
        )}
      >
        <Settings2 className="size-4" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[min(28rem,calc(100vw-2rem))] gap-4 p-4"
        side="left"
        sideOffset={12}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="text-xs font-medium tracking-label text-muted-foreground uppercase">
              Slug
            </span>
            <Input
              aria-label="Post slug"
              autoComplete="off"
              maxLength={POST_SLUG_MAX_LENGTH}
              onChange={event => onSlugChange(event.target.value)}
              placeholder="my-post"
              value={slug}
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-xs font-medium tracking-label text-muted-foreground uppercase">
              Tags
            </span>
            <Input
              aria-label="Post tags"
              autoComplete="off"
              onChange={event => onTagsChange(event.target.value)}
              placeholder="Separate with commas"
              value={tags}
            />
          </label>

          <label className="grid gap-1.5 sm:col-span-2">
            <span className="flex items-baseline justify-between text-xs font-medium tracking-label text-muted-foreground uppercase">
              Description
              <span className="text-muted-soft">
                {`${description.length}/${MAX_POST_DESCRIPTION_LENGTH}`}
              </span>
            </span>
            <Textarea
              aria-label="Post description"
              className="min-h-20"
              maxLength={MAX_POST_DESCRIPTION_LENGTH}
              onChange={event => onDescriptionChange(event.target.value)}
              placeholder="A short description for the list and search engines."
              value={description}
            />
          </label>
        </div>

        {(status === 'published' && slug) || !isNew
          ? (
              <div className="flex justify-end gap-1 pt-1">
                {status === 'published' && slug
                  ? (
                      <Button
                        aria-label="View published post"
                        render={<Link to={`/post/${slug}`} />}
                        size="icon-sm"
                        title="View published post"
                        variant="ghost"
                      >
                        <Eye className="size-4" />
                      </Button>
                    )
                  : null}
                {!isNew
                  ? (
                      <Button
                        aria-label="Delete post"
                        onClick={onRequestDelete}
                        size="icon-sm"
                        title="Delete post"
                        variant="ghost"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )
                  : null}
              </div>
            )
          : null}
      </PopoverContent>
    </Popover>
  )
}

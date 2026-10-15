import Camera from '~icons/lucide/camera'
import ImagePlus from '~icons/lucide/image-plus'
import RotateCcw from '~icons/lucide/rotate-ccw'
import RotateCw from '~icons/lucide/rotate-cw'
import Trash2 from '~icons/lucide/trash-2'
import { useRef } from 'react'
import AvatarEditor, { type AvatarEditorRef } from 'react-avatar-editor'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useAuth } from '@/contexts/auth'
import { toast } from '@/libs/toast'

import {
  AVATAR_EDITOR_BORDER,
  AVATAR_EDITOR_SIZE,
  AVATAR_MAX_SCALE,
  AVATAR_MIN_SCALE,
  AVATAR_SOURCE_MIME_TYPES,
  MAX_AVATAR_SOURCE_BYTES,
} from '../constants'

interface AvatarFieldProps {
  editorRef: React.RefObject<AvatarEditorRef | null>
  image: null | string
  onImageChange: (image: null | string) => void
  onRotateChange: (rotate: number) => void
  onScaleChange: (scale: number) => void
  rotate: number
  scale: number
}

export function AvatarField({
  editorRef,
  image,
  onImageChange,
  onRotateChange,
  onScaleChange,
  rotate,
  scale,
}: AvatarFieldProps) {
  const { user } = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)

  const displayName = user?.name.trim() || user?.email || ''
  const initials = displayName.charAt(0).toUpperCase()

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]

    // Reset so picking the same file again re-triggers the change event.
    event.currentTarget.value = ''

    if (!file) {
      return
    }

    if (!AVATAR_SOURCE_MIME_TYPES.includes(file.type as typeof AVATAR_SOURCE_MIME_TYPES[number])) {
      toast('Please choose a JPEG, PNG, or WebP image.', { immediately: true })

      return
    }

    if (file.size > MAX_AVATAR_SOURCE_BYTES) {
      toast('That image is larger than 8 MB. Please choose a smaller one.', { immediately: true })

      return
    }

    onImageChange(URL.createObjectURL(file))
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {image
        ? (
            <AvatarEditor
              border={AVATAR_EDITOR_BORDER}
              borderColor={[255, 255, 255, 0.7]}
              borderRadius={AVATAR_EDITOR_SIZE / 2}
              color={[28, 25, 23, 0.6]}
              height={AVATAR_EDITOR_SIZE}
              image={image}
              onLoadFailure={() => {
                onImageChange(null)
                toast('Unable to load that image. Please try another one.', { immediately: true })
              }}
              ref={editorRef}
              rotate={rotate}
              scale={scale}
              width={AVATAR_EDITOR_SIZE}
            />
          )
        : (
            <Avatar size="xl">
              <AvatarFallback className="bg-secondary/70 text-3xl font-medium text-secondary-foreground backdrop-blur-md dark:bg-secondary/50">
                {initials || '?'}
              </AvatarFallback>
            </Avatar>
          )}

      <input
        accept={AVATAR_SOURCE_MIME_TYPES.join(',')}
        aria-label="Upload a profile photo"
        className="sr-only"
        id="avatar-source"
        onChange={handleFileChange}
        ref={inputRef}
        type="file"
      />

      {image
        ? (
            <div className="flex w-full flex-col items-center gap-4">
              <div className="flex w-48 items-center gap-3">
                <Slider
                  aria-label="Zoom level"
                  max={AVATAR_MAX_SCALE}
                  min={AVATAR_MIN_SCALE}
                  onValueChange={onScaleChange}
                  step={0.01}
                  value={scale}
                />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  onClick={() => inputRef.current?.click()}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <ImagePlus aria-hidden="true" data-icon="inline-start" />
                  Replace
                </Button>
                <Button
                  aria-label="Rotate left"
                  onClick={() => onRotateChange(rotate - 90)}
                  size="icon-sm"
                  type="button"
                  variant="outline"
                >
                  <RotateCcw aria-hidden="true" />
                </Button>
                <Button
                  aria-label="Rotate right"
                  onClick={() => onRotateChange(rotate + 90)}
                  size="icon-sm"
                  type="button"
                  variant="outline"
                >
                  <RotateCw aria-hidden="true" />
                </Button>
                <Button
                  aria-label="Remove photo"
                  onClick={() => onImageChange(null)}
                  size="icon-sm"
                  type="button"
                  variant="destructive"
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
            </div>
          )
        : (
            <Button
              onClick={() => inputRef.current?.click()}
              type="button"
              variant="outline"
            >
              <Camera aria-hidden="true" data-icon="inline-start" />
              Upload a photo
            </Button>
          )}
    </div>
  )
}

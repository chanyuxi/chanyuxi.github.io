import { zodResolver } from '@hookform/resolvers/zod'
import { MAX_PROFILE_BIO_LENGTH } from '@shared/constants/user-profiles'
import { useEffect, useState } from 'react'
import { useAvatarEditor } from 'react-avatar-editor'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { useCompleteProfileSetupMutation } from '@/services/auth/mutations'

import {
  AVATAR_EXPORT_QUALITY,
  AVATAR_MAX_SCALE,
  AVATAR_MIN_SCALE,
} from '../constants'
import { bioFormSchema, type BioFormValues } from '../schema'

import { AvatarField } from './avatar-field'

// Browsers that cannot encode WebP fall back to PNG transparently.
const EXPORT_MIME_TYPE = document.createElement('canvas')
  .toDataURL('image/webp')
  .startsWith('data:image/webp')
  ? 'image/webp'
  : 'image/png'

interface SetupFormProps {
  returnTo: string
}

export function SetupForm({ returnTo }: SetupFormProps) {
  const editor = useAvatarEditor()
  const navigate = useNavigate()
  const mutation = useCompleteProfileSetupMutation()
  const [image, setImage] = useState<null | string>(null)
  const [rotate, setRotate] = useState(0)
  const [scale, setScale] = useState(1)

  const {
    clearErrors,
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<BioFormValues>({
    defaultValues: { bio: '' },
    mode: 'onBlur',
    resolver: zodResolver(bioFormSchema),
  })

  // Revoke the previous object URL whenever the source image is replaced
  // or unmounted.
  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image)
      }
    }
  }, [image])

  function handleImageChange(nextImage: null | string) {
    setImage(nextImage)
    setRotate(0)
    setScale(1)
  }

  function handleScaleChange(nextScale: number) {
    setScale(Math.min(AVATAR_MAX_SCALE, Math.max(AVATAR_MIN_SCALE, nextScale)))
  }

  function handleRotateChange(nextRotate: number) {
    setRotate(((nextRotate % 360) + 360) % 360)
  }

  function onSubmit(values: BioFormValues) {
    clearErrors('root.server')

    const avatar = image
      ? editor.getImageScaledToCanvas()?.toDataURL(EXPORT_MIME_TYPE, AVATAR_EXPORT_QUALITY)
      : undefined

    mutation.mutate({ avatar, bio: values.bio }, {
      onError: (error) => {
        setError('root.server', {
          message: error instanceof Error && error.message
            ? error.message
            : 'Unable to save your profile. Please try again.',
        })
      },
      onSuccess: () => {
        navigate(returnTo, { replace: true })
      },
    })
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-8">
        <AvatarField
          editorRef={editor.ref}
          image={image}
          onImageChange={handleImageChange}
          onRotateChange={handleRotateChange}
          onScaleChange={handleScaleChange}
          rotate={rotate}
          scale={scale}
        />

        <FieldGroup>
          <Field data-invalid={Boolean(errors.bio)}>
            <FieldLabel htmlFor="setup-bio">Bio</FieldLabel>
            <Textarea
              {...register('bio')}
              aria-describedby={errors.bio ? 'setup-bio-error' : 'setup-bio-hint'}
              aria-invalid={Boolean(errors.bio)}
              disabled={mutation.isPending}
              id="setup-bio"
              maxLength={MAX_PROFILE_BIO_LENGTH}
              placeholder="Introduce yourself in a few sentences…"
              rows={4}
            />
            <FieldDescription id="setup-bio-hint">
              Share a few sentences about yourself. You can update this later
              from your profile.
            </FieldDescription>
            <FieldError errors={[errors.bio]} id="setup-bio-error" />
          </Field>
        </FieldGroup>

        <FieldError
          className="text-center leading-5"
          errors={[errors.root?.server]}
        />

        <Button
          className="w-full"
          loading={mutation.isPending}
          size="lg"
          type="submit"
        >
          Complete setup
        </Button>
      </div>
    </form>
  )
}

export interface AvatarProps {
  src: string
}

export function Avatar({ src }: AvatarProps) {
  return (
    <a href="">
      <img className="rounded-full w-10 h-10" src={src} alt="Avatar" />
    </a>
  )
}

export interface ToolCardProps {
  src: string
}
export function ToolCard(props: ToolCardProps) {
  const { src } = props

  return (
    <div className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-md transition-transform hover:scale-120 sm:size-12 md:size-14 dark:bg-zinc-800 dark:shadow-none">
      <img className="w-5 sm:w-6 md:w-7" src={src} />
    </div>
  )
}

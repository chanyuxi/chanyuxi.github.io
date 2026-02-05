export interface FrameworkCardProps {
  name: string
  icon: string
  achievements: string[]
}

export function FrameworkCard(props: FrameworkCardProps) {
  const { name, icon, achievements } = props

  return (
    <div className="h-full rounded-lg bg-linear-to-br from-zinc-100 to-blue-100 p-4 shadow-md md:p-6 dark:from-zinc-900/80 dark:to-neutral-800 dark:shadow-none">
      <div className="mb-4 flex items-center justify-center gap-4">
        <img className="w-6 xl:w-7" src={icon} />
        <div>{name}</div>
      </div>
      <ul className="space-y-2 text-sm opacity-80">
        {achievements.map((achievement, index) => (
          // eslint-disable-next-line @eslint-react/no-array-index-key
          <li key={index} className="flex items-center gap-2">
            {achievement}
          </li>
        ))}
      </ul>
    </div>
  )
}

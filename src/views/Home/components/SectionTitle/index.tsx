export interface SectionTitleProps {
  title: string
}

export function SectionTitle(props: SectionTitleProps) {
  const { title } = props

  return (
    <h2 className="mb-6 text-center text-lg tracking-wider uppercase xl:mb-10 xl:text-2xl">
      {title}
    </h2>
  )
}

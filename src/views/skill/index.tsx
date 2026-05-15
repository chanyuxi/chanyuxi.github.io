import poetry from '@res/post/poetry/fair-maiden/untitled_0.md?raw'

import AppMarkdown from '@/components/app-markdown'

export default function Skill() {
  return (
    <main className="base-container">
      <h1 className="text-3xl">Skill</h1>

      <AppMarkdown content={poetry} />
    </main>
  )
}

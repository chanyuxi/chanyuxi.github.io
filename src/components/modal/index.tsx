import { createPortal } from 'react-dom'

export default function Modal() {
  return createPortal(
    <div className="pointer-events-none fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-white/50">
      <div className=""></div>
    </div>,
    document.getElementById('root')!
  )
}

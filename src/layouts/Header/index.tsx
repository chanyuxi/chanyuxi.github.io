import avatar from '@/assets/images/avatar.png'
import { Avatar } from '@/components/Avatar'
import { MENUS } from '@/constants'

export default function header() {
  return (
    <header className="bg-dark-900 sticky top-0">
      <div className="main-container">
        <div className="flex items-center gap-4 py-4">
          <Avatar src={avatar} />
          <span>CHANYUXI</span>

          <div className="ml-auto space-x-4 hidden md:inline-block">
            {MENUS.map(item => (
              <button className="theme-button bg-dark-500" type="button" key={item}>{item}</button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

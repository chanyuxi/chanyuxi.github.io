import { Menu as MenuIcon } from 'lucide-react'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface MenuProps {
  items: { name: string, path: string }[]
}

export default function Menu(props: MenuProps) {
  const nav = useNavigate()

  const { items } = props

  const handleMenuItemClick = (path: string) => {
    nav(path)
  }

  return (
    <nav className="relative">
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-6 lg:flex">
          {items.map(item => (
            <Button
              className="capitalize"
              key={item.path}
              onClick={() => handleMenuItemClick(item.path)}
              variant="nav"
            >
              {item.name}
            </Button>
          ))}
        </div>

        <Sheet>
          <SheetTrigger
            render={(
              <Button
                aria-label="Toggle navigation"
                className="lg:hidden"
                size="icon"
                variant="outline"
              />
            )}
          >
            <MenuIcon size={18} />
          </SheetTrigger>

          <SheetContent className="w-72 border-hairline bg-card p-0">
            <SheetHeader className="border-b border-hairline px-5 py-6">
              <SheetTitle className="text-sm font-semibold tracking-navigation">
                CHANYUXI
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-1 p-3">
              {items.map(item => (
                <SheetClose
                  key={item.path}
                  render={(
                    <Button
                      className="capitalize"
                      onClick={() => handleMenuItemClick(item.path)}
                      size="menu"
                      variant="menu-item"
                    />
                  )}
                >
                  {item.name}
                </SheetClose>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}

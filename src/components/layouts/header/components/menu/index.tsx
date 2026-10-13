import { LogOut, Menu as MenuIcon } from 'lucide-react'
import { useNavigate } from 'react-router'

import ThemeToggle from '@/components/common/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useAuth } from '@/contexts/auth'
import { toast } from '@/libs/toast'

interface MenuProps {
  items: { name: string, path: string }[]
}

export default function Menu(props: MenuProps) {
  const nav = useNavigate()
  const { isSigningOut, signOut, status } = useAuth()

  const { items } = props

  const handleMenuItemClick = (path: string) => {
    nav(path)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    }
    catch {
      toast('Unable to sign out. Please try again.', { immediately: true })
    }
  }

  return (
    <nav className="relative">
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-6 lg:flex">
          {items.map(item => (
            <Button
              className="px-0 text-sm font-medium text-muted-foreground capitalize hover:bg-transparent hover:text-ink dark:text-stone-400 dark:hover:text-stone-50"
              key={item.path}
              onClick={() => handleMenuItemClick(item.path)}
              variant="ghost"
            >
              {item.name}
            </Button>
          ))}
        </div>

        <ThemeToggle />
        {status === 'authenticated' && (
          <Button
            aria-label="Sign out"
            loading={isSigningOut}
            onClick={handleSignOut}
            size="icon"
            title="Sign out"
            variant="outline"
          >
            {!isSigningOut && <LogOut aria-hidden="true" size={16} />}
          </Button>
        )}
        <Sheet>
          <SheetTrigger
            render={(
              <Button
                aria-label="Toggle navigation"
                className="rounded-full lg:hidden"
                size="icon"
                variant="outline"
              />
            )}
          >
            <MenuIcon size={18} />
          </SheetTrigger>

          <SheetContent className="w-72 border-hairline bg-card p-0 dark:border-white/10">
            <SheetHeader className="border-b border-hairline px-5 py-6 dark:border-white/10">
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
                      className="h-11 w-full justify-start rounded-xl px-4 text-muted-foreground capitalize hover:text-ink dark:text-stone-300 dark:hover:text-white"
                      onClick={() => handleMenuItemClick(item.path)}
                      variant="ghost"
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

import MenuIcon from '~icons/lucide/menu'
import { Link } from 'react-router'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface MobileMenuProps {
  items: { name: string, path: string }[]
}

export default function MobileMenu({ items }: MobileMenuProps) {
  return (
    <Sheet defaultOpen>
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
        <MenuIcon aria-hidden="true" className="size-4.5" />
      </SheetTrigger>

      <SheetContent className="w-72">
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
                <Link
                  className={buttonVariants({
                    className: 'capitalize',
                    size: 'menu',
                    variant: 'menu-item',
                  })}
                  to={item.path}
                />
              )}
            >
              {item.name}
            </SheetClose>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

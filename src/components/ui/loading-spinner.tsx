import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar"
import Link from "next/link"

export default function LoadingSpinner({ className }: { className?: string }) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col gap-2 items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="nav-logo flex items-center gap-1 animate-pulse">
        <Avatar className="rounded-xl bg-black text-white font-bold text-4xl p-6 flex items-center justify-center">
          <AvatarFallback className="size-2 flex items-center justify-center">S</AvatarFallback>
        </Avatar>
        <Link href="/" className='font-bold text-4xl'>
          ShopMart
        </Link>
      </div>
        <div className={cn("flex items-center justify-center w-full h-full min-h-[200px]", className)}>
            <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-black rounded-full border-t-transparent animate-spin"></div>
            </div>
        </div>
    </div>
    )
}

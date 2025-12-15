import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion, Home, ArrowRight } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center space-y-8">
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="relative bg-card p-8 rounded-full shadow-2xl border border-border">
                    <FileQuestion className="w-24 h-24 text-primary animate-bounce-slow" />
                </div>
            </div>

            <div className="space-y-4 max-w-lg">
                <h1 className="text-8xl font-black text-foreground tracking-tighter">404</h1>
                <h2 className="text-3xl font-bold tracking-tight">Page Not Found</h2>
                <p className="text-muted-foreground text-lg">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
            </div>

            <div className="flex gap-4">
                <Link href="/">
                    <Button size="lg" className="gap-2 bg-black text-white hover:bg-black/80">
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Button>
                </Link>
                <Link href="/products">
                    <Button variant="outline" size="lg" className="gap-2">
                        Browse Products
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
            </div>
        </div>
    )
}

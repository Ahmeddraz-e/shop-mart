import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"


export default async function Home() {

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 opacity-50">
          <Image
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-fade-in-up">
            Redefine Your Style
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto animate-fade-in-up delay-100">
            Discover the latest trends and premium quality products curated just for you.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-200 transition-all transform hover:scale-105 animate-fade-in-up delay-200"
          >
            Shop Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>





      {/* Newsletter Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Subscribe to our newsletter for exclusive offers, new arrivals, and style tips.
          </p>
          <form className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md bg-gray-900 border border-gray-800 focus:outline-none focus:border-white transition-colors"
            />
            <button className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-200 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}



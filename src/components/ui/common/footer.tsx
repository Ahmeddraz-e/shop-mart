import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';

export default function Footer() {
    return (
        <footer className="bg-black text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 ">
                    {/* Brand Section */}
                    <div className="space-y-5">
                        <div className="nav-logo flex items-center gap-1">
                    <Avatar className="rounded-xl bg-white text-black font-bold text-2xl py-1 px-4 flex items-center justify-center">
                        <AvatarFallback>S</AvatarFallback>
                    </Avatar>
                    <Link href="/" className='font-bold text-2xl'>
                        ShopMart
                    </Link>
                </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Elevating your shopping experience with curated products and exceptional service. Quality meets style in every purchase.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <SocialLink href="#" icon={<Facebook className="w-5 h-5" />} />
                            <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} />
                            <SocialLink href="#" icon={<Instagram className="w-5 h-5" />} />
                            <SocialLink href="#" icon={<Linkedin className="w-5 h-5" />} />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            <FooterLink href="/">Home</FooterLink>
                            <FooterLink href="/products">Products</FooterLink>
                            <FooterLink href="/categories">Categories</FooterLink>
                        </ul>
                    </div>


                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-gray-500 shrink-0" />
                                <span>Alexandria<br />Egypt</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-gray-500 shrink-0" />
                                <span>+201016309332</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-gray-500 shrink-0" />
                                <span>support@shopmart.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} ShopMart. All rights reserved.
                    </p>
                    
                </div>
            </div>
        </footer>
    )
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all duration-300"
        >
            {icon}
        </Link>
    )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link
                href={href}
                className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
            >
                <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-white transition-colors" />
                {children}
            </Link>
        </li>
    )
}

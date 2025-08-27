'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { BookCheck, BookOpen, FileQuestion, Lock, Mail } from 'lucide-react'
import Link from 'next/link'

const companyLinks = [
  {
    name: 'About',
    href: '/about',
    icon: <BookOpen className="mr-2 h-4 w-4" />
  },
  {
    name: 'Contact',
    href: '/contact',
    icon: <Mail className="mr-2 h-4 w-4" />
  },
  {
    name: 'FAQs',
    href: '/faqs',
    icon: <FileQuestion className="mr-2 h-4 w-4" />
  },
  {
    name: 'Privacy Policy',
    href: '/privacy',
    icon: <Lock className="mr-2 h-4 w-4" />
  },
  {
    name: 'Terms of Use',
    href: '/terms',
    icon: <BookCheck className="mr-2 h-4 w-4" />
  }
]

export function CompanyLinkItems() {
  return (
    <>
      {companyLinks.map(link => (
        <DropdownMenuItem key={link.name} asChild>
          <Link href={link.href} rel="noopener noreferrer">
            {link.icon}
            <span>{link.name}</span>
          </Link>
        </DropdownMenuItem>
      ))}
    </>
  )
}

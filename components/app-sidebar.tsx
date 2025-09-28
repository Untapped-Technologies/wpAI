import Link from 'next/link'
import { Suspense } from 'react'

import { Plus } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger
} from '@/components/ui/sidebar'

import { homePage } from '@/components/_constants/staticData'
import Image from 'next/image'
import { menuItems } from './_constants/pageData/pageData'
import { SidebarAuthSection } from './sidebar-auth-section'
import { ChatHistorySection } from './sidebar/chat-history-section'
import { ChatHistorySkeleton } from './sidebar/chat-history-skeleton'

export default function AppSidebar() {
  return (
    <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
      <SidebarHeader className="flex flex-row justify-between items-center">
        <Link href="/" className="flex items-center gap-2 px-2 py-3">
          <Image
            src="/images/logos/icononly_transparent_nobuffer.png"
            alt="World Politics Logo"
            width={36}
            height={36}
          />
          <span className="font-semibold text-sm">{homePage.title}</span>
        </Link>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent className="flex flex-col px-2 py-4 h-full">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/my-search" className="flex items-center gap-2">
                <Plus className="size-4" />
                <span>New</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {menuItems.map(item => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild>
                <Link href={item.href} className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.title}</span>
                  {/* {item.expandIcon && (
                    <div className="ml-auto">
                      <ChevronRight size={24} />
                    </div>
                  )} */}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarAuthSection />
        <Suspense fallback={<ChatHistorySkeleton />}>
          <ChatHistorySection />
        </Suspense>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

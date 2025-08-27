import PageLayout from '@/components/_constants/pages/pageLayout'
import Tabs from '@/components/ui/tabs'
import AccountTab from '@/components/ui/tabs/accountTab'
import BioTab from '@/components/ui/tabs/bioTab'
import NotificationsTab from '@/components/ui/tabs/notificationsTab'
import PreferencesTab from '@/components/ui/tabs/preferenceTab'
import { BellIcon, PencilIcon, SettingsIcon, UserIcon } from 'lucide-react'

export default function UserProfilePage() {
  const tabs = [
    {
      label: 'Account',
      icon: <UserIcon size={16} />,
      content: <AccountTab />
    },
    {
      label: 'Notifications',
      icon: <BellIcon size={16} />,
      content: <NotificationsTab />
    },
    {
      label: 'Bio',
      icon: <PencilIcon size={16} />,
      content: <BioTab />
    },
    {
      label: 'Preferences',
      icon: <SettingsIcon size={16} />,
      content: <PreferencesTab />
    }
  ]

  return (
    <PageLayout title="User Profile">
      <Tabs tabs={tabs} />
    </PageLayout>
  )
}

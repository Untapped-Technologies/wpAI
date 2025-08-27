import {
  activities,
  profileCategories,
  projects,
  samplePolitician
} from '@/components/_constants/data'
import ProfileCard from '@/components/ui/_custom/profileCard'

import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function ProfilePage() {
  const { id, name, title, image, affiliation, about } = samplePolitician

  return (
    <div
      className={cn(
        'relative flex h-full min-w-0 flex-1 flex-col',
        'items-center justify-center'
      )}
      data-testid="full-chat"
    >
      <div className="min-h-screen p-4 md:p-10 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top Profile Card */}
          <div className="bg-sidebar rounded-2xl shadow-md p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src={image}
              alt={name}
              className="size-36 rounded-full object-cover mt-10 md:mt-0"
            />
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">{name}</h1>
              <p className="text-gray-500">{title}</p>
              <p className="mt-2 text-md dark:text-gray-300 text-gray-600">
                {about}
              </p>
              <p className="mt-2 text-lg dark:text-gray-300 text-gray-600">
                State: {affiliation.state} | Party: {affiliation.party} |{' '}
                Chamber: {affiliation.chamber} | District:{' '}
                {affiliation.district}
              </p>
            </div>
          </div>

          {/* Grid of Profile Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Info Card */}

            {/* Example usage of profileCategories.map */}
            {profileCategories.map(item => (
              <ProfileCard
                title={item.title}
                subtitle={item.subtitle}
                key={item.id}
              >
                <ul className="text-sm  text-gray-600 space-y-2">
                  {item.areas.map((listItem, ndx) => (
                    <li key={ndx}>
                      <Link
                        href={listItem.url}
                        className="text-lg hover:bg-gray-100 p-2 hover:text-blue-900 rounded"
                      >
                        {listItem.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </ProfileCard>
            ))}

            {/* Projects Card */}
            <ProfileCard title="Projects" subtitle="Top Priority">
              <ul className="text-lg text-blue-600 space-y-1">
                {projects.map(project => (
                  <li key={project.id}>
                    <Link href={project.link} className="hover:text-white">
                      {project.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </ProfileCard>

            {/* Activity Log or Timeline */}
            <ProfileCard title="Trending Activity" subtitle="Latest updates">
              <ul className="text-lg text-blue-600 space-y-1">
                {activities.map(activity => (
                  <li key={activity.id}>
                    <Link href={activity.link} className="hover:text-white">
                      {activity.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </ProfileCard>

            {/* Social Links */}
            <ProfileCard title="Social Links" subtitle="Connect with me">
              <div className="flex gap-4 text-blue-500">
                {samplePolitician.socialMedia.map(social => (
                  <a
                    href={social.link}
                    key={social.id}
                    aria-label={social.title}
                    className="hover:text-white"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </ProfileCard>
          </div>
        </div>
      </div>
    </div>
  )
}

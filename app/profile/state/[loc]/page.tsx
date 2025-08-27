'use client'
import {
  state_activities,
  state_profileCategories,
  state_projects,
  state_samplePolitician
} from '@/components/_constants/data'
import ProfileCard from '@/components/ui/_custom/profileCard'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function ProfilePage() {
  const params = useParams()
  const { loc } = params
  const politician = state_samplePolitician.filter(item => item.loc === loc)[0]

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
          {politician && (
            <>
              <div className="bg-sidebar rounded-2xl shadow-md p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
                <img
                  src={politician.image}
                  alt={politician.name}
                  className="size-36 rounded-full object-cover mt-10 md:mt-0"
                />
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-bold">{politician.name}</h1>
                  <p className="dark:text-gray-500">{politician.title}</p>
                  <p className="mt-2 text-md dark:text-gray-300">
                    {politician.about}
                  </p>
                  <p className="mt-2 text-lg dark:text-gray-300">
                    State: <span className="capitalize">{loc}</span> | Party:{' '}
                    {politician.affiliation.party} | Chamber:{' '}
                    {politician.affiliation.chamber} | District:{' '}
                    {politician.affiliation.district}
                  </p>
                </div>
                <div>
                  <Image
                    src={`/images/states/${loc}.svg`}
                    alt="state icon"
                    height={loc === 'california' ? 200 : 250}
                    width={loc === 'california' ? 200 : 250}
                    className="dark:opacity-20 opacity-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Info Card */}

                {/* Example usage of profileCategories.map */}
                {state_profileCategories.map(item => (
                  <ProfileCard
                    title={item.title}
                    subtitle={item.subtitle}
                    key={item.id}
                  >
                    <ul className="text-sm dark:text-gray-200 text-gray-500 space-y-2">
                      {item.areas.map((listItem, ndx) => (
                        <li key={ndx}>
                          <Link
                            href={listItem.url}
                            className="text-lg hover:bg-gray-500 hover:p-2 hover:text-black rounded"
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
                    {state_projects.map(project => (
                      <li key={project.id}>
                        <Link href={project.link} className="hover:text-white">
                          {project.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </ProfileCard>

                {/* Activity Log or Timeline */}
                <ProfileCard
                  title="Trending Activity"
                  subtitle="Latest updates"
                >
                  <ul className="text-lg text-blue-600 space-y-1">
                    {state_activities.map(activity => (
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
                    {politician.socialMedia.map(social => (
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}

import HomeCTA from '@/components/_constants/pages/home/homeCTA'
import HomeFooter from '@/components/_constants/pages/home/homeFooter'
import HomeHeader from '@/components/_constants/pages/home/homeHeader'
import HomeNavigation from '@/components/_constants/pages/home/homeNavigation'
import HomePlatform from '@/components/_constants/pages/home/homePlatform'
import HomePricing from '@/components/_constants/pages/home/homePricing'
import HomeTrending from '@/components/_constants/pages/home/homeTrending'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 w-full">
      <HomeNavigation />
      <div className="mx-auto">
        <HomeHeader />
        <HomePlatform />
        <HomeTrending />
        <HomePricing />
        <HomeCTA />
        <HomeFooter />
      </div>
    </div>
  )
}

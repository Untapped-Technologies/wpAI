import HomeCTA from '@/components/_constants/pages/home/homeCTA'
import HomeHeader from '@/components/_constants/pages/home/homeHeader'
import HomePlatform from '@/components/_constants/pages/home/homePlatform'
import HomePricing from '@/components/_constants/pages/home/homePricing'
import HomeTrending from '@/components/_constants/pages/home/homeTrending'
import AuthAwareFooter from '@/components/auth-aware-footer'
import AuthAwareNavigation from '@/components/auth-aware-navigation'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 w-full">
      <AuthAwareNavigation />
      <div className="mx-auto">
        <HomeHeader />
        <HomePlatform />
        <HomeTrending />
        <HomePricing />
        <HomeCTA />
        <AuthAwareFooter />
      </div>
    </div>
  )
}

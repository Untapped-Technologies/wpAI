import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const HomeHeader = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="text-center mx-auto">
          <Image
            src="/images/logos/logo.png"
            alt="World Politics logo"
            className="m-auto mb-8"
            height={263}
            width={537}
          />

          <p className="text-xl lg:text-2xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Factual, transparent, and unbiased — delivering only the verified
            truth about political events and leaders worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              asChild
              size="lg"
              className="bg-[#203c39] hover:bg-[#203c39]/90 text-white px-8 py-4 text-lg"
            >
              <Link href="/auth/sign-up" className="flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg border-2"
            >
              <Link href="/trending-topics" className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Explore Trending Topics
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Free to start
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Real-time updates
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Global coverage
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeHeader

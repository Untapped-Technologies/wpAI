import { Button } from '@/components/ui/button'
import { ArrowRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const HomeCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-[#203c39] to-slate-800 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Navigate Global Politics?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Join thousands of users who rely on WorldPolitics.AI for accurate,
          timely, and comprehensive political intelligence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="bg-white text-[#203c39] hover:bg-slate-100 px-8 py-4 text-lg"
          >
            <Link href="/auth/sign-up" className="flex items-center gap-2">
              Start Your Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-[#203c39] px-8 py-4 text-lg"
          >
            <Link href="/trending-topics" className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Explore Trending Topics
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default HomeCTA

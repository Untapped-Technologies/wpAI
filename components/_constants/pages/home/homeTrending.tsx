import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Globe, MapPin, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'

export default function HomeTrending() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Stay Informed with Trending Topics
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Discover what&apos;s happening in politics across local, national,
            and international levels
          </p>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-[#203c39] text-[#203c39] hover:bg-[#203c39] hover:text-white"
          >
            <Link href="/trending-topics" className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              View All Trending Topics
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Local Politics</CardTitle>
              </div>
              <CardDescription>
                Community-level political developments and local government
                activities
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <CardTitle className="text-lg">National Politics</CardTitle>
              </div>
              <CardDescription>
                Federal government, elections, and national policy developments
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <CardTitle className="text-lg">
                  International Politics
                </CardTitle>
              </div>
              <CardDescription>
                Global affairs, diplomacy, and international relations
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  )
}

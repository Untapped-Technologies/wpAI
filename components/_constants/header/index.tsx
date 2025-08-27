import { Moon } from 'lucide-react'
import Link from 'next/link'

const Header = () => {
  return (
    <header className="w-full">
      <nav className="border-gray-200 dark:bg-black py-2.5">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between px-4">
          <a href="#" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap text-white">
              WorldPolitics.ai
            </span>
          </a>
          <div className="flex items-center lg:order-2">
            <a
              className="rounded-lg border-2 border-white px-4 py-2 text-sm leading-[24px] font-medium text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 focus:outline-none sm:mr-2 lg:px-5 lg:py-2.5 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              href="/"
            >
              <Moon size={24} />
            </a>
            <a
              className="rounded-lg border-2 border-white px-4 py-2 text-sm leading-[24px] font-medium text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 focus:outline-none sm:mr-2 lg:px-5 lg:py-2.5 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              href="/guest"
            >
              Log out
            </a>
          </div>
          <div
            className="hidden w-full items-center justify-between lg:order-1 lg:flex lg:w-auto"
            id="mobile-menu-2"
          >
            <ul className="mt-4 flex flex-col font-medium lg:mt-0 lg:flex-row lg:space-x-8">
              <li>
                <Link
                  className="block border-b py-2 pr-4 pl-3 text-gray-400 hover:text-white lg:border-0 lg:p-0 lg:hover:bg-transparent lg:hover:text-purple-700"
                  href="/"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="block border-b border-gray-700 py-2 pr-4 pl-3 text-gray-400 hover:bg-gray-700 hover:text-white lg:border-0 lg:p-0 lg:hover:bg-transparent lg:hover:text-white"
                  href="/about"
                >
                  About
                </Link>
              </li>
              {/* <li>
                <Link
                  className="block border-b border-gray-700 py-2 pr-4 pl-3 text-gray-400 hover:bg-gray-700 hover:text-white lg:border-0 lg:p-0 lg:hover:bg-transparent lg:hover:text-white"
                  href="/Pricing"
                >
                  Pricing
                </Link>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header

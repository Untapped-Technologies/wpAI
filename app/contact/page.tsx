'use client'
import MainHeader from '@/components/_constants/pages/mainHeader'
import AuthAwareFooter from '@/components/auth-aware-footer'
import AuthAwareNavigation from '@/components/auth-aware-navigation'
import { ChangeEvent, useState } from 'react'

const Contact = () => {
  const [formValues, setFormValues] = useState({
    email: '',
    message: '',
    reason: '',
    subject: ''
  })
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    evt.preventDefault()
    const { name, value } = evt.target as HTMLInputElement
    setFormValues(prev => ({ ...prev, [name]: value }))
  }

  const handleMessageChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    evt.preventDefault()
    setFormValues(prev => ({ ...prev, message: evt.target.value }))
  }

  const handleTypeChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = evt.target
    setFormValues(prev => ({ ...prev, [name]: value }))
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 w-full">
      <AuthAwareNavigation />
      <div className="max-w-4xl mx-auto mb-8">
        <MainHeader title="" />
        <div className="text-left space-y-4 text-[#203c39]">
          <section className="bg-white dark:bg-gray-900">
            <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
              <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">
                Contact Us
              </h2>
              <p className="mb-8 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
                At WorldPolitics.ai, we partner with organizations, media, and
                professionals who want to stay ahead of the conversation.
                Whether you’re exploring subscription options, enterprise
                solutions, or strategic partnerships, our team is ready to help
                you unlock the full potential of our platform.
              </p>
              <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
                Have feedback, questions, or a specific use case in mind?
                Connect with us today—let’s turn insight into opportunity.
              </p>
              <form action="#" className="space-y-8">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                    placeholder="name@flowbite.com"
                    required
                    value={formValues.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="contactFor"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Reason for contacting
                  </label>
                  <select
                    name="reason"
                    value={formValues.reason || ''}
                    onChange={handleTypeChange}
                    className="w-full rounded border p-2 bg-white text-[#254541] focus:outline-none focus:ring-2 focus:ring-[#254541]"
                  >
                    <option value="" disabled>
                      Select reason
                    </option>
                    <option value="sales">Sales</option>
                    <option value="feedback">Feedback</option>
                    <option value="question">Question</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formValues.subject}
                    onChange={handleChange}
                    className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                    placeholder="Let us know how we can help you"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                  >
                    Your message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formValues.message}
                    onChange={handleMessageChange}
                    rows={6}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Leave a comment..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="flex justify-start rounded border border-[#254541] bg-[#254541] px-4 py-2 text-white hover:text-[#254541] hover:border-[#254541] hover:bg-white"
                >
                  Send message
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
      <AuthAwareFooter />
    </div>
  )
}

export default Contact

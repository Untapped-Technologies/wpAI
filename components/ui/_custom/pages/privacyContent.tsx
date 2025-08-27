const PrivacyContent = () => {
  return (
    <>
      <section className="mb-8">
        <h2 className="text-2xl font-bold dark:text-white mb-4 flex items-center">
          Information We Collect
        </h2>
        <ul className="list-inside list-disc dark:text-indigo-200 pl-4 space-y-2 text-left indent-6">
          <li>
            <strong>Account Information:</strong> Name, email address, phone
            number, profile photo.
          </li>
          <li>
            <strong>Content:</strong> Messages, images, videos, or files shared
            via chat or posts.
          </li>
          <li>
            <strong>Automatically Collected Data:</strong> Device information,
            IP address, usage data.
          </li>
          <li>
            <strong>Third-Party Data:</strong> Analytics or payment data from
            authorized SDKs.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold dark:text-white mb-4 flex items-center">
          How We Use Your Information
        </h2>
        <p className="dark:text-indigo-200 leading-relaxed text-left ml-10">
          Your data is used to provide and improve our services, personalize
          your experience, ensure security, and comply with legal obligations.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold dark:text-white mb-4 flex items-center">
          Data Sharing and Third-Party Access
        </h2>
        <p className="dark:text-indigo-200 mb-4 text-left ml-10">
          We do not sell your data. However, we may share it with:
        </p>
        <ul className="list-disc list-inside pl-4 dark:text-indigo-200 space-y-2 text-left indent-6">
          <li>Service providers for notifications or payment processing.</li>
          <li>Legal authorities as required by law.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold dark:text-white mb-4 flex items-center">
          Account Deletion
        </h2>
        <p className="dark:text-indigo-200 mb-4 text-left ml-10">
          You can delete your account anytime. To delete your account:
        </p>
        <ol className="list-decimal list-inside pl-4 dark:text-indigo-200 space-y-2 text-left indent-6">
          <li>
            Go to <strong>Settings &gt; Account &gt; Delete Account</strong> in
            the app.
          </li>
          <li>Confirm your request.</li>
        </ol>
        <p className="dark:text-indigo-200 mt-4 text-left ml-10">
          Or send a deletion request to:
          <a
            href="mailto:support@worldpolitics.ai"
            className="text-[#006A4E] hover:underline"
          >
            support@worldpolitics.ai
          </a>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold dark:text-white mb-4 flex items-center">
          Contact Us
        </h2>
        <ul className="list-none pl-0 dark:text-indigo-200 space-y-2 text-left indent-6">
          <li>
            <strong>Email:</strong>{' '}
            <a
              href="mailto:support@worldpolitics.ai"
              className="text-[#006A4E] hover:underline"
            >
              support@worldpolitics.ai
            </a>
          </li>
          <li>
            <strong>Address:</strong> District of Columbia
          </li>
        </ul>
      </section>
    </>
  )
}

export default PrivacyContent

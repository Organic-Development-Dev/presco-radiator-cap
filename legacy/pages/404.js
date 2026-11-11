import Link from 'next/link';
import Head from 'next/head';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found - Presco Radiator Caps</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-primary">404</h1>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">Page Not Found</h2>
          <p className="mt-6 text-base text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <div className="mt-8 space-y-4">
            <Link href="/" className="inline-block px-5 py-3 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors">
              Go back home
            </Link>
          </div>
          <div className="mt-12">
            <p className="text-sm text-gray-600">
              If you believe this is an error, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
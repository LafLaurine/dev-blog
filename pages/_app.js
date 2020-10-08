import Head from 'next/head'

import '../styles/base.css'

function MyApp({ Component, pageProps }) {
  const title = pageProps.data?.title

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>{title || `Laurine - Dev blog`}</title>
      </Head>

      <Component {...pageProps} />
    </>
  )
}

export default MyApp

import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Layout } from '../components'
import { SessionProvider } from "next-auth/react"

function MyApp({ Component, pageProps }: AppProps, { session }: any) {
  return (
    <SessionProvider session={session }>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  )
}

export default MyApp
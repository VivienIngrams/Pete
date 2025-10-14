import { getClient } from '~/sanity/lib/sanity.client'
import { getHomePage } from '~/sanity/lib/sanity.queries'
import SplashPage from './components/SplashPage'

export default async function HomePage() {
  const client = getClient()

  const homePageData = await getHomePage(client, {
    next: { revalidate: 30 },
  })

  return <SplashPage mainImage={homePageData.mainImage} />
}

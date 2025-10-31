import { readToken } from "~/sanity/lib/sanity.api"
import { getClient } from "~/sanity/lib/sanity.client"
import { getBioPage } from "~/sanity/lib/sanity.queries"
import BioClient from "./clientPage"

export default async function BioPage() {
  const client = getClient({ token: readToken })
  const bioDataArray = await getBioPage(client, {
    next: { revalidate: 60 },
  })

  if (!bioDataArray || bioDataArray.length === 0) {
    return <div>Error: Unable to fetch biography data.</div>
  }

  return <BioClient initialBioData={bioDataArray[0]} />
}

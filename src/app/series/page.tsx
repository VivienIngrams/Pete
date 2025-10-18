import { redirect } from 'next/navigation'

export default function SeriesPage() {
  // Redirect /series to home page since series is now the home page
  redirect('/')
}

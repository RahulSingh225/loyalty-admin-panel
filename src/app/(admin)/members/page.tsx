import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { getMembersAction } from '@/actions/member-actions'
import MembersClient from './MembersClient'

export default async function MembersPage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['members'],
    queryFn: getMembersAction,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MembersClient />
    </HydrationBoundary>
  )
}
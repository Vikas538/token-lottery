import { useSolana } from '@/components/solana/use-solana'
import { useQuery } from '@tanstack/react-query'
import { getTokenlotterProgramAccounts } from '@project/anchor'
import { useTokenlotterAccountsQueryKey } from './use-tokenlotter-accounts-query-key'

export function useTokenlotterAccountsQuery() {
  const { client } = useSolana()

  return useQuery({
    queryKey: useTokenlotterAccountsQueryKey(),
    queryFn: async () => await getTokenlotterProgramAccounts(client.rpc),
  })
}

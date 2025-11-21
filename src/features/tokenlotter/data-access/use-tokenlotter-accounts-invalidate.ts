import { useQueryClient } from '@tanstack/react-query'
import { useTokenlotterAccountsQueryKey } from './use-tokenlotter-accounts-query-key'

export function useTokenlotterAccountsInvalidate() {
  const queryClient = useQueryClient()
  const queryKey = useTokenlotterAccountsQueryKey()

  return () => queryClient.invalidateQueries({ queryKey })
}

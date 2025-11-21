import { useSolana } from '@/components/solana/use-solana'

export function useTokenlotterAccountsQueryKey() {
  const { cluster } = useSolana()

  return ['tokenlotter', 'accounts', { cluster }]
}

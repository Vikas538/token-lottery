import { TokenlotterUiCard } from './tokenlotter-ui-card'
import { useTokenlotterAccountsQuery } from '@/features/tokenlotter/data-access/use-tokenlotter-accounts-query'
import { UiWalletAccount } from '@wallet-ui/react'

export function TokenlotterUiList({ account }: { account: UiWalletAccount }) {
  const tokenlotterAccountsQuery = useTokenlotterAccountsQuery()

  if (tokenlotterAccountsQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!tokenlotterAccountsQuery.data?.length) {
    return (
      <div className="text-center">
        <h2 className={'text-2xl'}>No accounts</h2>
        No accounts found. Initialize one to get started.
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {tokenlotterAccountsQuery.data?.map((tokenlotter) => (
        <TokenlotterUiCard account={account} key={tokenlotter.address} tokenlotter={tokenlotter} />
      ))}
    </div>
  )
}

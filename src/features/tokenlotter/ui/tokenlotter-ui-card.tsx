import { TokenlotterAccount } from '@project/anchor'
import { ellipsify, UiWalletAccount } from '@wallet-ui/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { TokenlotterUiButtonClose } from './tokenlotter-ui-button-close'
import { TokenlotterUiButtonDecrement } from './tokenlotter-ui-button-decrement'
import { TokenlotterUiButtonIncrement } from './tokenlotter-ui-button-increment'
import { TokenlotterUiButtonSet } from './tokenlotter-ui-button-set'

export function TokenlotterUiCard({ account, tokenlotter }: { account: UiWalletAccount; tokenlotter: TokenlotterAccount }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tokenlotter: {tokenlotter.data.count}</CardTitle>
        <CardDescription>
          Account: <AppExplorerLink address={tokenlotter.address} label={ellipsify(tokenlotter.address)} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 justify-evenly">
          <TokenlotterUiButtonIncrement account={account} tokenlotter={tokenlotter} />
          <TokenlotterUiButtonSet account={account} tokenlotter={tokenlotter} />
          <TokenlotterUiButtonDecrement account={account} tokenlotter={tokenlotter} />
          <TokenlotterUiButtonClose account={account} tokenlotter={tokenlotter} />
        </div>
      </CardContent>
    </Card>
  )
}

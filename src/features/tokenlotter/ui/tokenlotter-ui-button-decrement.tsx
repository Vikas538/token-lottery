import { TokenlotterAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useTokenlotterDecrementMutation } from '../data-access/use-tokenlotter-decrement-mutation'

export function TokenlotterUiButtonDecrement({ account, tokenlotter }: { account: UiWalletAccount; tokenlotter: TokenlotterAccount }) {
  const decrementMutation = useTokenlotterDecrementMutation({ account, tokenlotter })

  return (
    <Button variant="outline" onClick={() => decrementMutation.mutateAsync()} disabled={decrementMutation.isPending}>
      Decrement
    </Button>
  )
}

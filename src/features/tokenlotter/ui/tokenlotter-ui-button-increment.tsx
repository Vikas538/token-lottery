import { TokenlotterAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'
import { useTokenlotterIncrementMutation } from '../data-access/use-tokenlotter-increment-mutation'

export function TokenlotterUiButtonIncrement({ account, tokenlotter }: { account: UiWalletAccount; tokenlotter: TokenlotterAccount }) {
  const incrementMutation = useTokenlotterIncrementMutation({ account, tokenlotter })

  return (
    <Button variant="outline" onClick={() => incrementMutation.mutateAsync()} disabled={incrementMutation.isPending}>
      Increment
    </Button>
  )
}

import { TokenlotterAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useTokenlotterSetMutation } from '@/features/tokenlotter/data-access/use-tokenlotter-set-mutation'

export function TokenlotterUiButtonSet({ account, tokenlotter }: { account: UiWalletAccount; tokenlotter: TokenlotterAccount }) {
  const setMutation = useTokenlotterSetMutation({ account, tokenlotter })

  return (
    <Button
      variant="outline"
      onClick={() => {
        const value = window.prompt('Set value to:', tokenlotter.data.count.toString() ?? '0')
        if (!value || parseInt(value) === tokenlotter.data.count || isNaN(parseInt(value))) {
          return
        }
        return setMutation.mutateAsync(parseInt(value))
      }}
      disabled={setMutation.isPending}
    >
      Set
    </Button>
  )
}

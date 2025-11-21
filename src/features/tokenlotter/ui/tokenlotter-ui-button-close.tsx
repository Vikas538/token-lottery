import { TokenlotterAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useTokenlotterCloseMutation } from '@/features/tokenlotter/data-access/use-tokenlotter-close-mutation'

export function TokenlotterUiButtonClose({ account, tokenlotter }: { account: UiWalletAccount; tokenlotter: TokenlotterAccount }) {
  const closeMutation = useTokenlotterCloseMutation({ account, tokenlotter })

  return (
    <Button
      variant="destructive"
      onClick={() => {
        if (!window.confirm('Are you sure you want to close this account?')) {
          return
        }
        return closeMutation.mutateAsync()
      }}
      disabled={closeMutation.isPending}
    >
      Close
    </Button>
  )
}

import { Button } from '@/components/ui/button'
import { UiWalletAccount } from '@wallet-ui/react'

import { useTokenlotterInitializeMutation } from '@/features/tokenlotter/data-access/use-tokenlotter-initialize-mutation'

export function TokenlotterUiButtonInitialize({ account }: { account: UiWalletAccount }) {
  const mutationInitialize = useTokenlotterInitializeMutation({ account })

  return (
    <Button onClick={() => mutationInitialize.mutateAsync()} disabled={mutationInitialize.isPending}>
      Initialize Tokenlotter {mutationInitialize.isPending && '...'}
    </Button>
  )
}

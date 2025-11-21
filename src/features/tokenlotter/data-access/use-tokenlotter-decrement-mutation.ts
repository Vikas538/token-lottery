import { TokenlotterAccount, getDecrementInstruction } from '@project/anchor'
import { useMutation } from '@tanstack/react-query'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { toastTx } from '@/components/toast-tx'
import { useTokenlotterAccountsInvalidate } from './use-tokenlotter-accounts-invalidate'

export function useTokenlotterDecrementMutation({
  account,
  tokenlotter,
}: {
  account: UiWalletAccount
  tokenlotter: TokenlotterAccount
}) {
  const invalidateAccounts = useTokenlotterAccountsInvalidate()
  const signer = useWalletUiSigner({ account })
  const signAndSend = useWalletUiSignAndSend()

  return useMutation({
    mutationFn: async () => await signAndSend(getDecrementInstruction({ tokenlotter: tokenlotter.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

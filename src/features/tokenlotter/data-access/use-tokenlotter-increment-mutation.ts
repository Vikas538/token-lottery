import { TokenlotterAccount, getIncrementInstruction } from '@project/anchor'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { useMutation } from '@tanstack/react-query'
import { toastTx } from '@/components/toast-tx'
import { useTokenlotterAccountsInvalidate } from './use-tokenlotter-accounts-invalidate'

export function useTokenlotterIncrementMutation({
  account,
  tokenlotter,
}: {
  account: UiWalletAccount
  tokenlotter: TokenlotterAccount
}) {
  const invalidateAccounts = useTokenlotterAccountsInvalidate()
  const signAndSend = useWalletUiSignAndSend()
  const signer = useWalletUiSigner({ account })

  return useMutation({
    mutationFn: async () => await signAndSend(getIncrementInstruction({ tokenlotter: tokenlotter.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

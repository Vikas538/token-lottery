import { TOKENLOTTER_PROGRAM_ADDRESS } from '@project/anchor'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { ellipsify } from '@wallet-ui/react'

export function TokenlotterUiProgramExplorerLink() {
  return <AppExplorerLink address={TOKENLOTTER_PROGRAM_ADDRESS} label={ellipsify(TOKENLOTTER_PROGRAM_ADDRESS)} />
}

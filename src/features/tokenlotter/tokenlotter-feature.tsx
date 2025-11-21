import { useSolana } from '@/components/solana/use-solana'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { AppHero } from '@/components/app-hero'
import { TokenlotterUiButtonInitialize } from './ui/tokenlotter-ui-button-initialize'
import { TokenlotterUiList } from './ui/tokenlotter-ui-list'
import { TokenlotterUiProgramExplorerLink } from './ui/tokenlotter-ui-program-explorer-link'
import { TokenlotterUiProgramGuard } from './ui/tokenlotter-ui-program-guard'

export default function TokenlotterFeature() {
  const { account } = useSolana()

  return (
    <TokenlotterUiProgramGuard>
      <AppHero
        title="Tokenlotter"
        subtitle={
          account
            ? "Initialize a new tokenlotter onchain by clicking the button. Use the program's methods (increment, decrement, set, and close) to change the state of the account."
            : 'Select a wallet to run the program.'
        }
      >
        <p className="mb-6">
          <TokenlotterUiProgramExplorerLink />
        </p>
        {account ? (
          <TokenlotterUiButtonInitialize account={account} />
        ) : (
          <div style={{ display: 'inline-block' }}>
            <WalletDropdown />
          </div>
        )}
      </AppHero>
      {account ? <TokenlotterUiList account={account} /> : null}
    </TokenlotterUiProgramGuard>
  )
}

// Here we export some useful types and functions for interacting with the Anchor program.
import { Account, getBase58Decoder, SolanaClient } from 'gill'
import { getProgramAccountsDecoded } from './helpers/get-program-accounts-decoded'
import { Tokenlotter, TOKENLOTTER_DISCRIMINATOR, TOKENLOTTER_PROGRAM_ADDRESS, getTokenlotterDecoder } from './client/js'
import TokenlotterIDL from '../target/idl/tokenlotter.json'

export type TokenlotterAccount = Account<Tokenlotter, string>

// Re-export the generated IDL and type
export { TokenlotterIDL }

export * from './client/js'

export function getTokenlotterProgramAccounts(rpc: SolanaClient['rpc']) {
  return getProgramAccountsDecoded(rpc, {
    decoder: getTokenlotterDecoder(),
    filter: getBase58Decoder().decode(TOKENLOTTER_DISCRIMINATOR),
    programAddress: TOKENLOTTER_PROGRAM_ADDRESS,
  })
}

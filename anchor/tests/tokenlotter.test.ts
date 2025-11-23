
import { expect } from 'chai'
import {
  Blockhash,
  createSolanaClient,
  createTransaction,
  generateKeyPairSigner,
  Instruction,
  isSolanaError,
  KeyPairSigner,
  signTransactionMessageWithSigners,
} from 'gill'
import {
  fetchTokenlotter,
  // TODO: Change to getInitializeConfigInstruction once IDL is regenerated from the new lib.rs
  getInitializeInstruction,
} from '../src'
// @ts-ignore error TS2307 suggest setting `moduleResolution` but this is already configured
import { loadKeypairSignerFromFile } from 'gill/node'

/**
 * IMPORTANT: The imports are currently using the OLD generated client code
 * because the IDL hasn't been regenerated from the updated lib.rs
 *
 * To fix this:
 * 1. Run: anchor build --provider.cluster localnet
 * 2. This will regenerate the IDL from your lib.rs
 * 3. Then uncomment the TODO imports and update this test
 */

const { rpc, sendAndConfirmTransaction } = createSolanaClient({ urlOrMoniker: process.env.ANCHOR_PROVIDER_URL! })

describe('tokenlotter', () => {
  // Setup: Declare variables that will be used across all tests
  let payer: KeyPairSigner
  let tokenLotteryAddress: string

  // before runs once before all tests - initializes the test environment (Mocha hook)
  before(async () => {
    // Load the payer account from the file system (usually ~/.config/solana/id.json)
    payer = await loadKeypairSignerFromFile(process.env.ANCHOR_WALLET!)
  })

  /**
   * TEST: Initialize Token Lottery Configuration
   *
   * This test verifies that the initialize_config instruction properly sets up
   * a new TokenLottery account with the correct initial values.
   *
   * What it tests:
   * - The TokenLottery PDA (Program Derived Address) is created
   * - The lottery configuration is initialized with correct start_time, end_time, and ticket_price
   * - Default values are set correctly (lottery_pot_amount=0, total_tickets=0, winner_choosen=false, etc.)
   * - The payer is set as the authority (owner) of the lottery
   */
  it('Initialize Token Lottery Config', async () => {
    // ARRANGE: Set up test data
    // Define lottery parameters
    const startTime = Math.floor(Date.now() / 1000) // Current Unix timestamp
    const endTime = startTime + 86400 // 24 hours later
    const ticketPrice = 1000000 // 0.001 SOL in lamports

    // Create the instruction to initialize the lottery config
    const ix = getInitializeInstruction({
      payer: payer.address,
      startTime,
      endTime,
      ticketPrice,
    })

    // ACT: Send and confirm the transaction
    await sendAndConfirm({ ix, payer })

    // ASSERT: Fetch the created TokenLottery account and verify all fields
    const tokenLottery = await fetchTokenlottery(rpc)

    // Verify that the initialization set all expected values
    expect(tokenLottery.data.startTime).to.equal(startTime)
    expect(tokenLottery.data.endTime).to.equal(endTime)
    expect(tokenLottery.data.ticketPrice).to.equal(ticketPrice)

    // Verify default values are set correctly
    expect(tokenLottery.data.lotteryPotAmount).to.equal(0n) // Lottery starts with empty pot
    expect(tokenLottery.data.totalTickets).to.equal(0n) // No tickets sold yet
    expect(tokenLottery.data.winnerChoosen).to.equal(false) // Winner hasn't been selected

    // Verify the authority is the payer (they can manage this lottery)
    expect(tokenLottery.data.authority).to.equal(payer.address)

    // Verify the randomness account is not yet set (will be used for winner selection)
    expect(tokenLottery.data.randomnessAccount).to.equal('11111111111111111111111111111111') // Default pubkey

    // Store the address for use in other tests
    tokenLotteryAddress = tokenLottery.publicKey
  })

  // ============================================================================
  // FUTURE TESTS - These are placeholders for upcoming functionality
  // You can add more test cases here as you implement additional instructions
  // ============================================================================

  /**
   * TODO: Test buy_ticket instruction (when implemented)
   *
   * This will test:
   * - A user can purchase a lottery ticket
   * - The ticket price is deducted from the buyer's account
   * - The lottery pot amount increases
   * - The total ticket count increases
   * - Tickets can only be purchased before the lottery end time
   */
  // it('Buy Lottery Ticket', async () => {
  //   // ARRANGE
  //   // Create a buyer account
  //   // Verify initial balances
  //
  //   // ACT
  //   // Call buy_ticket instruction
  //
  //   // ASSERT
  //   // Verify pot amount increased
  //   // Verify ticket count increased
  //   // Verify buyer's balance decreased
  // })

  /**
   * TODO: Test select_winner instruction (when implemented)
   *
   * This will test:
   * - Only the lottery authority can select a winner
   * - A winner cannot be selected before the lottery end time
   * - The winner is randomly selected from purchased tickets
   * - The winner_choosen flag is set to true
   */
  // it('Select Lottery Winner', async () => {
  //   // ARRANGE
  //   // Verify lottery end time has passed
  //   // Get randomness account ready
  //
  //   // ACT
  //   // Call select_winner instruction
  //
  //   // ASSERT
  //   // Verify winner_choosen is true
  //   // Verify a valid winner was selected
  //   // Verify winner is one of the ticket holders
  // })

  /**
   * TODO: Test claim_prize instruction (when implemented)
   *
   * This will test:
   * - The selected winner can claim their prize
   * - Non-winners cannot claim the prize
   * - The full pot is transferred to the winner
   * - The lottery account is cleaned up after claiming
   */
  // it('Claim Prize', async () => {
  //   // ARRANGE
  //   // Verify the test caller is the winner
  //   // Get the expected prize amount
  //
  //   // ACT
  //   // Call claim_prize instruction
  //
  //   // ASSERT
  //   // Verify winner received the pot amount
  //   // Verify lottery account is closed/cleaned up
  // })

  /**
   * TODO: Test update_authority instruction (when implemented)
   *
   * This will test:
   * - Only the current authority can transfer authority
   * - The new authority is properly set
   */
  // it('Update Lottery Authority', async () => {
  //   // ARRANGE
  //   // Create a new authority account
  //
  //   // ACT
  //   // Call update_authority instruction
  //
  //   // ASSERT
  //   // Verify new authority is set
  // })

})

// ============================================================================
// HELPER FUNCTIONS - Used by tests to keep code DRY (Don't Repeat Yourself)
// ============================================================================

/**
 * Cache for the latest blockhash to avoid repeated RPC calls
 * This is reset after each transaction to ensure we're using current data
 */
let latestBlockhash: Awaited<ReturnType<typeof getLatestBlockhash>> | undefined

/**
 * Fetch the latest blockhash from the RPC
 * Caches the result to reduce RPC calls, but resets after transactions
 */
async function getLatestBlockhash(): Promise<Readonly<{ blockhash: Blockhash; lastValidBlockHeight: bigint }>> {
  if (latestBlockhash) {
    return latestBlockhash
  }
  return await rpc
    .getLatestBlockhash()
    .send()
    .then(({ value }) => value)
}

/**
 * Helper function to send a transaction and confirm it on-chain
 *
 * @param ix - The instruction(s) to include in the transaction
 * @param payer - The account that will pay for the transaction fees
 *
 * This function:
 * 1. Creates a transaction with the provided instruction
 * 2. Signs it with the payer's keypair
 * 3. Sends it to the blockchain
 * 4. Waits for confirmation
 * 5. Clears the blockhash cache to ensure fresh data on next use
 */
async function sendAndConfirm({ ix, payer }: { ix: Instruction; payer: KeyPairSigner }) {
  // Create a new transaction with the instruction
  const tx = createTransaction({
    feePayer: payer,
    instructions: [ix],
    version: 'legacy',
    latestBlockhash: await getLatestBlockhash(),
  })

  // Sign the transaction with the payer
  const signedTransaction = await signTransactionMessageWithSigners(tx)

  // Send the signed transaction and wait for confirmation
  const result = await sendAndConfirmTransaction(signedTransaction)

  // Clear the blockhash cache to get fresh data for the next transaction
  latestBlockhash = undefined

  return result
}

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
  getCloseInstruction,
  getDecrementInstruction,
  getIncrementInstruction,
  getInitializeInstruction,
  getSetInstruction,
} from '../src'
// @ts-ignore error TS2307 suggest setting `moduleResolution` but this is already configured
import { loadKeypairSignerFromFile } from 'gill/node'

const { rpc, sendAndConfirmTransaction } = createSolanaClient({ urlOrMoniker: process.env.ANCHOR_PROVIDER_URL! })

describe('tokenlotter', () => {
  let payer: KeyPairSigner
  let tokenlotter: KeyPairSigner

  beforeAll(async () => {
    tokenlotter = await generateKeyPairSigner()
    payer = await loadKeypairSignerFromFile(process.env.ANCHOR_WALLET!)
  })

  it('Initialize Tokenlotter', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getInitializeInstruction({ payer: payer, tokenlotter: tokenlotter })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSER
    const currentTokenlotter = await fetchTokenlotter(rpc, tokenlotter.address)
    expect(currentTokenlotter.data.count).toEqual(0)
  })

  it('Increment Tokenlotter', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getIncrementInstruction({
      tokenlotter: tokenlotter.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchTokenlotter(rpc, tokenlotter.address)
    expect(currentCount.data.count).toEqual(1)
  })

  it('Increment Tokenlotter Again', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getIncrementInstruction({ tokenlotter: tokenlotter.address })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchTokenlotter(rpc, tokenlotter.address)
    expect(currentCount.data.count).toEqual(2)
  })

  it('Decrement Tokenlotter', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getDecrementInstruction({
      tokenlotter: tokenlotter.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchTokenlotter(rpc, tokenlotter.address)
    expect(currentCount.data.count).toEqual(1)
  })

  it('Set tokenlotter value', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getSetInstruction({ tokenlotter: tokenlotter.address, value: 42 })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchTokenlotter(rpc, tokenlotter.address)
    expect(currentCount.data.count).toEqual(42)
  })

  it('Set close the tokenlotter account', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getCloseInstruction({
      payer: payer,
      tokenlotter: tokenlotter.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    try {
      await fetchTokenlotter(rpc, tokenlotter.address)
    } catch (e) {
      if (!isSolanaError(e)) {
        throw new Error(`Unexpected error: ${e}`)
      }
      expect(e.message).toEqual(`Account not found at address: ${tokenlotter.address}`)
    }
  })
})

// Helper function to keep the tests DRY
let latestBlockhash: Awaited<ReturnType<typeof getLatestBlockhash>> | undefined
async function getLatestBlockhash(): Promise<Readonly<{ blockhash: Blockhash; lastValidBlockHeight: bigint }>> {
  if (latestBlockhash) {
    return latestBlockhash
  }
  return await rpc
    .getLatestBlockhash()
    .send()
    .then(({ value }) => value)
}
async function sendAndConfirm({ ix, payer }: { ix: Instruction; payer: KeyPairSigner }) {
  const tx = createTransaction({
    feePayer: payer,
    instructions: [ix],
    version: 'legacy',
    latestBlockhash: await getLatestBlockhash(),
  })
  const signedTransaction = await signTransactionMessageWithSigners(tx)
  return await sendAndConfirmTransaction(signedTransaction)
}

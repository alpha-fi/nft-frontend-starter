import * as naj from "near-api-js"
import settings from "../../config/settings.json"
import "@near-wallet-selector/modal-ui/styles.css";


const { contractName } = settings



// TODO: remove pending https://github.com/near/near-api-js/issues/757
import { Buffer } from "buffer"
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupModal } from "@near-wallet-selector/modal-ui";
if (typeof window !== "undefined") window.Buffer = Buffer
if (typeof global !== "undefined") global.Buffer = Buffer

const nearConfig = /near$/.test(contractName)
  ? {
      networkId: "mainnet",
      nodeUrl: "https://rpc.mainnet.near.org",
      walletUrl: "https://wallet.near.org",
      helperUrl: "https://helper.mainnet.near.org",
    }
  : /testnet$/.test(contractName)
  ? {
      networkId: "testnet",
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
    }
  : undefined

if (!nearConfig) {
  throw new Error(
    `Don't know what network settings to use for contract "${contractName}"; expected name to end in 'testnet' or 'near'`
  )
}

/**
 * NEAR Config object
 */
export const near = new naj.Near({
  ...nearConfig,
  keyStore: typeof window === "undefined"
    ? new naj.keyStores.InMemoryKeyStore()
    : new naj.keyStores.BrowserLocalStorageKeyStore()
})

/**
 * Interface to NEAR Wallet
 */
export const wallet = new naj.WalletConnection(near)

export async function signIn() {
  // wallet.requestSignIn({ contractId: settings.contractName })
  const selector = await setupWalletSelector({
    network: "mainnet",
    modules: [
      setupMyNearWallet(),
    ],
  });

  const modal = setupModal(selector, {
    contractId: contractName
  });
  console.log("Showing modal")


  modal.show()
}
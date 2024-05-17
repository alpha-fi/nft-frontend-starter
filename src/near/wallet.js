/* A helper file that simplifies using the wallet selector */

// near api js
import { providers, connect, keyStores, utils } from "near-api-js"

// wallet selector UI
import syles from "@near-wallet-selector/modal-ui/styles.css"
import { setupModal } from "@near-wallet-selector/modal-ui"
// import LedgerIconUrl from "@near-wallet-selector/ledger/assets/ledger-icon.png";
// import MyNearIconUrl from "@near-wallet-selector/my-near-wallet/assets/my-near-wallet-icon.png";
// import meteorIconUrl from "@near-wallet-selector/meteor-wallet/assets/meteor-icon.png";
// wallet selector options
import { setupWalletSelector } from "@near-wallet-selector/core"
import { setupLedger } from "@near-wallet-selector/ledger"
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet"
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet"
import { setupSender } from "@near-wallet-selector/sender"
// import senderIconUrl from "@near-wallet-selector/sender/assets/sender-icon.png";
import { setupHereWallet } from "@near-wallet-selector/here-wallet"
// import HereWalletIconUrl from "@near-wallet-selector/here-wallet/assets/here-wallet-icon.png";
import { setupMintbaseWallet } from "@mintbase-js/wallet"
import settings from "../../config/settings.json"

const { contractName } = settings

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
    `Don't know what network settings to use for contract "${contractName}"; expected name to end in 'testnet' or 'near'`,
  )
}

const sender = setupSender({
  // iconUrl: senderIconUrl,
})

const mintbaseWallet = setupMintbaseWallet({
  networkId: nearConfig.networkId,
  walletUrl: "https://wallet.mintbase.xyz",
  callbackUrl: "https://www.mywebsite.com",
  deprecated: false,
})

const hereWallet = setupHereWallet({
  // iconUrl: HereWalletIconUrl,
})

const meteorWallet = setupMeteorWallet({
  // iconUrl: meteorIconUrl,
})

const DEFAULT_TGAS = "90000000000000"
const NO_DEPOSIT = "0"

// Wallet that simplifies using the wallet selector
export class Wallet {
  constructor({ createAccessKeyFor = undefined }) {
    console.log("called")
    this.walletSelector = null
    this.wallet = null
    this.network = null
    this.createAccessKeyFor = null
    this.accountId = null
    // Login to a wallet passing a contractId will create a local
    // key, so the user skips signing non-payable transactions.
    // Omitting the accountId will result in the user being
    // asked to sign all transactions.
    this.createAccessKeyFor = createAccessKeyFor
    this.network = nearConfig.networkId
  }

  async updateLogInState() {
    const isSignedIn = this.walletSelector.isSignedIn()
    if (isSignedIn) {
      this.wallet = await this.walletSelector.wallet()
      this.accountId =
        this.walletSelector.store.getState().accounts[0].accountId
    }
    return isSignedIn
  }

  // To be called when the website loads
  async startUp() {
    this.walletSelector = await setupWalletSelector({
      network: this.network,
      modules: [
        meteorWallet,
        setupMyNearWallet(),
        // { iconUrl: MyNearIconUrl }
        setupLedger(),
        // { iconUrl: LedgerIconUrl }
        sender,
        hereWallet,
        mintbaseWallet,
      ],
    })

    const isSignedIn = await this.updateLogInState()
    return { isSignedIn: isSignedIn, accountId: this.accountId }
  }

  async account() {
    const [acc] = await this.wallet.getAccounts()
    return acc
    // return this.wallet;
  }

  // Sign-in method
  async login() {
    const description = "Please select a wallet to sign in."
    const modal = setupModal(this.walletSelector, {
      contractId: this.createAccessKeyFor,
      description,
    })
    modal.show()
    // to check for log in state when user is not redirected to other URL
    return new Promise(resolve => {
      modal.on("onHide", async event => {
        if (event.hideReason === "wallet-navigation") {
          const isSignedIn = await this.updateLogInState()
          window.location.reload()
          resolve({ isSignedIn: isSignedIn, accountId: this.accountId }) // Resolve the promise when the sign-in process is complete
        }
      })
    })
  }

  // Sign-out method
  async logout() {
    if (!this?.wallet) return
    await this.wallet.signOut()

    if (
      this.wallet.id === "near-wallet" ||
      this.wallet.id === "my-near-wallet"
    ) {
      this.wallet = this.accountId = this.createAccessKeyFor = undefined
      window.location.replace(window.location.origin + window.location.pathname)
    } else window.location.reload()
  }

  // Make a read-only call to retrieve information from the network
  async viewMethod({ contractId, method, args = {} }) {
    if (!this.walletSelector) {
      await this.startUp()
    }
    const { network } = this.walletSelector.options
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl })
    let res = await provider.query({
      request_type: "call_function",
      account_id: contractId,
      method_name: method,
      args_base64: Buffer.from(JSON.stringify(args)).toString("base64"),
      finality: "optimistic",
    })
    return JSON.parse(Buffer.from(res.result).toString())
  }

  // Call a method that changes the contract's state
  async callMethod({
    contractId,
    method,
    args = {},
    gas = DEFAULT_TGAS,
    deposit = NO_DEPOSIT,
  }) {
    // Sign a transaction with the "FunctionCall" action
    return await this.wallet.signAndSendTransaction({
      signerId: this.accountId,
      receiverId: contractId,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: method,
            args,
            gas,
            deposit,
          },
        },
      ],
    })
  }
}

import * as naj from "near-api-js"
import settings from "../../config/settings.json"

const { contractName } = settings

// TODO: remove pending https://github.com/near/near-api-js/issues/757
import { Buffer } from "buffer"
import { Wallet } from "./wallet"
if (typeof window !== "undefined") window.Buffer = Buffer
if (typeof global !== "undefined") global.Buffer = Buffer

export const nearConfig = /near$/.test(contractName)
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

/**
 * Interface to NEAR Wallet
 */
export const wallet =
  typeof window !== "undefined"
    ? new Wallet({ createAccessKeyFor: settings.contractName })
    : {
        login: () => {},
        viewMethod: () => {},
        callMethod: () => {},
        logout: () => {},
        accountId: "",
      }

export function signIn() {
  wallet?.login()
}

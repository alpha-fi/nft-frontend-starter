import settings from "../../../config/settings.json"
import { wallet } from ".."
import { Contract } from "./tenk"

export const TenK = new Contract(wallet, settings.contractName)

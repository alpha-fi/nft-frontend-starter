import fs from "fs"
import path from "path"
import { GatsbyNode } from "gatsby"
import { locales } from "./lib/locales"
import { rpcData } from "./src/hooks/useTenk"
import webpack from "webpack"

export const onPreInit: GatsbyNode["onPreInit"] = async () => {
  const data = await rpcData()
  fs.writeFileSync(
    path.resolve("stale-data-from-build-time.json"),
    JSON.stringify(data),
  )
}

export const createPages: GatsbyNode["createPages"] = async ({ actions }) => {
  locales.forEach(locale => {
    actions.createPage({
      path: locale.id,
      component: path.resolve("src/templates/[locale].tsx"),
      context: { locale },
    })
  })
}

export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] =
  async ({ actions }) => {
    actions.setWebpackConfig({
      plugins: [
        new webpack.ProvidePlugin({
          Buffer: [path.resolve("node_modules/buffer/"), "Buffer"],
        }),
      ],
      resolve: {
        fallback: {
          crypto: false,
          http: false,
          https: false,
        },
        alias: {
          "@ledgerhq/devices/hid-framing": "@ledgerhq/devices/lib/hid-framing",
        },
      },

      // resolve: {
      //   fallback: {
      //     assert: path.resolve("assert/"),
      //     crypto: path.resolve("crypto-browserify"),
      //     http: path.resolve("stream-http"),
      //     https: path.resolve("https-browserify"),
      //     os: path.resolve("os-browserify/browser"),
      //     stream: path.resolve("stream-browserify"),
      //   },
      // },
    })
  }

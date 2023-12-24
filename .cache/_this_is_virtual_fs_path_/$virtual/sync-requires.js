
// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---cache-dev-404-page-js": preferDefault(require("/mnt/c/Users/htafo/dev/nft-frontend-starter/.cache/dev-404-page.js")),
  "component---src-pages-404-js": preferDefault(require("/mnt/c/Users/htafo/dev/nft-frontend-starter/src/pages/404.js")),
  "component---src-pages-index-tsx": preferDefault(require("/mnt/c/Users/htafo/dev/nft-frontend-starter/src/pages/index.tsx")),
  "component---src-templates-[locale]-tsx": preferDefault(require("/mnt/c/Users/htafo/dev/nft-frontend-starter/src/templates/[locale].tsx"))
}


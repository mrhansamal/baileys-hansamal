import { DEFAULT_CONNECTION_CONFIG } from '../Defaults/index.js'
import { makeCommunitiesSocket } from './communities.js'

const rgb = (r, g, b, text) => `\x1b[38;2;${r};${g};${b}m${text}\x1b[0m`

let bannerPrinted = false

const printBanner = () => {
    if (bannerPrinted) return
    bannerPrinted = true

    console.log(`
${rgb(0, 255, 170, 'Welcome Baileys PontaLabs')}
${rgb(180, 180, 180, 'Terimakasih telah menggunakan baileys ini.')}
`)
}

const makeWASocket = (config) => {
    const newConfig = {
        ...DEFAULT_CONNECTION_CONFIG,
        ...config
    }

    printBanner()

    return makeCommunitiesSocket(newConfig)
}

export default makeWASocket
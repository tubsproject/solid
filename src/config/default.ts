import 'dotenv/config'

export const EXPRESS_PORT = +(process.env.EXPRESS_PORT || 8000)

export const EXPRESS_FULL_URL = process.env.EXPRESS_FULL_URL

export const SOLID_DOMAIN = process.env.SOLID_DOMAIN ?? "https://solidcommunity.net"

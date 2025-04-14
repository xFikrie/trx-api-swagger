import CryptoJS from "crypto-js"
import dotenv from "dotenv"
dotenv.config()

const PASSWORD_HASH = (password: string) => {
  let pass = CryptoJS.PBKDF2(password, `${process.env.PASSWORD_HASH_KEY}`, {
    keySize: 128 / 32,
    iterations: 1000,
  }).toString(CryptoJS.enc.Hex)
  return pass
}

const PASSWORD_VERIFY = (password: string, hash: string) => {
  let pass = CryptoJS.PBKDF2(password, `${process.env.PASSWORD_HASH_KEY}`, {
    keySize: 128 / 32,
    iterations: 1000,
  }).toString(CryptoJS.enc.Hex)
  return hash === pass
}

module.exports = {
  PASSWORD_HASH,
  PASSWORD_VERIFY,
}

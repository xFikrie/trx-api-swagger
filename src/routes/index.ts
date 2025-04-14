import express from "express"
import fs from "fs"
import multer from "multer"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import AUTH_MODULE from "../app/modules/auth"
import BALANCE_MODULE from "../app/modules/balance"
import BANNER_MODULE from "../app/modules/banner"
import MEMBERSHIP_MODULE from "../app/modules/membership"
import PROFILE_MODULE from "../app/modules/profile"
import SERVICES_MODULE from "../app/modules/services"
import TRANSACTION_MODULE from "../app/modules/transaction"

const DocumentsStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    const directory = path.join(__dirname, "../uploads/")
    // check if directory exists, if not create it
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true })
    }
    callback(null, directory)
  },
  filename: async (req, file, callback) => {
    await callback(
      null,
      file.originalname +
        "-" +
        Date.now() +
        "-" +
        uuidv4() +
        path.extname(file.originalname)
    )
  },
})

const API = express.Router()

API.post("/registration", MEMBERSHIP_MODULE.registration)
API.post("/login", AUTH_MODULE.login)

API.route("/profile").get(AUTH_MODULE.verify, PROFILE_MODULE.getProfile)
API.route("/profile/update").put(
  AUTH_MODULE.verify,
  PROFILE_MODULE.updateProfile
)
API.route("/profile/image").put(
  AUTH_MODULE.verify,
  multer({ storage: DocumentsStorage }).any(),
  PROFILE_MODULE.updateImage
)

API.route("/banner").get(AUTH_MODULE.verify, BANNER_MODULE.getBanner)

API.route("/services").get(AUTH_MODULE.verify, SERVICES_MODULE.getServices)

API.route("/balance").get(AUTH_MODULE.verify, BALANCE_MODULE.getBalance)
API.route("/topup").post(AUTH_MODULE.verify, BALANCE_MODULE.topUpBalance)

API.route("/transaction/history").get(
  AUTH_MODULE.verify,
  TRANSACTION_MODULE.getHistory
)
API.route("/transaction").post(
  AUTH_MODULE.verify,
  TRANSACTION_MODULE.postTransaction
)

module.exports = API

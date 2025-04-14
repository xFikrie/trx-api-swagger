import dotenv from "dotenv"
import express from "express"
import pool from "../app/config/pg-config"
dotenv.config()

const router = express.Router()

// Endpoint untuk cek koneksi
router.route("/").get((req: any, res: any) => {
  let APP_STATUS = {
    status: "UP",
    name: process.env.DB_NAME,
    build_date: new Date("2022-09-26 09:00:00"),
  }

  pool
    .query("SELECT NOW()")
    .then((results: any) => {
      Object.assign(APP_STATUS, {
        connection: {
          status: results.rowCount ? "Connected" : "Disconnected",
          db: "PostgreSQL",
          version: "14",
        },
      })
      return res.json(APP_STATUS)
    })
    .catch((error: any) => {
      Object.assign(APP_STATUS, { connection: error })
      return res.json(APP_STATUS)
    })
})

module.exports = router

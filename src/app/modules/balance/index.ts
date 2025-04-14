import { v4 as uuidv4 } from "uuid"
import * as yup from "yup"
import pool from "../../config/pg-config"

const BALANCE_MODULE = {
  getBalance: async (req: any, res: any) => {
    const client = await pool.connect()
    try {
      const user = req.user
      if (!user) {
        return res.status(401).json({
          status: 108,
          message: "Token tidak tidak valid atau kadaluwarsa",
          data: null,
        })
      }

      const QUERY = `SELECT saldo balance FROM "balance" WHERE user_id = $1`

      await client
        .query(QUERY, [user.user_id])
        .then((result: any) => {
          res.status(200).json({
            status: 0,
            message: "Get Balance Berhasil",
            data: result.rows.length > 0 ? result.rows[0] : { balance: 0 },
          })
        })
        .catch((err: any) => {
          return res.status(400).json({
            status: 102,
            message: "Failed to retrieve balance",
            data: null,
          })
        })
        .finally(() => {
          client.release()
        })
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        data: null,
      })
    }
  },
  topUpBalance: async (req: any, res: any) => {
    const client = await pool.connect()
    const { top_up_amount } = req.body

    const schema = yup.object().shape({
      top_up_amount: yup
        .number()
        .typeError("Top up amount must be a number")
        .positive("Top up amount must be a positive number")
        .required("Top up amount is required"),
    })
    try {
      await schema.validate(req.body, { abortEarly: false })

      const user = req.user
      if (!user) {
        return res.status(401).json({
          status: 108,
          message: "Token tidak tidak valid atau kadaluwarsa",
          data: null,
        })
      }

      //#region INSERT TRANSACTION HISTORY
      const INSERT_HISTORY_QUERY = `INSERT INTO "transaction_history" (user_id, invoice_number, transaction_type, description, total_amount, created_on) VALUES ($1, $2, $3, $4, $5, $6)`
      const invoice_number = "INV" + new Date().getTime()

      await client
        .query(INSERT_HISTORY_QUERY, [
          user.user_id,
          invoice_number,
          "TOPUP",
          "Top Up balance",
          top_up_amount,
          new Date(),
        ])
        .catch((err: any) => {
          return res.status(400).json({
            status: 102,
            message: "Failed to insert transaction history",
            data: null,
          })
        })
      //#endregion

      const QUERY = `SELECT saldo balance FROM "balance" WHERE user_id = $1`

      const cek_data = await client.query(QUERY, [user.user_id])
      if (cek_data.rows.length === 0) {
        const INSERT_QUERY = `INSERT INTO "balance" (balance_id, user_id, saldo) VALUES ($1, $2, $3)`
        const balance_id = uuidv4()
        const saldo = top_up_amount || 0
        await client
          .query(INSERT_QUERY, [balance_id, user.user_id, saldo])
          .then(() => {
            return res.status(200).json({
              status: 0,
              message: "Top up balance berhasil",
              data: { balance: saldo },
            })
          })
          .catch((err: any) => {
            return res.status(400).json({
              status: 102,
              message: "Failed to insert balance",
              data: null,
            })
          })
          .finally(() => {
            client.release()
          })
      } else {
        const updatedSaldo = cek_data.rows[0].balance + top_up_amount
        const UPDATE_QUERY = `UPDATE "balance" SET saldo = $1 WHERE user_id = $2`
        await client
          .query(UPDATE_QUERY, [updatedSaldo, user.user_id])
          .then(() => {
            return res.status(200).json({
              status: 0,
              message: "Top up balance berhasil",
              data: { balance: updatedSaldo },
            })
          })
          .catch((err: any) => {
            return res.status(400).json({
              status: 102,
              message: "Failed to update balance",
              data: null,
            })
          })
          .finally(() => {
            client.release()
          })
      }
    } catch (err: any) {
      if (err.name === "ValidationError") {
        const errorMessages = err.errors.join(", ")
        return res.status(400).json({
          status: 102,
          message: `Validation error: ${errorMessages}`,
          data: null,
        })
      }

      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation error",
        errors: err.errors,
      })
    }
  },
}

export default BALANCE_MODULE

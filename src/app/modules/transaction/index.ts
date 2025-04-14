import * as yup from "yup"
import pool from "../../config/pg-config"

const TRANSACTION_MODULE = {
  getHistory: async (req: any, res: any) => {
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
      const offset = req.query.offset
      const limit = req.query.limit

      const QUERY = `SELECT invoice_number, transaction_type, description, total_amount, created_on FROM "transaction_history" WHERE user_id = $1 ORDER BY created_on DESC LIMIT $2 OFFSET $3`

      await client
        .query(QUERY, [user.user_id, limit, offset])
        .then((result: any) => {
          res.status(200).json({
            status: 0,
            message: "Get History Berhasil",
            data: {
              offset: offset,
              limit: limit,
              records: result.rows,
            },
          })
        })
        .catch((err: any) => {
          return res.status(400).json({
            status: 102,
            message: "Failed to retrieve transaction history",
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

  postTransaction: async (req: any, res: any) => {
    const client = await pool.connect()
    const { service_code } = req.body

    const schema = yup.object().shape({
      service_code: yup.string().required("service_code is required"),
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

      //#region Check if service_code is valid
      const QUERY = `SELECT code, name, tarif FROM "services" WHERE code = $1`
      const cek_service = await client.query(QUERY, [service_code])
      if (cek_service.rowCount === 0) {
        return res.status(400).json({
          status: 102,
          message: "Service atau Layanan tidak ditemukan",
          data: null,
        })
      }
      //#endregion

      //#region Check if user has enough balance
      const QUERY2 = `SELECT saldo FROM "balance" WHERE user_id = $1`
      const cek_saldo = await client.query(QUERY2, [user.user_id])
      if (cek_saldo.rowCount === 0) {
        return res.status(400).json({
          status: 102,
          message: "Saldo tidak cukup",
          data: null,
        })
      }

      const saldo = cek_saldo.rows[0].saldo
      const tarif = cek_service.rows[0].tarif
      if (saldo < tarif) {
        return res.status(400).json({
          status: 102,
          message: "Saldo tidak cukup",
          data: null,
        })
      }
      //#endregion

      //#region Insert transaction history
      const invoice_number = "INV" + new Date().getTime()
      const INSERT_HISTORY_QUERY = `INSERT INTO "transaction_history" (user_id, invoice_number, transaction_type, description, total_amount, created_on) VALUES ($1, $2, $3, $4, $5, $6)`
      await client.query(INSERT_HISTORY_QUERY, [
        user.user_id,
        invoice_number,
        "PAYMENT",
        cek_service.rows[0].name,
        cek_service.rows[0].tarif,
        new Date(),
      ])
      //#endregion

      //#region Update balance
      const UPDATE_QUERY = `UPDATE "balance" SET saldo = saldo - $1 WHERE user_id = $2`
      await client.query(UPDATE_QUERY, [
        cek_service.rows[0].tarif,
        user.user_id,
      ])
      //#endregion

      res.status(200).json({
        status: 0,
        message: "Transaksi berhasil",
        data: {
          invoice_number: invoice_number,
          service_code: service_code,
          service_name: cek_service.rows[0].name,
          transaction_type: "PAYMENT",
          total_amount: cek_service.rows[0].tarif,
          created_on: new Date(),
        },
      })
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        data: null,
      })
    }
  },
}

export default TRANSACTION_MODULE

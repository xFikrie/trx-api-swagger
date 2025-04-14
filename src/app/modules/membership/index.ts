import { v4 as uuidv4 } from "uuid"
import * as yup from "yup"
import pool from "../../config/pg-config"

const { PASSWORD_HASH } = require("../../config/password-config")

const MEMBERSHIP_MODULE = {
  registration: async (req: any, res: any) => {
    let { email, first_name, last_name, password } = req.body
    const schema = yup.object().shape({
      email: yup
        .string()
        .email("Invalid email format")
        .required("Email is required"),
      password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    })

    try {
      let uuidKeyID = uuidv4()
      await schema.validate(req.body, { abortEarly: false })

      password = PASSWORD_HASH(password)

      const client = await pool.connect()
      client
        .query(
          `INSERT INTO "user" (user_id, email, first_name, last_name, password) VALUES ($1, $2, $3, $4, $5)`,
          [uuidKeyID, email, first_name, last_name, password]
        )
        .then(() => {
          return res.json({
            status: 200,
            success: true,
            message: "Registration module",
          })
        })
        .catch((err: any) => {
          return res.status(400).json({
            status: 102,
            message: "Parameter email tidak sesuai format",
            data: null,
          })
        })
        .finally(() => {
          client.release()
        })
    } catch (err: any) {
      if (err.errors.includes("Invalid email format")) {
        return res.status(400).json({
          status: 102,
          message: "Parameter email tidak sesuai format",
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

export default MEMBERSHIP_MODULE

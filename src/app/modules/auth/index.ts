import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import * as yup from "yup"
import pool from "../../config/pg-config"

const { PASSWORD_VERIFY } = require("../../config/password-config")

dotenv.config()

const AUTH_MODULE = {
  login: async (req: any, res: any) => {
    const { email, password } = req.body
    const schema = yup.object().shape({
      email: yup
        .string()
        .email("Invalid email format")
        .required("Email is required"),
      password: yup.string().required("Password is required"),
    })

    try {
      await schema.validate({ email, password })
      const client = await pool.connect()

      let QUERY = `SELECT user_id, email, first_name, last_name, password FROM "user" WHERE email = $1 LIMIT 1`
      const result = await client
        .query(QUERY, [email])
        .then((result: any) => {
          let isCheck = PASSWORD_VERIFY(password, result.rows[0].password)
          if (!isCheck) {
            return res.status(401).json({
              status: 103,
              message: "Username atau password salah",
              data: null,
            })
          }

          let token = jwt.sign(
            {
              user_id: result.rows[0].user_id,
              email: result.rows[0].email,
              first_name: result.rows[0].first_name,
              last_name: result.rows[0].last_name,
            },
            `${process.env.JWT_SECRET_KEY}`,
            {
              expiresIn: "12h",
            }
          )

          return res.json({
            status: 200,
            message: "Login Sukses",
            data: {
              token: token,
            },
          })
        })
        .catch((err: any) => {
          return res.status(401).json({
            status: 103,
            message: "Username atau password salah",
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

      return res.json({
        status: 401,
        success: false,
        message: "Email atau password salah",
      })
    }
  },

  verify: async (req: any, res: any, next: any) => {
    const token = req.headers["authorization"]?.split(" ")[1]
    if (!token) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
      })
    }

    try {
      jwt.verify(
        token,
        `${process.env.JWT_SECRET_KEY}`,
        (err: any, decoded: any) => {
          if (err) {
            return res.status(401).json({
              status: 401,
              message: "Token tidak valid",
            })
          }
          req.user = decoded
          next()
        }
      )
    } catch (err) {
      return res.status(401).json({
        status: 401,
        message: "Token tidak valid",
      })
    }
  },
}

export default AUTH_MODULE

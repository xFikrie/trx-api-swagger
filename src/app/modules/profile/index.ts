import * as yup from "yup"
import pool from "../../config/pg-config"

const PROFILE_MODULE = {
  getProfile: async (req: any, res: any) => {
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

      const QUERY = `SELECT email, first_name, last_name, profile_image FROM "user" WHERE email = $1 LIMIT 1`
      const result = await client
        .query(QUERY, [user.email])
        .then((result: any) => {
          res.status(200).json({
            status: 0,
            message: "Sukses",
            data: {
              email: result.rows[0].email,
              first_name: result.rows[0].first_name,
              last_name: result.rows[0].last_name,
              profile_image: result.rows[0].profile_image,
            },
          })
        })
        .catch((err: any) => {
          return res.status(400).json({
            status: 102,
            message: "Failed to retrieve profile",
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
  updateProfile: async (req: any, res: any) => {
    const client = await pool.connect()
    const { first_name, last_name } = req.body
    const schema = yup.object().shape({
      first_name: yup.string().required("First name is required"),
      last_name: yup.string().required("Last name is required"),
    })

    try {
      await schema.validate(req.body)
      const user = req.user
      if (!user) {
        return res.status(401).json({
          status: 108,
          message: "Token tidak tidak valid atau kadaluwarsa",
          data: null,
        })
      }

      let QUERY = `UPDATE "user" SET first_name = $1, last_name = $2 WHERE email = $3`
      await client
        .query(QUERY, [first_name, last_name, user.email])
        .then(() => {
          return res.json({
            status: 200,
            message: "Profile updated successfully",
            data: null,
          })
        })
        .catch((err: any) => {
          return res.status(400).json({
            status: 102,
            message: "Failed to update profile",
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
  updateImage: async (req: any, res: any) => {
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

      // get data from file upload
      const files = req.files[0].filename
      const format = req.files[0].mimetype.split("/")[1]

      if (format === "jpg" || format === "png" || format === "jpeg") {
        let QUERY = `UPDATE "user" SET profile_image = $1 WHERE user_id = $2`
        await client
          .query(QUERY, [files, user.user_id])
          .then(() => {
            return res.json({
              status: 0,
              message: "Update Profile Image berhasil",
              data: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                profile_image: files,
                format: format,
              },
            })
          })
          .catch((err: any) => {
            return res.status(400).json({
              status: 102,
              message: "Failed to update profile image",
              data: null,
            })
          })
          .finally(() => {
            client.release()
          })
      } else {
        return res.status(400).json({
          status: 102,
          message: "Format Image tidak sesuai",
          data: null,
          format: format,
        })
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        data: null,
      })
    }
  },
}

export default PROFILE_MODULE

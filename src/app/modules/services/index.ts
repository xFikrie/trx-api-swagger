import pool from "../../config/pg-config"

const SERVICES_MODULE = {
  getServices: async (req: any, res: any) => {
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

      const QUERY = `SELECT code service_code, name service_name, icon service_icon, tarif service_tarif FROM "services"`

      await client
        .query(QUERY)
        .then((result: any) => {
          res.status(200).json({
            status: 0,
            message: "Sukses",
            data: result.rows,
          })
        })
        .catch((err: any) => {
          return res.status(400).json({
            status: 102,
            message: "Failed to retrieve services",
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
}

export default SERVICES_MODULE

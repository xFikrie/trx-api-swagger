import cors from "cors"
import dotenv from "dotenv"
import express, { Request, Response } from "express"
import createHttpError from "http-errors"

const app = express()
const swaggerUi = require("swagger-ui-express")
const router = require("../routes")
const health = require("../routes/health")

dotenv.config()
app.use(cors())
app.use(express.json())

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(require("../swagger-output.json"))
)

app.use(router)
app.use("/health", health)

// handle 404 error
app.use((req: Request, res: Response, next: Function) => {
  next(createHttpError(404))
})

app.listen(5000, () =>
  console.log(`⚡️[server]: Server is running at https://localhost:5000`)
)

const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" })

const doc = {
  info: {
    title: "My API",
    description: "Description",
  },
  host: "localhost:5000",
  servers: [
    {
      url: "http://localhost:5000",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
}

const outputFile = "./swagger-output.json"
const routes = ["./routes/index.ts"]

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc)

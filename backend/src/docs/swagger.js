const path = require("path");
const fs = require("fs");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const routesDir = path.join(__dirname, "..", "routes");

// Build an explicit file list (works on Windows reliably)
const routeFiles = fs
  .readdirSync(routesDir)
  .filter((f) => f.endsWith(".js"))
  .map((f) => path.join(routesDir, f));

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Media Upload & Search API", version: "1.0.0" },
    servers: [{ url: "http://localhost:5000" }],
    components: {
      securitySchemes: {
        cookieAuth: { type: "apiKey", in: "cookie", name: "accessToken" }
      }
    }
  },
  apis: routeFiles
});

// Debug (keep temporarily)
console.log("Swagger route files:", routeFiles);
console.log("Swagger paths found:", Object.keys(swaggerSpec.paths || {}));

module.exports = {
  swaggerSpec,
  swaggerMiddleware: [swaggerUi.serve, swaggerUi.setup(swaggerSpec)]
};
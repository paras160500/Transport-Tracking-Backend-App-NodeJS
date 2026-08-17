import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",

  info: {
    title: "Courier API",
    version: "1.0.0",
    description: "API Documentation for the Courier Delivery Web Application",
  },

  servers: [
    {
      url: `http://localhost:${process.env.PORT || 5000}`,
      description: "Development Server",
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

  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: ["./routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);

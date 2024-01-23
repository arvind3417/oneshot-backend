import { Express, Request, Response } from "express";
import path from "path";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { BASEURL, PORT } from "../../constants";


const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST API Docs",
      version: '1.0.0',
      description: 'API documentation for the OneShot.ai',
    },
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
    servers: [
        {
          url: `http://localhost:${PORT}${BASEURL}`,
        },
      ],
    //  basePath: BASEURL,
  },
  apis: [
    path.resolve(__dirname, '../../routes/*.ts'),
    path.resolve(__dirname, '../../models/*.ts'),
    path.resolve(__dirname, '../../app.ts'),
  ],

};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express) {
  // Swagger page
  app.use(`${BASEURL}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get(`${BASEURL}/docs.json`, (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

//   log.info(`Docs available at http://localhost:${port}/docs`);
console.log(`Docs available at http://localhost:${PORT}${BASEURL}/docs`);


}

export default swaggerDocs;
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NeuroQuest API',
      version: '1.0.0',
      description: 'API documentation for NeuroQuest'
    },
    servers: [
      {
        url: 'http://localhost:5000'
      }
    ]
  },
  apis: ['./routes/*.js']
};

module.exports = swaggerJsDoc(swaggerOptions);

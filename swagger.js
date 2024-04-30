const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: {
        version: "1.0.0",
        title: "User Creation API",
        description: "Documentation generated by swagger-autogen"
    },
    host: 'localhost:3000',
    definitions: {
        UserPOST: {
            $username: "User1",
            $password: "password123",
            $score: 10
        },
        UserDELETE: {
            $username: "User1",
        }



    }
}

const outputFile = './swagger-output.json';
const endpointFiles = [ './app.js' ];

swaggerAutogen(outputFile, endpointFiles, doc).then(() => {
    require('./bin/www');
});
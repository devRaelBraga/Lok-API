export const loginSwagger = { 
    required: true, 
    description: 'This request will authenticate a user and return a JWT token.', 
    type: 'application', 
    schema: {
    type: 'object',
    properties: {
        email: {
            type: 'string',
        },
        password: {
            type: 'string',
        }
    }
}}
export const createUserSwagger = { 
    required: true, 
    description: 'This request creates a new user.', 
    type: 'application', 
    schema: {
    type: 'object',
    properties: {
        name:{
            type: 'string',
        },
        email: {
            type: 'string',
        },
        password: {
            type: 'string',
        }
    }
}}
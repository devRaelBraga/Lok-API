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

export const updateUserSwagger = { 
    required: true, 
    description: 'This request updates some user fields.', 
    type: 'application', 
    schema: {
    type: 'object',
    properties: {
        id:{
            type: 'string',
        },
        name:{
            type: 'string',
        },
        password: {
            type: 'string',
        },
        profilePicUrl: {
            type: 'string',
        },
    }
}}
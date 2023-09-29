export const sendMessageSwagger = { 
    required: true, 
    description: 'This request will send a message from the user with senderId to user with .', 
    type: 'application', 
    schema: {
    type: 'object',
    properties: {
        senderId: {
            type: 'string',
        },
        receiverId: {
            type: 'string',
        },
        content: {
            type: 'string',
        }
    }
}}

export const getChatHistorySwagger = { 
    required: true, 
    description: 'This request will return a chat history from a pair of users.', 
    type: 'application', 
    schema: {
    type: 'object',
    properties: {
        user1Id: {
            type: 'string',
        },
        user2Id: {
            type: 'string',
        }
    }
}}
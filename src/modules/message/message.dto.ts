
export interface createMessageDTO {
    senderId: string;
    receiverId: string;
    content: string;
}

export interface getChatHistoryDTO {
    user1Id: string;
    user2Id: string;
}

export interface validateUserPairDTO {
    user1Id: string;
    user2Id: string;
}
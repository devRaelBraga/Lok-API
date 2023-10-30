export interface createUserDTO {
    name: string;
    email: string;
    password: string;
    identityKey: string;
    photo: string;
}
export interface getUserDTO {
    email: string;
}

export interface getUserByIdDTO {
    id: string;
}

export interface updateUserDTO {
    id: string;
    name?: string,
    password?: string,
    profilePicUrl?: '',
}


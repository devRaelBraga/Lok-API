export interface createUserDTO {
    name: string;
    email: string;
    password: string;
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


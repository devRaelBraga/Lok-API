export interface loginDTO {
    email: string,
    password: string
}

export interface loginReturnDTO {
    name: string,
    email: string, 
    profilePicUrl: string,
    privateKey: string,
    token: string
}
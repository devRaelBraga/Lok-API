import { CriptMessageDTO, DeCriptMessageDTO } from "./encription.dto";


export class EncriptionService {
    async criptMessage({message, key}: CriptMessageDTO): Promise<string> {
        return message;
    }
    async deCriptMessage({message, key}: DeCriptMessageDTO): Promise<string> {
        return message;
    }
}
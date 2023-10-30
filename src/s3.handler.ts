import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { writeFileSync, readFileSync, unlinkSync } from "fs";

// Configuring S3 client
const bucket = 'infra'; // bucket name
const s3Client = new S3Client({ region: 'us-east-1', credentials:{accessKeyId: '', secretAccessKey: ''} });

interface S3DTO {
    userEmail: string;
    data: string;
}

export async function S3_UploadImage({userEmail, data}:S3DTO): Promise<string>{
    let image;
    var now = String(Date.now());

    if(!(userEmail&&data)){
        console.log('oi')
        throw new Error();
    }

    const tempFile = userEmail + now + '.jpg';

    // --------------- Decoding file and saving to temp image -------------------------------------------------
    try {
        const buffer = Buffer.from(data, 'base64');  // decoding base 64 to image 
        writeFileSync(tempFile, buffer);           // creating temporary file for the image decoded
        image = readFileSync(tempFile);      // reading image to send to S3 bucket
        
    } catch (error) {
        console.log('error')
        return error
    }

    const fileName = userEmail + '/' + tempFile; // Defining file path. Example: 1234-5678(folder)/1234-5678timestamp.jpg
    console.log('Uploading image: ' + fileName);
    
    // --------------- Submitting temp image to S3 -------------------------------------------------
    try {
        const params = {                        // params to S3
            Bucket: bucket,
            Key: 'pics/'+ fileName, 
            Body: image,
        };

        s3Client.send(new PutObjectCommand({...params, ACL: 'public-read'})).then(() => console.log('Success sending: ' + tempFile));
        
        unlinkSync(tempFile);
        
        return `https://infra-track.s3.amazonaws.com/pics/` + fileName
        
    } catch (err) {
        unlinkSync(tempFile);
        console.log('Error uploading');
        return err
    }
}
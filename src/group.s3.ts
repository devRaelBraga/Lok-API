import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { writeFileSync, readFileSync, unlinkSync } from "fs";

// Configuring S3 client
const bucket = 'infra-track'; // bucket name
const s3Client = new S3Client({ region: 'us-east-1', credentials:{accessKeyId: 'AKIAUT7CEBRLP7UIC4HX', secretAccessKey: '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'} });

interface S3DTO {
    userEmail: string;
    data: string;
}

export async function Group_S3({userEmail, data}:S3DTO): Promise<string>{
    let image;
    var now = String(Date.now());
    data = data.split(',')[1]

    if(!(userEmail&&data)){
        console.log('oi')
        throw new Error();
    }

    // function() {
    //     for (let index = 999; index < 999999; index++) {
    //         ainput.value = index
    //         a.click()
    //         setTimeout(() => {console.log(index)}, 1000)            
    //     }
    // }
    

    const tempFile = userEmail + now + '.jpg';

    // --------------- Decoding file and saving to temp image -------------------------------------------------
    try {
        const buffer = Buffer.from(data, 'base64');  // decoding base 64 to image 
        writeFileSync(tempFile, buffer);           // creating temporary file for the image decoded
        image = readFileSync(tempFile);      // reading image to send to S3 bucket
        
    } catch (error) {
        console.log('error')
        return ''
    }

    const fileName = userEmail + '/' + tempFile; // Defining file path. Example: 1234-5678(folder)/1234-5678timestamp.jpg
    console.log('Uploading image: ' + fileName);
    
    // --------------- Submitting temp image to S3 -------------------------------------------------
    try {
        const params = {                        // params to S3
            Bucket: bucket,
            Key: 'pics/groups/'+ fileName, 
            Body: image,
        };

        s3Client.send(new PutObjectCommand({...params, ACL: 'public-read'})).then(() => console.log('Success sending: ' + tempFile));
        
        unlinkSync(tempFile);
        
        return `https://infra-track.s3.amazonaws.com/pics/groups/` + fileName
        
    } catch (err) {
        unlinkSync(tempFile);
        console.log('Error uploading');
        return ''
    }
}
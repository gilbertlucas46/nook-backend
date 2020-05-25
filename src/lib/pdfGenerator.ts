import * as fs from 'fs';
import * as pdf from 'html-pdf';
import { SERVER } from '../constants';
// const html = fs.readFileSync('./', 'utf8');
import * as config from 'config';
import { S3 } from 'aws-sdk/clients/all';

export class PdfGenerator {

    private server: S3;
    constructor() {
        this.server = new S3({
            accessKeyId: config.get('s3.AWS_ACCESS_KEY'),
            secretAccessKey: config.get('s3.AWS_SECRET_KEY'),
            region: config.get('s3.AWS_REGION'),
        });
    }

    async test(htmlFile, fileName) {
        try {

            // const buf = await Buffer.from(htmlFile).toString();
            // const html = fs.readFileSync(SERVER.TEMPLATE_PATH + 'testHtmlFile.html', 'utf8');

            const data: any = await pdf.create(htmlFile, { format: 'A4' }).toFile(SERVER.TEMPLATE_PATH + '/loan/' + fileName + '.pdf') // , async function (err, data) {
            console.log('dataaaaaaaaaaa', data);

            // setTimeout(async function () {
            const aa = await this.uploadFileToS3(SERVER.TEMPLATE_PATH + 'loan/' + fileName + '.pdf', fileName);
            console.log('aaaaaaaaaaaaaaaaaaaaaaaa', aa);
            return aa;
            // }, 200);

        } catch (error) {
            console.log('errorerrorerrorerrorerrorerror', error);
            return Promise.reject(error);
        }
    }


    uploadFileToS3 = async (file, fileName) => {
        console.log('filefilefile', file);

        return new Promise(async (resolve, reject) => {
            try {
                fs.readFile(file, async (err, fileData) => {
                    if (err) {
                        console.log('Error in uploadFileToS3', err);
                        reject(err);
                    }
                    console.log('fileDatafileDatafileData', fileData);

                    resolve(await this.uploadS3(fileData, fileName));
                    // if (upload) {
                    //     // resolve(`${config.s3.basePath}version-point-receipts/` + file.fileName);
                    //     resolve;
                    // }
                });
            } catch (error) {
                console.log('Error inside uploadFileToS3', error);
                reject(error);
            }
        })
    }

    uploadS3 = async (fileData, fileName?) => {

        const name = (fileData.name || fileName).replace(' ', '-') + `.pdf`;
        const params: S3.PutObjectRequest = {
            Bucket: config.get('s3.AWS_BUCKET'),
            Key: `${name.slice(0, name.lastIndexOf('.'))}.${Date.now()}${name.slice(name.lastIndexOf('.'))}`,
            Body: fileData,
            ACL: 'public-read',
            ContentDisposition: 'inline',
        };
        console.log('paramsparamsparams', params);

        const uploadManager = this.server.upload(params);
        const resp = await uploadManager.promise();
        console.log('resprespresp', resp);

        return resp.Location;
    }
}

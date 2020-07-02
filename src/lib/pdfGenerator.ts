import * as fs from 'fs';
import { SERVER } from '../constants';
// const html = fs.readFileSync('./', 'utf8');
import * as config from 'config';
import { S3 } from 'aws-sdk/clients/all';
import * as pdf from 'html-pdf';

export class PdfGenerator {

    private server: S3;
    constructor() {
        this.server = new S3({
            accessKeyId: config.get('s3.AWS_ACCESS_KEY'),
            secretAccessKey: config.get('s3.AWS_SECRET_KEY'),
            region: config.get('s3.AWS_REGION'),
        });
    }

    async test(htmlFile, datatoAddInPDF) {
        try {
            const buf = Buffer.from(htmlFile).toString();
            const applicationId: any = datatoAddInPDF.applicationId;
            const applicantName: any = datatoAddInPDF.fullName;
            const nookLogoUrl = datatoAddInPDF['nookLogoUrl'];

            // const nookLogoUrl = 'https://nookqa.appskeeper.com' + '/src/views/images/nooklogo.png';

            return new Promise((resolve, reject) => {
                const options = {
                    // "base": "file:///home/www/your-asset-path", // Base path that's used to load files (images, css, js) when they aren't referenced using a host
                    format: 'A4',        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
                    footer: {
                        height: '1.2cm',
                        contents: {
                            // first: '<div class="page-footer"><p style="color: #8e8e8e; font-size: 7pt; font-style: italic;"> Ver1.0 05.20/CM</p ><p style="color: #d3d3d3; font-size: 7pt; font-style: italic;"> Copyright © Nook.< /p>< /div>',
                            first: `<div style="padding: 0 30px!important;">
                                <p style="color: #8e8e8e; font-size: 7pt; font-style: italic;"> Ver1.0 05.20/CM</p>
                                  <p style="color: #8e8e8e; font-size: 7pt; font-style: italic;"> Copyright © Nook.</p>
                            </div>`,
                            // 2: 'Second page', // Any page number is working. 1-based index
                            default: `<div style="padding: 0 30px!important;">
                                         <p style="color: #8e8e8e; font-size: 7pt; font-style: italic;"><b>Application ID: </b>${applicationId}</p>
                                        <p style="color: #8e8e8e; font-size: 7pt; font-style: italic;"><b>Name: </b>${applicantName}</p>
                                        </div>`,
                        },
                    },
                    // timeout: 120000
                };
                var result = "<div id='pageHeader'><img src='" + nookLogoUrl + "' /><div style='text-align: center;'>Author: Marc Bachmann</div></div>";

                pdf.create(buf, options).toFile(SERVER.TEMPLATE_PATH + '/loan/' + datatoAddInPDF['fileName'] + '.pdf', async (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        const nameUrl = await this.uploadFileToS3(SERVER.TEMPLATE_PATH + 'loan/' + datatoAddInPDF['fileName'] + '.pdf', datatoAddInPDF['fileName']);
                        resolve(nameUrl);

                    }
                });
            });
        } catch (error) {
            return Promise.reject(error);
        }
    }

    uploadFileToS3 = async (file, fileName) => {

        return new Promise(async (resolve, reject) => {
            try {
                fs.readFile(file, async (err, fileData) => {
                    if (err) {
                        console.log('Error in uploadFileToS3', err);
                        reject(err);
                    }

                    resolve(await this.uploadS3(fileData, fileName));
                });
            } catch (error) {
                reject(error);
            }
        });
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

        const uploadManager = this.server.upload(params);
        const resp = await uploadManager.promise();
        return resp.Location;
    }
}
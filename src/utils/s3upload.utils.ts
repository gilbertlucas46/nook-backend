import { S3 } from 'aws-sdk/clients/all';
import * as config from 'config';

// // import { LoaderService } from '@loader';

export class UploaderService {
    private server: S3;
    constructor(
        // private _loader: LoaderService
    ) {
        this.$server = new S3({
            accessKeyId: config.s3.accessKey,
            secretAccessKey: config.s3.secretKey,
            region: config.s3.region,
        });
    }
    async uploadFile(file: File, key?: string): Promise<string> {
        const name = (file.name || key).replace(' ', '-');
        const params: S3.PutObjectRequest = {
            Bucket: config.s3.bucket,
            Key: `${name.slice(0, name.lastIndexOf('.'))}.${Date.now()}${name.slice(name.lastIndexOf('.'))}`,
            Body: file,
            ACL: 'public-read',
            ContentDisposition: 'inline'
        };
        const uploadManager = this.$server.upload(params);
        const resp = await uploadManager.promise();
        return resp.Location;
    }
    async deleteFile(fileName: string) {
        const params = {
            Bucket: environment.s3.bucket,
            Key: fileName,
        };
        const deleteRequest = this.$server.deleteObject(params);
        return await deleteRequest.promise();
    }
    uploadFiles(files: File[]): Promise<string[]> {
        return Promise.all<string>(files.map(this.uploadFile.bind(this)));
    }
    uploadFilesWithKey(files: CustomFile[]) {
        return Promise.all<string>(files.map(({ file, key }) => this.uploadFile(new File([file], `${key}.${file.type.split('/')[1]}`))));
    }
}

interface CustomFile {
    key: string;
    file: File;
}


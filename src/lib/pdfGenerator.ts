import * as fs from 'fs';
import * as pdf from 'html-pdf';
import { SERVER } from '../constants';
// const html = fs.readFileSync('./', 'utf8');
// const options = { format: 'Letter' };



export class PdfGenerator {
    // private senderEmail: string = config.get('MAIL_FROM_ADDRESS')
    // constructor(private receiverEmail: string, private subject: string, private content: any) {
    // }
    constructor() {
    }
    // async sendMail(params) {
    // 	try {
    // 		// let senderEmail = this.senderEmail
    // 		const mailOptions: Mail.Options = {
    // 			from: 'Nook < ' + config.get('smtp.mailFromAddress') + '>', // sender email
    // 			to: params.receiverEmail, // || this.receiverEmail,
    // 			subject: params.subject, // || this.subject,
    // 			// 	text: 'params.content', // || this.content,
    // 			// html: `<b>${this.content}</b>`,    // html body
    // 			// bcc: config.get('smtp.bccMail')
    // 			html: params.content,    // html body
    // 		};
    // 		transporter.sendMail(mailOptions);
    // 	} catch (error) {
    // 		utils.consolelog('MailManager', error, false);
    // 	}
    // 	return {};
    // }




    async test(htmlFile, fileName) {
        // console.log('htmlFilehtmlFilehtmlFilehtmlFilehtmlFile', htmlFile);
        console.log('LLLLLLLLLLLLLLLLLLLLL', htmlFile, 'KKKKKKKKKKK', typeof htmlFile);
        console.log('fileNamefileNamefileNamefileName', fileName);

        const buf = await Buffer.from(htmlFile).toString();
        // const aa =
        // console.log('aaaaaaaaaaaa>>>>>>>>>>>>.', aa);

        // const html = fs.readFileSync(SERVER.TEMPLATE_PATH + 'testHtmlFile.html', 'utf8');



        // const html = fs.read(, htmlFile, 1, 2, 3);

        // console.log('htmlhtmlhtmlhtmlhtml', html);

        // fd: number,
        // buffer: TBuffer,
        // offset: number,
        // length: number,
        // position: number | null,

        // console.log('htmlFilehtmlFilehtmlFilehtmlFilehtmlFile', html);

        // const options = { format: 'Letter' };


        const a = pdf.create(htmlFile, { format: 'Letter' }).toFile('./' + fileName + '.pdf', function (err, res) {
            if (err) return console.log(err);
            console.log('res', res); // { filename: '/app/businesscard.pdf' }
        });

        // const a = pdf.create(html, { format: 'Letter' }).toFile('./businesscard.pdf') {
        //     if (err) return console.log(err);
        // console.log('res', res); // { filename: '/app/businesscard.pdf' }


        // };


        // console.log('aaaaaaaaaaaaaaaaaaaa', a);

        return;
    }


}

'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
const config = require("config");
const utils = require("../utils");
class MailManager {
    constructor(receiverEmail, subject, content) {
        this.receiverEmail = receiverEmail;
        this.subject = subject;
        this.content = content;
    }
    async sendMail() {
        try {
            let transporter = nodemailer.createTransport({
                host: config.get('smtp.mailHost'),
                port: config.get('smtp.mailPort'),
                secure: true,
                auth: {
                    user: config.get('smtp.mailUserName'),
                    pass: config.get('smtp.mailPassword')
                },
                logger: true
            });
            let mailOptions = {
                from: config.get('smtp.mailHost'),
                to: this.receiverEmail,
                subject: this.subject,
                text: this.content,
                html: `<b>${this.content}</b>`
            };
            let mailResponse = await transporter.sendMail(mailOptions);
        }
        catch (error) {
            utils.consolelog('MailManager', error, false);
        }
        ;
        return {};
    }
}
exports.MailManager = MailManager;
//# sourceMappingURL=mail.manager.js.map
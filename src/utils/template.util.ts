
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as CONSTANT from '@src/constants/app.constant';

export class TemplateUtil {

    private template: string;

    constructor(template) {
        this.template = template;
    }

    compileFile(complieData: object) {
        return new Promise((resolve, reject) => {
            complieData['fbLink'] = CONSTANT.EMAIL_TEMPLATE.SOCIAL_LINK.FB;
            complieData['twitterLink'] = CONSTANT.EMAIL_TEMPLATE.SOCIAL_LINK.TWITTER;
            complieData['instalLink'] = CONSTANT.EMAIL_TEMPLATE.SOCIAL_LINK.INSTAGRAM;
            // complieData['gsgAddress'] = CONSTANT.EMAIL_TEMPLATE.GSG_ADDRESS;
            fs.readFile(this.template, 'utf8', (error, content) => {
                if (error)
                    reject(error);
                try {
                    const template = handlebars.compile(content);
                    const html = template(complieData);
                    resolve(html);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
}
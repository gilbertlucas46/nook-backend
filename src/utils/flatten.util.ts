import { Types } from 'mongoose';

export function flattenObject(data: object) {
    const flattenData: { [key: string]: string | number } = {};
    (function recurse(obj, key: string) {
        if (typeof obj !== 'object') {
            flattenData[key] = obj;
        } else {
            if (Array.isArray(obj)) {
                obj.forEach((item, index) => {
                    recurse(item, key ? `${key}.${index + 1}` : `${index + 1}`);
                });
            } else if ((obj instanceof Date) || (obj instanceof Types.ObjectId)) {
                flattenData[key] = obj.toString();
            } else {
                Object.keys(obj).forEach((prop) => {
                    recurse(obj[prop], key ? `${key}.${prop}` : prop);
                });
            }
        }
    })(data, '');
    return flattenData;
}
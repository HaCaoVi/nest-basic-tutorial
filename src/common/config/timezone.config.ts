// src/config/dayjs.config.ts
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Schema } from 'mongoose';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Asia/Ho_Chi_Minh");

const TimezonePlugin = (schema: Schema) => {
    schema.set('toJSON', {
        transform: function (doc, ret) {
            Object.keys(ret).forEach((key) => {
                if (ret[key] instanceof Date) {
                    ret[key] = dayjs(ret[key])
                        .tz('Asia/Ho_Chi_Minh')
                        .format('YYYY-MM-DD HH:mm:ss');
                }
            });
            return ret;
        },
    });
}

export { dayjs as dayjsConfig, TimezonePlugin };

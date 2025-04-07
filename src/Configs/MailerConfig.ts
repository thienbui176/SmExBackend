import * as env from 'dotenv';
env.config();

export default () => ({
    MAILER_EMAIL: process.env.MAILER_EMAIL,
    MAILER_EMAIL_PASSWORD: process.env.MAILER_EMAIL_PASSWORD,
});

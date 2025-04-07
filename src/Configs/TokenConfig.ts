import * as env from 'dotenv';
env.config();

export default () => ({
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    TOKEN_VERIFY_EMAIL_SECRET: process.env.TOKEN_VERIFY_EMAIL_SECRET
});

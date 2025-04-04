import * as env from 'dotenv'
env.config()

export default () => ({
    MONGODB_URL: process.env.MONGODB_URL
})
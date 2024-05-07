
import dotenv from 'dotenv';

dotenv.config()

export default {
    port: process.env.SERVER_PORT,
    mongoUrl: process.env.MONGO_URL,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD
};
export const envConfig = () => ({
    database: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiration: process.env.JWT_EXPIRATION,
    },
    port: parseInt(process.env.PORT || '3000', 10),
    environment: process.env.NODE_ENV,
});

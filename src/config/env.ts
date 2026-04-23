const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'PORT'
];

requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required env variable: ${key}`);
    }
});

export const env = {
    databaseUrl: process.env.DATABASE_URL!,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET!,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
    jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    port: parseInt(process.env.PORT || '5000'),
    nodeEnv: process.env.NODE_ENV || 'development',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
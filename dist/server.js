import 'dotenv/config';
import app from './app.js';
import { env } from './config/env.js';
app.listen(env.port, () => {
    console.log(`Modi backend running on port ${env.port}`);
    console.log(`Environment: ${env.nodeEnv}`);
    console.log(`Health check: http://localhost:${env.port}/health`);
});
//# sourceMappingURL=server.js.map
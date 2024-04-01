import config from '@/config';
import { createClient } from './client';

const client = createClient(config.API_USER_URL);

const UserService = {
    async register(data: any) {
        return await client.post('/register', data);
    },

    async login() {
        return await client.post('/login');
    },
};

export { UserService };
import axios from 'axios';

async function testUsersAPI() {
    try {
        console.log('1. Logging in as admin...');
        const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
            email: 'admin@catalogue.com',
            password: 'admin1234'
        }, {
            withCredentials: true
        });
        
        console.log('Login success:', loginRes.data.user);
        const token = loginRes.data.token;
        console.log('Token:', token.substring(0, 50) + '...');
        
        // Extract cookie
        const cookies = loginRes.headers['set-cookie'];
        console.log('Cookies:', cookies);
        
        console.log('\n2. Fetching users...');
        const usersRes = await axios.get('http://localhost:3000/api/users', {
            headers: {
                'Cookie': cookies ? cookies[0] : `token=${token}`
            }
        });
        
        console.log('Users found:', usersRes.data.length);
        console.log('Users:', JSON.stringify(usersRes.data, null, 2));
        
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
    }
}

testUsersAPI();

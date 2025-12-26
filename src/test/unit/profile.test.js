const request = require('supertest')
const createApp = require('../../app')
const {pool , initDatabase} = require('../../config/database')

//GET /profile tests
// Get profile with valid token
// Get profile without token

//PUT / profile tests
// Update password successfully
// Update password with invalid input


describe('Profile API endpoints' , () => {
    let app ;
    let token ;

    const testUser = {
        email: `profile_${Date.now()}@example.com`,
        password: 'TestPassword123!',
        firstname: 'Test',
        lastname: 'User'
    };

    beforeAll(async () => {
        await initDatabase();
        app = createApp();

        // 1. Kayıt Ol
        await request(app)
            .post('/auth/register')
            .send(testUser);

        // 2. Login Ol
        const loginRes = await request(app)
            .post('/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        if (loginRes.body && loginRes.body.data) {
            token = loginRes.body.data.token;
        } else {
            throw new Error("Login başarısız oldu, token alınamadı!");
        }
    });

    afterAll(async () => {
        await pool.end(); // Test bittiğinde bağlantıyı kapat
    });
   


    // GET PROFILE tests

    describe('GET /profile' , () => {
        it('should return user profile with valid token' , async () => {
            const response = await request(app)
            .get('/profile')
            .set('Authorization' , `Bearer ${token}`)
            .expect(200) ;

            expect(response.body).toHaveProperty('success' , true)
            expect(response.body.data.user).toHaveProperty('email' , testUser.email)
        })

        it('should fail without token' , async () => {
            const response = await request(app)
            .get('/profile')
            .expect(401) ;

            expect(response.body).toHaveProperty('success' , false)
        })
    })

    // PUT PROFILE tests

    describe('PUT /profile' , () => {
        it('should update password successfully' , async () => {
            const response = await request(app)
            .put('/profile')
            .set('Authorization' , `Bearer ${token}`)
            .send({password : "newpassword12345"})
            .expect(200) ;

            expect(response.body).toHaveProperty('success' , true)
            expect(response.body).toHaveProperty('message')

        })

        it('should fail with short password' , async () => {
            const response = await request(app)
            .put('/profile')
            .set('Authorization' , `Bearer ${token}`)
            .send({password : '123'})
            .expect(400) ;

            expect(response.body).toHaveProperty('success' , false)
        })
    })
})
const request = require('supertest')

const createApp = require('../../app')
const { pool, initDatabase } = require('../../config/database')
// Test Suite - Authentication endpoint testleri

describe('Auth API Endpoint', () => {
    let app;

    // beforeAll - butun testlerden evvel 1 defe isleyir
    beforeAll(async () => {
        await initDatabase()
        app = createApp()
    })

    // afterAll - butun testler bitdikden sonra 1 defe isleyir
    afterAll(async () => {
        await pool.end() // database-in islemesini dayandiririq
    })

    // afterEach - her testden sonra isleyir
    afterEach(async () => {
        // test-lerden sonra test datalarini temizleyirik
        // test% ile basliyan butun email-leri silirik
        await pool.query("delete from users where email like 'test%'")
    })

    // post auth/register endpoint test-i
    describe('POST /auth/register', () => {
        const validUser = {
            email: 'test@examle.com',
            password: 'test123!@#',
            firstName: 'Test',
            lastName: 'User'
        }

        // Test1: Yeni user-in qeydiyyatdan kecirmek
        it('should register a new user succesfully', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send(validUser)
                .expect(201)

            expect(response.body).toHaveProperty('succes', true)
            expect(response.body).toHaveProperty('data')
            expect(response.body.data).toHaveProperty('token')
            expect(response.body.data).toHaveProperty('email', validUser.email)
            expect(response.body.data).not.toHaveProperty('password')
        })

        // Test2: Email olmadan qeydiyyat xeta verilmelidir
        it('should fail with missing email', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send(...validUser, email.undefined)
                .expect(400)

            expect(response.body).toHaveProperty('succes', false)
            expect(response.body).toHaveProperty('errors')
        })

        // Test3: Yalnis email formati olarsa xeta vermelidi
        it('should fail wrong format email', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({ ...validUser, email: 'invalid-email' })
                .expect(400)

            expect(response.body).toHaveProperty('success', false)
        })

        // Test4: validation test
        it('should fail with weak password', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({ ...validUser, password: '123' })
                .expect(400)

            expect(response.body).toHaveProperty('success', false)
        })

        // Test5: Conflict test
        it('should fail when email already exists', async () => {
            await request(app).post('/auth/register').send(validUser)
            const response = await request(app)
                .post('/auth/register')
                .send(validUser)
                .expect(409)

            expect(response.body).toHaveProperty('success', false)
            expect(response.body).toHaveProperty('message')
        })
    })
})

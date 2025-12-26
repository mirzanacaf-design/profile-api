const request = require('supertest')
const createApp = require('../../app')

const {pool , initDatabase} =require('../../config/database');
const { email } = require('zod/v4');


describe('Auth API Endpoints' , () => {
    let app ;
    
    // beforeAll - Butun testlerden evvel 1 defe isleyir

    beforeAll(async () => {
        await initDatabase()
        app = createApp()
    })

    // afterAll - Butun testler bitdikden sonra 1 defe isleyir
    afterAll(async () => {
        await pool.end()
    })

    // afterEach - Her testden sonra isleyir 

    afterEach(async () => {
        await pool.query("DELETE FROM users WHERE email LIKE 'test%'")
    })

    // POST /auth/register ENDPOINT testleri

    describe('POST /auth/register' , () => {
        const validUser = {
            email : 'test@example.com' ,
            password : 'Test123@#' ,
            firstname : 'Test' ,
            lastname : 'User'
        }

        // TEST: Yeni istifadecini ugurla qeydiyyatdan kecirmek

        it('should register a new user successfully' , async () => {
            const response = await request(app)
            .post('/auth/register')
            .send(validUser)
            .expect(201)

            // Assertions - cavabi yoxlayiriq

            // Response successv: true

            expect(response.body).toHaveProperty('success' , true)

            // responseda  data property -si olmalidir
            expect(response.body).toHaveProperty("data")

            // Datada JWT token olmalidir
            expect(response.body.data).toHaveProperty('token')

            //
            expect(response.body.data.user).toHaveProperty('email' ,validUser.email )

            // onemli : password response-da olmamalidir
            expect(response.body.data.user).not.toHaveProperty('password')

        })

        // TEST 2  => Email olmadan qeydiyyat - xeta vermelidi

        it('should fail with missing email' , async() => {
            const response = await request(app)
            .post('/auth/register')
            .send({...validUser , email:undefined })
            .expect(400)
            expect(response.body).toHaveProperty('success' , false)
            expect(response.body).toHaveProperty('errors')

        })


        // TEST 3 => Yanlis email formati olarsa xeta vermelidi

        it('should fail with invalid email format' , async() =>{
            const response= await request(app)
            .post('/auth/register')
            .send({...validUser , email : 'invalid -email'})
            .expect(400)
            expect(response.body).toHaveProperty("success" , false)
        })

        // TEST 4 => Password

        it('should fail with weaker password' , async() => {
            const response = await request(app)
            .post('/auth/register')
            .send({...validUser , password : '123'})
            .expect(400)

            expect(response.body).toHaveProperty("success" , false)
        })

        // TEST 5 => movcud email ile qeydiyyat

        it('should fail when email already exists' , async () => {

            await request(app).post('/auth/register/').send(validUser)

            const response = await request(app)
            .post('/auth/register')
            .send(validUser)
            .expect(409)
            expect(response.body).toHaveProperty("success" , false)
            expect(response.body).toHaveProperty("message")

        })
    })
// LOGIN ENDPOINT -I UCUN TESTLER

// TESTS : 1.Successful login , 2.Login with wrong password , 3.Login with non-existing email , 4.Login without password

describe('POST /auth/login' , () => {

    const validUser = {
            email : 'test@example.com' ,
            password : 'Test123@#'
        }

    // ilk once user -i register edirik
    beforeEach(async () => {
          await request(app).post('/auth/register').send(validUser)  
    })

    it('should login successfully with right credentials' , async() => {
        const response = await request(app)
        .post('/auth/login')
        .send(validUser)
        .expect(200) ;

        expect(response.body).toHaveProperty('success' , true)
        expect(response.body.data).toHaveProperty('token')
        expect(response.body.data.user).toHaveProperty('email' , validUser.email)
    })

    // TEST 2 

    it('should fail with wrong password' , async () => {
        const response = await request(app)
        .post('/auth/login')
        .send({...validUser , password : 'WrongPassword'})
        .expect(401)

        expect(response.body).toHaveProperty('success' , false)
        expect(response.body).toHaveProperty('message')
    })

    // TEST 3

    it('should fail with no existing email' , async () => {
            const response = await request(app)
            .post('/auth/login')
            .send({
                email :"noemail@example.com" ,
                password : 'Test123@#'
            })
            .expect(401) ;

            expect(response.body).toHaveProperty('success' , false)

    })

    // TEST 4

    it('should fail with missing password' , async () => {
        const response = await request(app)
        .post('/auth/login')
        .send({email : validUser.email})
        .expect(400) ;

        expect(response.body).toHaveProperty('success' , false)


    } )
  
})

})









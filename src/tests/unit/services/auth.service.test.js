const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const AuthService = require('../../../services/authService')
const UserModel = require('../../../models/userModel')

// Mock (saxta) dependency-ler
jest.mock('bcrypt')
jest.mock('jsonwebtoken')
jest.mock('../../../models/userModel')


describe('AuthService Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('register', () => {
        const mockEmail = 'test@example.com'
        const mockPassword = 'Test123!@#'
        const mockHashedPassword = 'hashed_password'
        const mockUserId = 1

        it('should register a new User succesfully', async () => {
            // bu function cagirildiqda null qaytarsin ki bele User movcud deyil
            UserModel.findByEmail.mockResolvedValue(null)

            bcrypt.hash.mockResolvedValue(mockHashedPassword) // saxta hahslanmis sifre qaytarsin
            UserModel.create.mockResolvedValue({
                id: mockUserId,
                email: mockEmail,
                created_at: new Date()
            })
            jwt.sign.mockReturnValue('mock-jwt-token')
            const result = await AuthService.register(mockEmail, mockPassword)

            expect(UserModel.findByEmail).toHaveBeenCalledWith(mockEmail)
            expect(bcrypt.hash).toHaveBeenLastCalledWith(mockPassword, 10)
            expect(UserModel.create).toHaveBeenCalledWith(mockEmail, mockHashedPassword)
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: mockUserId, email: mockEmail },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            )
            expect(result).toHaveProperty('user')
            expect(result).toHaveProperty('token', 'mock-jwt-token')
            expect(result.user).toHaveProperty('email', mockEmail)
        })

        it('should throw error if user already exists', async () => {
            UserModel.findByEmail.mockResolvedValue({
                id: 1,
                email: mockEmail
            })

            await expect(AuthService.register(mockEmail, mockPassword))
                .rejects
                .toThrow('User with this email already exists')
            expect(UserModel.create).not.toHaveBeenCalled()
        })

        it('should have correct status code in error', async () => {
            UserModel.findByEmail.mockResolvedValue({ id: 1, email: mockEmail })
            try {
                await AuthService.register(mockEmail, mockPassword)
            } catch (err) {
                expect(err.statusCode).toBe(409)
            }
        })
    })

    describe('login', () => {
        const mockEmail = 'test@example.com'
        const mockPassword = 'Test123!@#'
        const mockHashedPassword = 'hashed_password'
        const mockUserId = 1
        it('should login succesfully', async () => {
            UserModel.findByEmail.mockResolvedValue({
                id: mockUserId,
                email: mockEmail,
                password: mockHashedPassword
            })
            bcrypt.compare.mockResolvedValue(true)
            jwt.sign.mockReturnValue('mock-jwt-token')
            const result = await AuthService.login(mockEmail, mockPassword)
            expect(UserModel.findByEmail).toHaveBeenCalledWith(mockEmail)
            expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockHashedPassword)
            expect(result).toHaveProperty('user')
            expect(result).toHaveProperty('token', 'mock-jwt-token')
        })
    })
})

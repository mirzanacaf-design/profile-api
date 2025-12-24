const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const dotenv = require('dotenv');
// const { options } = require('../routes/authRoutes');

dotenv.config()

/**
 * Authentication Service
 * Contains business logic for authentication operations
 */
class AuthService {
  /**
   * Register a new user
   * @param {string} email - User's email
   * @param {string} password - User's plain password
   * @returns {Promise<Object>} User data and JWT token
   * @throws {Error} If user already exists
   */
  static async register(email, password) {
    // TODO: Step 1 - Check if user already exists
    // Call UserModel.findByEmail(email)
    // If user exists, throw an error with statusCode 409
    // Error message: 'User with this email already exists'

    // TODO: Step 2 - Hash the password
    // Use bcrypt.hash(password, saltRounds) where saltRounds = 10
    // Store result in hashedPassword variable

    // TODO: Step 3 - Create the user in database
    // Call UserModel.create(email, hashedPassword)
    // Store result in newUser variable

    // TODO: Step 4 - Generate JWT token
    // Call this.generateToken(newUser.id, newUser.email)
    // Store result in token variable

    // TODO: Step 5 - Return user data and token
    // Return object with: { user: { id, email, created_at }, token }


    // STEP 1

    const existingUser = await UserModel.findByEmail(email)
    if(existingUser) {
      const err = new Error("User with this email already exists")
      err.statusCode = 409 ;
      throw err
    }

    // STEP 2
    const hashedPassword = await bcrypt.hash(password, 10)

    // STEP 3
    const newUser = await UserModel.create(email, hashedPassword)

    // STEP 4
    const token = this.generateToken(newUser.id , newUser.email)

    // STEP 5
    return {
      user : {
        id :newUser.id ,
        email : newUser .email ,
        created_at : newUser.created_at
      } ,
      token
    }
  }

  /**
   * Login user
   * @param {string} email - User's email
   * @param {string} password - User's plain password
   * @returns {Promise<Object>} User data and JWT token
   * @throws {Error} If credentials are invalid
   */
  static async login(email, password) {
    // TODO: Step 1 - Find user by email
    // Call UserModel.findByEmail(email)
    // If user not found, throw error with statusCode 401
    // Error message: 'Invalid email or password'

    // TODO: Step 2 - Verify password
    // Use bcrypt.compare(password, user.password)
    // If password invalid, throw error with statusCode 401
    // Error message: 'Invalid email or password'

    // TODO: Step 3 - Generate JWT token
    // Call this.generateToken(user.id, user.email)
    // Store result in token variable

    // TODO: Step 4 - Return user data and token
    // Return object with: { user: { id, email }, token }

    // STEP 1

    const user = await  UserModel.findByEmail(email)
    if(!user){
      const err =  new Error ("Invalid email or password")
      err.statusCode = 401 
      throw err
    }

    // STEP 2
    const isPasswordValid = await bcrypt.compare(password , user.password)
    if(!isPasswordValid){
      const err =  new Error("Invalid email or password")
      err.statusCode = 401 
      throw err
    }

    // STEP 3 
    const token = this.generateToken(user.id , user.email)

    // STEP 4 
    return {
      user : {
        id : user.id ,
        email : user.email
      } ,
      token
    }
  }

  // STEP 2 

  /**
   * Generate JWT token
   * @param {number} id - User's ID
   * @param {string} email - User's email
   * @returns {string} JWT token
   * @private
   */
  static generateToken(id, email) {
    // TODO: Generate and return JWT token
    // Use jwt.sign() with payload { id, email }
    // Secret: process.env.JWT_SECRET
    // Options: { expiresIn: process.env.JWT_EXPIRES_IN }

    return jwt.sign(
      {id , email} ,
      process.env.JWT_SECRET ,
      {expiresIn : process.env.JWT_EXPIRES_IN}
    )
  }
}

module.exports = AuthService;

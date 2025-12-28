require('dotenv').config({ path: '.env.test' })
process.env.NODE_ENV = 'test'

jest.setTimeout(10000);

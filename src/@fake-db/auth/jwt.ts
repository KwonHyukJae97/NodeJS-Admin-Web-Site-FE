// ** JWT import
import jwt from 'jsonwebtoken'

// ** Mock Adapter
import mock from 'src/@fake-db/mock'

// ** Types
import { UserDataType } from 'src/context/types'

const users: UserDataType[] = [
  // {
  //   id: 1,
  //   role: 'admin',
  //   password: 'admin',
  //   nickname: 'John Doe',
  //   name: 'johndoe',
  //   email: 'admin@materialize.com'
  // },
  // {
  //   id: 2,
  //   role: 'client',
  //   password: 'client',
  //   nickname: 'Jane Doe',
  //   name: 'janedoe',
  //   email: 'client@materialize.com'
  // }
]

// ! These two secrets should be in .env file and not in any other file

// mock.onPost('/jwt/login').reply(request => {
//   const { email, password } = JSON.parse(request.data)
//
//   let error = {
//     email: ['Something went wrong']
//   }
//
//   const user = users.find(u => u.email === email && u.password === password)
//
//   if (user) {
//     const accessToken = jwt.sign({ id: user.id }, jwtConfig.secret)
//
//     const response = {
//       accessToken
//     }
//
//     return [200, response]
//   } else {
//     error = {
//       email: ['email or Password is Invalid']
//     }
//
//     return [400, { error }]
//   }
// })

// mock.onPost('/jwt/register').reply(request => {
//   if (request.data.length > 0) {
//     const { email, password, name } = JSON.parse(request.data)
//     const isEmailAlreadyInUse = users.find(user => user.email === email)
//     const isUsernameAlreadyInUse = users.find(user => user.name === name)
//     const error = {
//       email: isEmailAlreadyInUse ? 'This email is already in use.' : null,
//       name: isUsernameAlreadyInUse ? 'This name is already in use.' : null
//     }
//
//     if (!error.name && !error.email) {
//       const { length } = users
//       let lastIndex = 0
//       if (length) {
//         lastIndex = users[length - 1].id
//       }
//       const userData = {
//         id: lastIndex + 1,
//         email,
//         password,
//         name,
//         avatar: null,
//         nickname: '',
//         role: 'admin'
//       }
//
//       users.push(userData)
//
//       const accessToken = jwt.sign({ id: userData.id }, jwtConfig.secret)
//
//       const user = { ...userData }
//       delete user.password
//
//       const response = { accessToken }
//
//       return [200, response]
//     }
//
//     return [200, { error }]
//   } else {
//     return [401, { error: 'Invalid Data' }]
//   }
// })

mock.onGet('/auth/me').reply(config => {
  // @ts-ignore
  const token = config.headers.Authorization as string

  // get the decoded payload and header
  const decoded = jwt.decode(token, { complete: true })

  if (decoded) {
    // @ts-ignore
    const { id: userId } = decoded.payload

    const userData = JSON.parse(JSON.stringify(users.find((u: UserDataType) => u.id === userId)))

    delete userData.password

    return [200, { userData }]
  } else {
    return [401, { error: { error: 'Invalid User' } }]
  }
})

export interface AuthResponse {
  ok: boolean,
  user?: User,
  uid?: string,
  // name?: string,
  token?: string,
  msg?: string
}

// export interface User {
//   uid?: string,
//   name?: string,
//   lastName?: string,
//   lol?: string
// }



export interface User {
  uid: string,
  name: string,
  lastName?: string,
  email?: string,
  address?: string,
  city?: string,
  country?: string,
  postalCode?: number,
  about?: string,
  lol?: string
}

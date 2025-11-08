import { jwtDecode } from 'jwt-decode'
import { backendUrl, cloud } from '../pages/Device/Cloud/CloudComponents'

const login = async (search: string) => {
  await fetch(`${backendUrl}/auth/github/callback?${search}`)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`Couldn't login to Strapi. Status: ${res.status}`)
      }
      return res
    })
    .then((res) => res.json())
    .then(async (res) => {
      localStorage.setItem('ledfx-cloud-jwt', res.jwt)
      localStorage.setItem('ledfx-cloud-username', res.user.username)

      // Decode the JWT and get the expiry time
      const decodedJwt = jwtDecode(res.jwt)
      const expiryTime = decodedJwt.exp || 0

      // Store the expiry time
      localStorage.setItem('ledfx-cloud-jwt-expiry', expiryTime.toString())

      const me = await cloud.get('users/me')
      const user = await me.data
      localStorage.setItem('ledfx-cloud-userid', user.id)
      localStorage.setItem('ledfx-cloud-role', user.role.type)
      // setTimeout(() => {
      //   return isElectron() ? window.close() : history('/devices')
      // }, 2000)
    })
    .catch((err) => {
      console.log(err)
    })
}

export default login

import axios from 'axios'

const useMocks = import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS !== 'false'
const baseURL = useMocks ? '/' : import.meta.env.VITE_API_BASE_URL

const client = axios.create({
  baseURL,
  withCredentials: true,
})
// …interceptors stay the same
export default client

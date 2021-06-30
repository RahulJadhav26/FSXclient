import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: 'http://54.225.25.229:5005/'
    // baseURL: 'http://localhost:5005/'
  })
}

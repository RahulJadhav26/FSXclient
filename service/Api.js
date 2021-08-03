import axios from 'axios'

export default () => {
  return axios.create({
  // Rahul
    // baseURL: 'http://44.192.63.76:5005/'
  //  Sid
    baseURL: 'http://3.82.28.66:5005/'
    // baseURL: 'http://localhost:5005/'
  })
}

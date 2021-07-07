import axios from 'axios'

export default () => {
  return axios.create({
  // Rahul
    // baseURL: 'http://44.192.63.76:5005/'
  //  Sid
    baseURL: 'http://54.225.25.229:5005/'
    // baseURL: 'http://localhost:5005/'
  })
}

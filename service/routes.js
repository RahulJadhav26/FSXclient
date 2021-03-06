import Api from './Api'

export default {
  describeFileSystem () {
    return Api().get('/fsx/list')
  },
  deleteFileSystem (FileSystemId) {
    return Api().get('/fsx/delete', { params: { FileSystemId: FileSystemId } })
  },
  createFileSystem (params) {
    return Api().post('/fsx/create', params)
  },
  listBuckets () {
    return Api().get('/s3/list')
  },
  listec2 () {
    return Api().get('/ec2/list')
  },
  mountFileSystem (params) {
    console.log('send command Requested')
    return Api().post('/ssm/sendCommand', params)
  },
  listFileSystemById (params) {
    return Api().post('/fsx/list', params)
  },
  createDynamoDb (params) {
    return Api().post('/dynamodb/create', params)
  },
  listDynamoDb (params) {
    return Api().post('/dynamodb/list', params)
  },
  deleteDynamoDb (params) {
    return Api().post('dynamodb/delete', params)
  }
}

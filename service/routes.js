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
  }
}

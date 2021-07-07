<template>
  <v-container>
    <!-- {{FileSystem}} -->
    <!-- {{selected[0].FileSystemId}} -->
    <v-card style="border-radius:1.7rem; border:2px solid grey" class="shadow-lg">
      <h4 class="text-center pt-5 mt-5">Lustre File System List</h4>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-toolbar
    flat>
        <v-spacer></v-spacer>
        <v-btn :disabled='checkDel' class="mr-5" @click="Delete(selected[0].FileSystemId)">Delete</v-btn>
       <router-link tag='v-btn' to='/create'> <v-btn class="mr-5">Create</v-btn></router-link>
        <v-btn @click="list()"><v-icon>mdi-restore</v-icon></v-btn>
      </v-toolbar>
      <div class="text-center m-5">
          <v-progress-circular
          :indeterminate='loading'
          v-if="loading"
          color="primary"
        ></v-progress-circular>
      </div>
    <v-data-table
      v-if="!loading"
      v-model="selected"
      :headers="headers"
      :items="FileSystem"
      show-select
      item-key="FileSystemId"
      single-select
      :search="search"
    >
    <template v-slot:item.Lifecycle="{ item }">
      <v-chip
        :color="getColor(item.Lifecycle)"
      >
        {{ item.Lifecycle }}
      </v-chip>
    </template>
    <template v-slot:item.S3bucket ="{ item }">
      <tr >
        <td style="width:400px;">{{item.S3bucket}}<v-btn class="float-right" v-if="item.S3bucketBoolean"  icon v-clipboard="item.LustreConfiguration.DataRepositoryConfiguration.ImportPath"><v-icon>mdi-content-copy</v-icon></v-btn></td>
        </tr>
    </template>
    <template v-slot:item.Tags ="{ item }">
      <ul v-for="i in item.Tags" :key="i.Key" >
        <li>{{i.Key}} : {{i.Value}}</li>
      </ul>
    </template>
    </v-data-table>
  </v-card>
  </v-container>
</template>

<script>
import routes from '../../service/routes'
export default {
  name: 'FileSystem',
  data () {
    return {
      search: '',
      FileSystem: [],
      selected: [],
      S3bucketBoolean: false,
      loading: false,
      headers: [
        {
          text: 'Lustre File System name',
          align: 'start',
          value: 'FileSystemName'
        },
        {
          text: 'S3 Bucket name',
          align: 'start',
          value: 'S3bucket'
        },
        {
          text: 'File system ID',
          align: 'start',
          value: 'FileSystemId'
        },
        { text: 'Deployment Type', value: 'DeploymentTypeCustom' },
        { text: 'Lifecycle', value: 'Lifecycle' },
        { text: 'Storage Capacity', value: 'StorageCapacity' },
        { text: 'Storage Type', value: 'StorageType' },
        { text: 'Tags', value: 'Tags' },
        { text: 'Creation Time', value: 'CreationTime' }
      ]
    }
  },
  computed: {
    checkDel () {
      if (this.selected.length === 0) {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    this.loading = true
    this.list()
    // routes.describeFileSystem().then(data => {
    //   this.FileSystem = data.data.FileSystems
    //   if (this.FileSystem.length === 0) {
    //     console.log('zero')
    //     this.loading = false
    //   } else {
    //     for (var i in this.FileSystem) {
    //       this.FileSystem[i].DeploymentTypeCustom = this.FileSystem[i].LustreConfiguration.DeploymentType
    //       if (Object.keys(this.FileSystem[i].LustreConfiguration).includes('DataRepositoryConfiguration')) {
    //         var S3bucket = this.FileSystem[i].LustreConfiguration.DataRepositoryConfiguration.ImportPath
    //         var arr = S3bucket.split('/')
    //         this.FileSystem[i].S3bucket = arr[2]
    //         this.FileSystem[i].S3bucketBoolean = true
    //         this.loading = false
    //       } else {
    //         this.FileSystem[i].S3bucket = ''
    //         this.FileSystem[i].S3bucketBoolean = false
    //         this.loading = false
    //       }
    //       if (this.FileSystem[i].Tags.length === 0) {
    //         console.log('No Tags')
    //         this.loading = false
    //       } else {
    //         this.FileSystem[i].FileSystemName = this.FileSystem[i].Tags[0].Value
    //         this.loading = false
    //       }
    //     }
    //   }
    // })
  },
  methods: {
    getColor (data) {
      if (data === 'CREATING') {
        return 'orange'
      }
      if (data === 'AVAILABLE') {
        return 'green'
      }
      if (data === 'DELETING') {
        return 'red'
      }
    },
    list () {
      this.loading = true
      routes.describeFileSystem().then(data => {
        this.FileSystem = data.data.FileSystems
        if (this.FileSystem.length === 0) {
          console.log('zero')
          this.loading = false
        } else {
          for (var i in this.FileSystem) {
            this.FileSystem[i].DeploymentTypeCustom = this.FileSystem[i].LustreConfiguration.DeploymentType
            if (Object.keys(this.FileSystem[i].LustreConfiguration).includes('DataRepositoryConfiguration')) {
              console.log(this.FileSystem[i].LustreConfiguration)
              console.log('bucket found')
              var S3bucket = this.FileSystem[i].LustreConfiguration.DataRepositoryConfiguration.ImportPath
              var arr = S3bucket.split('/')
              this.FileSystem[i].S3bucket = arr[2]
              this.FileSystem[i].S3bucketBoolean = true
              this.loading = false
            } else {
              console.log('bucket not found')
              this.FileSystem[i].S3bucket = ''
              this.FileSystem[i].S3bucketBoolean = false
              this.loading = false
            }
            for (var j in this.FileSystem[i].Tags) {
              if (this.FileSystem[i].Tags[j].Key === 'Name') {
                this.FileSystem[i].FileSystemName = this.FileSystem[i].Tags[j].Value
              }
            }
            console.log(this.FileSystem)
          }
        }
      })
    },
    Delete (id) {
      console.log(this.selected.length)
      if (this.selected[0].Lifecycle === 'DELETING') {
        alert('Please Wait it is already in the Process of Deleting')
      } else {
        routes.deleteFileSystem(id).then(data => {
          console.log(data)
          this.list()
        })
      }
    }
  }
}
</script>

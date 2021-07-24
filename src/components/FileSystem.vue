<template>
<div>
  <!-- {{ec2servers[0]}} -->
  <!-- {{FileSystem}} -->
  <!-- {{selected[0].FileSystemId}} -->
  <!-- {{selected}} -->
  <v-card style="box-shadow: none;" class="d-flex justify-center ">
    <v-card style="width:95%; border-radius:1.7rem; border:2px solid grey" class="shadow-lg mt-2 justify-center">
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
         <v-dialog
      v-model="dialog"
      scrollable
      max-width="1000px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          class="mr-5"
          :disabled='checkDel'
        >
          Mount
        </v-btn>
      </template>
      <v-card style="height:500px;">
        <v-card-title>Select EC2 Server</v-card-title>
        <v-alert v-if='checkInstance' type="warning">Please select Instances in only "Running" State to mount the FSX File System</v-alert>
        <v-divider></v-divider>
        <v-card-text >
          <v-text-field
              v-model="searchInstance"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
            <v-data-table
              v-model="selectedInstance"
              :headers="headersEC2"
              :items="ec2servers"
              item-key="customInstanceId"
              show-select
              :search="searchInstance"
              class="elevation-1"
            >
            <template v-slot:item.state="{ item }">
              <v-chip
                :color="getColor(item.state)"
              >
                {{ item.state }}
              </v-chip>
            </template>
            </v-data-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            :disabled ='checkInstance'
            @click="mount(selected[0].FileSystemId, selectedInstance)"
          >
            Mount
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      {{item.Tags[0].Value}}
    </template>
    </v-data-table>
  </v-card>
  </v-card>
  </div>
</template>

<script>
import routes from '../../service/routes'
export default {
  name: 'FileSystem',
  data () {
    return {
      selectedInstance: [],
      searchInstance: '',
      dialog: false,
      MountMessage: '',
      search: '',
      ec2servers: [],
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
        { text: 'Key', value: 'Tags' },
        { text: 'Creation Time', value: 'CreationTime' },
        { text: 'Mounted On', value: 'mount_InstanceIds' },
        { text: 'Mount Path', value: 'mounted_path' },
        { text: 'Mount Created Time', value: 'mount_created_on' }
      ],
      headersEC2: [
        { text: 'Instance Id', value: 'customInstanceId' },
        { text: 'Server Name ', value: 'serverName' },
        { text: 'Application Tag', value: 'customTag' },
        { text: 'Private IP', value: 'customPrivateIP' },
        { text: 'Instance state', value: 'state' }
      ]
    }
  },
  computed: {
    checkDel () {
      if (this.selected.length === 0 || this.selected[0].S3bucketBoolean === false) {
        return true
      } else {
        return false
      }
    },
    checkInstance () {
      var status = true
      for (var i in this.selectedInstance) {
        if (this.selectedInstance[i].state === 'stopped') {
          status = true
          break
        } else {
          status = false
        }
      }
      return status
    }
  },
  created () {
    this.loading = true
    this.list()
    this.listec2()
  },
  methods: {
    getColor (data) {
      if (data === 'CREATING') {
        return 'orange'
      }
      if (data === 'AVAILABLE' || data === 'running') {
        return 'green'
      }
      if (data === 'DELETING' || data === 'stopped') {
        return 'red'
      }
    },
    listec2 () {
      routes.listec2().then(data => {
        var EC2servers = data.data.Reservations
        EC2servers.forEach(obj => {
          // if (obj.Instances[0].State.Name === 'running') {
          obj.customPrivateIP = obj.Instances[0].PrivateIpAddress
          obj.state = obj.Instances[0].State.Name
          obj.customInstanceId = obj.Instances[0].InstanceId
          obj.Instances[0].Tags.forEach(tag => {
            if (tag.Key === 'Name') {
              obj.serverName = tag.Value
            }
            if (tag.Key === 'Application') {
              if (tag.Value.startsWith('parallelcluster')) {
                obj.customTag = tag.Value
                this.ec2servers.push(obj)
              }
            }
          })
          // }
        })
      })
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
    },
    mount (FileSystemId, Instances) {
      var InstanceIds = []
      for (var i in Instances) {
        InstanceIds.push(Instances[i].customInstanceId)
      }
      console.log(InstanceIds)
      console.log(FileSystemId)
      var fsx = {
        FileSystemIds: [FileSystemId]
      }
      routes.listFileSystemById(fsx).then(fsx => {
        console.log(fsx.data.FileSystems[0].LustreConfiguration.MountName)
        var MountName = fsx.data.FileSystems[0].LustreConfiguration.MountName
        var params = {
          DocumentName: 'AWS-RunShellScript',
          DocumentVersion: '1',
          InstanceIds: InstanceIds,
          Parameters: {
            commands: ['sudo mkdir /krios_data', 'sudo mount -t lustre -o noatime,flock ' + FileSystemId + '.fsx.us-east-1.amazonaws.com@tcp:/' + MountName + ' /krios_data']
          }
        }
        console.log(params)
        // routes.mountFileSystem(params).then(data => {
        //   console.log(data)
        // }).then()
        var item = {
          fileSystemId: FileSystemId,
          InstanceIds: InstanceIds,
          mounted_path: fsx.data.FileSystems[0].LustreConfiguration.DataRepositoryConfiguration.ImportPath,
          created_on: new Date().toString()
        }
        routes.createDynamoDb(item).then(data => {
          console.log(data)
        })
      })
    }
  }
}
</script>

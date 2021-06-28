<template>
  <v-container>
    <!-- {{FileSystem}} -->
    <!-- {{selected[0].FileSystemId}} -->
    <v-card>
      <h1 class="text-center">FSX File System</h1>
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
      loading: false,
      headers: [
        {
          text: 'File System name',
          align: 'start',
          value: 'FileSystemName'
        },
        {
          text: 'DNS name',
          align: 'start',
          value: 'DNSName'
        },
        {
          text: 'File system ID',
          align: 'start',
          value: 'FileSystemId'
        },
        { text: 'File System Type', value: 'FileSystemType' },
        { text: 'Lifecycle', value: 'Lifecycle' },
        { text: 'Storage Capacity', value: 'StorageCapacity' },
        { text: 'Storage Type', value: 'StorageType' },
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
    routes.describeFileSystem().then(data => {
      this.FileSystem = data.data.FileSystems
      if (this.FileSystem.length === 0) {
        console.log('zero')
        this.loading = false
      } else {
        for (var i in this.FileSystem) {
          console.log(this.FileSystem[i])
          if (this.FileSystem[i].Tags.length === 0) {
            console.log('No Tags')
            this.loading = false
          } else {
            this.FileSystem[i].FileSystemName = this.FileSystem[i].Tags[0].Value
            this.loading = false
          }
        }
      }
    })
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
            console.log(this.FileSystem[i])
            if (this.FileSystem[i].Tags.length === 0) {
              console.log('No Tags')
              this.loading = false
            } else {
              this.FileSystem[i].FileSystemName = this.FileSystem[i].Tags[0].Value
              this.loading = false
            }
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

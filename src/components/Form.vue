,<template>
  <v-app>
      {{test}}
      <v-container style="width:70%">
      <v-form>
           <strong> File System Name</strong>
          <v-text-field
            outlined
            clearable
            v-model="FileSystemName"
        ></v-text-field>
      <strong> Deployment Type & Storage Type</strong>
        <v-container fluid>
            <v-radio-group
            v-model="DeploymentVal"
            mandatory
            >
            <!-- {{DeploymentCheck}} -->
            <v-radio
                label="Persistent, SSD"
                value= 0
                @click="DeploymentCheck = !DeploymentCheck"
            ></v-radio>
            <v-radio
                label="Scratch, SDD"
                @click="DeploymentCheck = !DeploymentCheck"
                value= 1
            ></v-radio>
            </v-radio-group>
        </v-container>
        <v-container v-if="!DeploymentCheck" fluid>
        <strong>Throughput per unit of storage</strong>
            <br>
        <p>Throughput (MB/s) per unit of storage (TiB)</p>
            <!-- <p>{{ PerUnitStorageThroughput || 'null' }}</p> -->
            <v-radio-group
            v-model="PerUnitStorageThroughput"
            mandatory
            >
            <v-radio
                label="50 MB/s/TiB (up to 1.3 GB/s/TiB burst)"
                value= 50
            ></v-radio>
            <v-radio
                label="100 MB/s/TiB (up to 1.3 GB/s/TiB burst)"
                value= 100
            ></v-radio>
            <v-radio
                label="200 MB/s/TiB (up to 1.3 GB/s/TiB burst)"
                value= 200
                active
            ></v-radio>
            </v-radio-group>
        </v-container>
       <strong>Storage Capacity</strong>
        <v-text-field
            suffix="TiB"
            hint="Supported sizes: 1.2 TiB or increments of 2.4 TiB"
            outlined
            clearable
            :rules="rules.storageCheck"
            v-model="StorageCapacity"
        ></v-text-field>
        <strong>Subnet ID</strong>
        <v-select
          v-model="subnetId[0]"
          :items="subnetIds"
          v-bind="subnetIds[0]"
        ></v-select>
         <strong>Tags</strong>
         <!-- <v-btn class="float-right" @click="count+=count"> <v-icon>mdi-plus</v-icon></v-btn> -->
         <v-row class="mt-5" v-for="i in count" :key="i">
             <v-col
                cols="12"
                sm="6"
                md="6">
                 <v-text-field
                    outlined
                    placeholder="Key"
                    clearable
                    v-model="Tag.Key"
                ></v-text-field>
             </v-col>
             <v-col
                cols="12"
                sm="6"
                md="5">
                 <v-text-field
                    outlined
                    placeholder="Value"
                    v-model="Tag.Value"
                ></v-text-field>
             </v-col>
             <v-btn icon v-if="CheckClear()" @click="remove()" class="float-right mt-5"> <v-icon>mdi-close-thick</v-icon></v-btn>
          </v-row>
        <v-btn color="primary" @click="createFileSystem()">Create File System</v-btn>
      </v-form>
    </v-container>
  </v-app>
</template>

<script>
import routes from '../../service/routes'
export default {
  data () {
    return {
      FileSystemName: '',
      DeploymentCheck: false,
      DeploymentVal: 0,
      Deployment: [
        { DeploymentType: 'PERSISTENT_1', StorageType: 'SSD' },
        { DeploymentType: 'PERSISTENT_1', StorageType: 'SSD' }
      ],
      StorageCapacity: 0,
      Tag: { Key: '', Value: '' },
      subnetId: ['subnet-c04a349f'],
      subnetIds: ['subnet-c04a349f', 'subnet-21b7ca47', 'subnet-57d4ac76', 'subnet-dfcdc092', 'subnet-07dfe809'],
      count: 1,
      PerUnitStorageThroughput: 0,
      rules: {
        required: value => !!value || 'Required',
        storageCheck: [value => Number(value) <= 2.4 || 'Supported range is between 1.2 and 2.4',
          value => Number(value) >= 1.2 || 'Minimum should be 1.2'
        ]
      },
      test: ''
    }
  },
  methods: {
    CheckClear () {
      if (this.count === 1) {
        return false
      } else {
        return true
      }
    },
    remove () {
      this.count = this.count - 1
    },
    createFileSystem () {
      console.log(this.Deployment)
      var arrTags = [{ Key: 'name', Value: this.FileSystemName }]
      if (this.Tag.key) {
        arrTags.push(this.Tag)
      }
      if (this.Deployment[this.DeploymentVal].DeploymentType === 'PERSISTENT_1') {
        var obj = {
          FileSystemType: 'LUSTRE',
          StorageCapacity: Number(this.StorageCapacity) * 1000,
          StorageType: this.Deployment[this.DeploymentVal].StorageType,
          SubnetIds: this.subnetId,
          Tags: arrTags,
          LustreConfiguration: {
            DeploymentType: this.Deployment[this.DeploymentVal].DeploymentType,
            PerUnitStorageThroughput: this.PerUnitStorageThroughput
          }
        }
        this.test = obj
        routes.createFileSystem(obj).then(data => {
          console.log(data)
          alert('Created')
        })
      } else {
        var obj1 = {
          FileSystemType: 'LUSTRE',
          StorageCapacity: this.StorageCapacity,
          StorageType: this.Deployment[this.DeploymentVal].StorageType,
          SubnetIds: this.subnetId,
          Tags: arrTags,
          LustreConfiguration: {
            DeploymentType: this.Deployment[this.DeploymentVal].DeploymentType
          }
        }
        this.test = obj1
        routes.createFileSystem(obj1).then(data => {
          console.log(data)
          alert('Created')
        })
      }
    }
  }
}
</script>

<style>

</style>

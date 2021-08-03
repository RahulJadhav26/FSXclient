<template>
  <v-app>
      <v-container style="width:70%">
      <v-form>
           <strong> Lustre File System Name</strong>
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
            v-model="StorageCapacity"
        ></v-text-field>
        <p v-if="storageCheck" class="font-italic subtitle-2" style="color:red;">*Input the Correct Storage Capacity(Refer Hint)</p>
        <strong>Subnet ID</strong>
        <v-select
          v-model="subnetId[0]"
          :items="subnetIds"
        ></v-select>
         <strong>Import data from and export data to S3 <span class="font-italic">(Optional)</span></strong>
        <h5>Import Bucket</h5>
        <v-select
          v-model="importBucketPath"
          :items="buckets"
          label="Select your Bucket"
          placeholder="s3://my-bucket"
        ></v-select>
        <h5>Import prefix - optional</h5>
        <v-text-field
            outlined
            placeholder="s3-import-prefix/"
            hint="Start typing the path with slash for ex. /folder/file1/"
            clearable
            v-model="importPrefix"
        ></v-text-field>
         <strong>Tags</strong>
         <!-- <v-btn class="float-right" @click="count+=count"> <v-icon>mdi-plus</v-icon></v-btn> -->
         <v-row class="mt-5" v-for="i in Tags" :key="i.Key">
             <v-col
                cols="12"
                sm="6"
                md="6">
                 <v-text-field
                    placeholder="Key"
                    disabled
                    v-model="i.Key"
                ></v-text-field>
             </v-col>
             <v-col
                cols="12"
                sm="6"
                md="5">
                 <v-text-field
                    outlined
                    placeholder="Value"
                    v-model="i.Value"
                ></v-text-field>
             </v-col>
             <v-btn icon v-if="CheckClear()" @click="remove()" class="float-right mt-5"> <v-icon>mdi-close-thick</v-icon></v-btn>
          </v-row>
          <v-alert v-if="fsxCreated"
          type="success"
        >{{successMessage}}</v-alert>
        <v-alert v-if="fsxError"
          type="error"
        >{{errorMessage}}</v-alert>
        <v-btn class="mb-5" :disabled='creating' color="primary" @click="createFileSystem()">{{createButtonText}}</v-btn>
      </v-form>
    </v-container>
  </v-app>
</template>

<script>
import routes from '../../service/routes'
export default {
  data () {
    return {
      importBucketPath: '',
      importPrefix: '',
      FileSystemName: '',
      fsxCreated: false,
      fsxError: false,
      storageCheck: false,
      successMessage: '',
      errorMessage: '',
      DeploymentCheck: false,
      creating: false,
      createButtonText: 'Create File System',
      DeploymentVal: 0,
      Deployment: [
        { DeploymentType: 'PERSISTENT_1', StorageType: 'SSD' },
        { DeploymentType: 'SCRATCH_2', StorageType: 'SSD' }
      ],
      StorageCapacity: 0,
      Tags: [
        { Key: 'Key1', Value: 'Department1' },
        { Key: 'Key2', Value: 'Department2' },
        { Key: 'Key3', Value: 'Department3' },
        { Key: 'Key4', Value: 'Department4' }
      ],
      subnetId: ['subnet-8a82bfc1'],
      // Rahul
      // subnetIds: ['subnet-c04a349f', 'subnet-21b7ca47', 'subnet-57d4ac76', 'subnet-dfcdc092', 'subnet-07dfe809'],
      // Sid
      subnetIds: ['subnet-07795ee27423188c5', 'subnet-0a5a14746ae989877'],
      buckets: [''],
      count: 1,
      PerUnitStorageThroughput: 0,
      test: ''
    }
  },
  created () {
    this.fsxCreated = false
    this.fsxError = false
    this.storageCheck = false
    routes.listBuckets().then(data => {
      var Buckets = data.data
      for (var i in Buckets) {
        this.buckets.push(Buckets[i].Name)
      }
    })
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
      this.fsxCreated = false
      this.fsxError = false
      this.storageCheck = false
      this.creating = true
      this.createButtonText = 'Creating File System....'
      console.log(Number(this.StorageCapacity))
      console.log((Number(this.StorageCapacity) * 1000) % 24)
      if (Number(this.StorageCapacity) > 1.1 && Number(this.StorageCapacity) * 1000 % 24 === 0) {
        console.log(Number(this.StorageCapacity) % 2.4 === 0)
        console.log(this.Deployment)
        var arrTags = [{ Key: 'Name', Value: this.FileSystemName }]
        console.log(this.Tags)
        Array.prototype.push.apply(arrTags, this.Tags)
        console.log(arrTags)
        console.log(this.Tags)
        var obj = {
          FileSystemType: 'LUSTRE',
          StorageCapacity: Number(this.StorageCapacity) * 1000,
          StorageType: this.Deployment[this.DeploymentVal].StorageType,
          SubnetIds: this.subnetId,
          Tags: arrTags,
          LustreConfiguration: {
            DeploymentType: this.Deployment[this.DeploymentVal].DeploymentType
          }
        }
        console.log(obj)
        if (this.Deployment[this.DeploymentVal].DeploymentType === 'PERSISTENT_1') {
          obj.LustreConfiguration.PerUnitStorageThroughput = this.PerUnitStorageThroughput
        }
        if (this.importBucketPath) {
          obj.LustreConfiguration.ExportPath = 's3://' + this.importBucketPath + this.importPrefix
          obj.LustreConfiguration.ImportPath = 's3://' + this.importBucketPath + this.importPrefix
        }
        routes.createFileSystem(obj).then(data => {
          if (Object.keys(data.data).includes('FileSystem')) {
            this.fsxCreated = true
            this.successMessage = 'File System with FileSystemId ' + data.data.FileSystem.FileSystemId + ' is Created'
            this.creating = false
            this.createButtonText = 'Create File System'
          } else {
            this.fsxError = true
            this.errorMessage = data.data.message
            this.creating = false
            this.createButtonText = 'Create File System'
          }
        })
      } else {
        this.storageCheck = true
        this.fsxError = true
        this.errorMessage = 'File System Not Created'
        this.creating = false
        this.createButtonText = 'Create File System'
      }
    }
  }
}
</script>

<style>

</style>

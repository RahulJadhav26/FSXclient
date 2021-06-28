,<template>
  <v-app>
      <v-container>
          FileSystemName
      <v-form>
          <v-text-field
            v-model="message4"

            outlined
            clearable
        ></v-text-field>
        FileSystemType
        <v-text-field
            v-model="message4"
            outlined
            clearable
        ></v-text-field>
        StorageCapacity
        <v-text-field
            v-model="message4"

            outlined
            clearable
        ></v-text-field>
        VPC ID
        <v-text-field
            v-model="message4"

            outlined
            clearable
        ></v-text-field>
        Subnet ID
        <v-text-field
            v-model="message4"

            outlined
            clearable
        ></v-text-field>
        <v-btn color="primary">Create File System</v-btn>
      </v-form>
    </v-container>
  </v-app>
</template>

<script>
export default {

}
</script>

<style>

</style>

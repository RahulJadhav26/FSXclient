<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
          <h1 style="margin-left:37%"> Lustre File System Manager</h1>
      <v-spacer></v-spacer>
      <router-link to="/"><v-btn text>
        <span>All File System</span>
      </v-btn></router-link>
      <router-link to="/create"><v-btn text>
        <span>Create File System</span>
      </v-btn></router-link>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  })
}
</script>

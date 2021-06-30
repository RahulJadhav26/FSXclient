<template>
  <v-app>
    <!-- <v-app-bar
      app
      color="primary"
      dark
    >
        <div class="d-flex">
          <v-toolbar-title> Lustre File System Manager</v-toolbar-title>
        </div>
      <router-link to="/"><v-btn text>
        <span>All File System</span>
      </v-btn></router-link>
      <router-link to="/create"><v-btn text>
        <span>Create File System</span>
      </v-btn></router-link>
    </v-app-bar> -->
    <b-navbar class="navBorder" toggleable="lg" type="dark" variant="primary">
      <img src="img">
        <b-navbar-nav>
          <b-nav-item><h5 style="color:white;">Luster File System Manager</h5></b-nav-item>
     </b-navbar-nav>
     <b-navbar-toggle target="nav-collapse">
       <template #default="{ expanded }">
        <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
        <b-icon v-else icon="chevron-bar-down"></b-icon>
      </template>
     </b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-navbar-nav>
           <b-nav-item><router-link tag="button" to="/"><strong> <h5>All File System</h5></strong></router-link></b-nav-item>
           <b-nav-item><router-link tag="button" to="/create"><strong><h5>Create File System</h5></strong></router-link></b-nav-item>
        </b-navbar-nav>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
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
<style scoped>
.navBorder{
  border-bottom-left-radius: 0.7rem !important;
  border-bottom-right-radius: 0.7rem !important;
}
</style>

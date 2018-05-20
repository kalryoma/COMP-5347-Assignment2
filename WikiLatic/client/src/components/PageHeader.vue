<template>
  <v-app>
  <v-navigation-drawer v-model="drawer" clipped fixed app>
    <v-list dense>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>Overall</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>Individual</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>Author</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
  <v-toolbar app fixed clipped-left class="cyan" dark>
    <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
    <v-toolbar-title>WikiLatic</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat>Login</v-btn>
      <v-btn flat>Register</v-btn>
    </v-toolbar-items>

    <!--
    <v-toolbar-items>
      <v-btn v-if="!$store.state.isUserLoggedIn" flat dark :to="{
          name: 'login'
        }">
        Login
      </v-btn>

      <v-btn v-if="!$store.state.isUserLoggedIn" flat dark :to="{
          name: 'register'
        }">
        Sign Up
      </v-btn>

      <v-btn v-if="$store.state.isUserLoggedIn" flat dark @click="logout">
        Log Out
      </v-btn>
    </v-toolbar-items> -->
  </v-toolbar>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      drawer: false
    }),
    methods: {

    }
  }

</script>

<style scoped>
  .home {
    cursor: pointer;
  }

  .home:hover {
    color: #E9E;
  }

</style>

<template>
    <div id="app">
        <v-app>
            <v-navigation-drawer class="cyan" v-model="drawer" clipped fixed temporary app>
                <v-list dense>
                    <v-list-tile @click="$router.push('/analytics/overall');drawer=!drawer">
                        <v-list-tile-action>
                            <v-icon dark>assessment</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>
                                <a class="router">Overall</a>
                            </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile @click="$router.push('/analytics/individual');drawer=!drawer">
                        <v-list-tile-action>
                            <v-icon dark>inbox</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>
                                <a class="router">Individual</a>
                            </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile @click="$router.push('/analytics/author');drawer=!drawer">
                        <v-list-tile-action>
                            <v-icon dark>contacts</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>
                                <a class="router">Author</a>
                            </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-navigation-drawer>
            <v-toolbar app fixed clipped-left flat class="cyan" dark>
                <v-toolbar-side-icon v-if="$store.state.logged" @click.stop="drawer=!drawer"></v-toolbar-side-icon>
                <v-toolbar-title @click="$router.push('/')"><a class="router">WikiLatic</a></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items class="hidden-sm-and-down">
                    <v-btn v-if="!$store.state.logged" flat @click.stop="loginDialog=true">Login</v-btn>
                    <v-btn v-if="!$store.state.logged" flat @click.stop="registerDialog=true">Register</v-btn>
                    <v-btn v-if="$store.state.logged" flat>{{ $store.state.user }}</v-btn>
                    <v-btn v-if="$store.state.logged" flat @click="logout">Log Out</v-btn>
                    <v-dialog v-model="registerDialog" max-width="600px">
                        <register v-on:closeParent="registerDialog=false"/>
                    </v-dialog>
                    <v-dialog v-model="loginDialog"  max-width="600px">
                        <login v-on:closeParent="loginDialog=false"/>
                    </v-dialog>
                    <v-dialog v-model="msgDialog" persistent max-width="600px">
                        <v-card>
                            <v-card-text>
                                <div class="message" v-html="msg" />
                            </v-card-text>
                            <v-card-actions>
                                <v-btn flat color="primary" @click="close">Close</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar-items>
            </v-toolbar>
            <main>
                <router-view></router-view>
            </main>
        </v-app>
    </div>
</template>

<script>
    import auth from '@/services/auth';
    import register from '@/components/register';
    import login from '@/components/login';
    export default {
        data: () => ({
            registerDialog: false,
            loginDialog: false,
            msgDialog: false,
            drawer: false,
            msg: 'Logout Succeed!'
        }),
        name: 'app',
        methods: {
            logout () {
                this.msgDialog = true;
                this.$store.dispatch('setToken', null);
                this.$store.dispatch('setUser', null);
            },
            close(){
                this.msgDialog = false;
                this.$router.push("/");
            }
        },
        components: {
            register,
            login
        }
    }

</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
    .navigation-drawer>.list .list__tile{
        height: 50px;
    }
    .list__tile__content{
        margin: 0 10px;
    }
    .list__tile__title{
        font-size: 20px;
    }
    .router{
        color: white;
    }
</style>

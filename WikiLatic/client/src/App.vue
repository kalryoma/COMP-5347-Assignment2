<template>
    <div id="app">
        <v-app>
            <v-navigation-drawer v-model="drawer" clipped fixed app>
                <v-list dense>
                    <v-list-tile>
                        <v-list-tile-action>
                            <v-icon>assessment</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Overall</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                        <v-list-tile-action>
                            <v-icon>inbox</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Individual</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                        <v-list-tile-action>
                            <v-icon>contacts</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Author</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-navigation-drawer>
            <v-toolbar app fixed clipped-left class="cyan" dark>
                <v-toolbar-side-icon v-if="$store.state.logged" @click.stop="drawer=!drawer"></v-toolbar-side-icon>
                <v-toolbar-title>WikiLatic</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items class="hidden-sm-and-down">
                    <v-btn v-if="!$store.state.logged" flat @click.stop="loginDialog=true">Login</v-btn>
                    <v-btn v-if="!$store.state.logged" flat @click.stop="registerDialog=true">Register</v-btn>
                    <v-btn v-if="$store.state.logged" flat>{{ $store.state.user }}</v-btn>
                    <v-btn v-if="$store.state.logged" flat @click="logout">Log Out</v-btn>
                    <v-dialog v-model="registerDialog" max-width="600px"><register/></v-dialog>
                    <v-dialog v-model="loginDialog" max-width="600px"><login/></v-dialog>
                    <v-dialog v-model="msgDialog" max-width="600px">
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
            msg: ''
        }),
        name: 'app',
        methods: {
            async logout () {
                try{
                    let res = await auth.logout();
                    this.$store.dispatch('setToken', null);
                    this.$store.dispatch('setUser', null);
                    this.msg = req.data;
                }
                catch(err){
                    this.msg = err.response.data.error;
                }
            },
            close(){
                window.location.replace("/");
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
</style>

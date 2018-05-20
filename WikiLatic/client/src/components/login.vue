<template>
    <v-card>
        <v-card-title>Login</v-card-title>
        <v-card-text>
            <form name="tab-tracker-form" autocomplete="off">
                <v-text-field label="UserName" v-model="username" :rules="nameRules" required></v-text-field>
                <v-text-field label="Password" type="password" v-model="password" :rules="pwdRules" required></v-text-field>
            </form>
            <div class="error" v-html="error" />
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
            <v-btn dark class="cyan" @click="login">Login</v-btn>
        </v-card-text>
    </v-card>
</template>

<script>
    import auth from '@/services/auth';
    export default {
        data() {
            return {
                nameRules: [v => !!v || 'Name is required'],
                pwdRules: [v => !!v || 'Password is required'],
                username: '',
                password: '',
                error: null,
                msg: null,
                msgDialog: false
            }
        },
        methods: {
            async login() {
                try {
                    let res = await auth.login({
                        username: this.username,
                        password: this.password,
                    });
                    if (res.data=="Please fill out the form!")
                        this.error = res.data;
                    else{
                        this.msg = res.data;
                        this.msgDialog = true;
                        // this.$store.dispatch('setUser', res.session.username);
                    }
                } catch (err) {
                    this.error = err.response.data;
                    this.username = '';
                    this.password = '';
                }
            },
            close(){
                this.msgDialog = false;
                window.location.replace("/");
            }
        }
    }
</script>
<style scoped>
    .card__title{
        font-size: 30px;
    }
    .error{
        color: red;
        background-color: white !important;
    }
</style>
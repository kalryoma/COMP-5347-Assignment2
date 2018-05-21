<template>
    <v-card>
        <v-card-title>Login</v-card-title>
        <v-card-text>
            <form name="tab-tracker-form" autocomplete="off">
                <v-text-field label="UserName" v-model="username" :rules="nameRules" required></v-text-field>
                <v-text-field label="Password" type="password" v-model="password" :rules="pwdRules" required></v-text-field>
            </form>
            <div class="error" v-html="error" />
            <v-dialog v-model="msgDialog" persistent max-width="600px">
                <v-card>
                    <v-card-text>
                        <div class="message" v-html="msg" />
                    </v-card-text>
                    <v-card-actions>
                        <v-btn flat color="green darken-1" @click="close" v-on:click="$emit('closeParent')">
                            Go to Overall Analysis
                        </v-btn>
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
                    this.msg = res.data.msg;
                    this.msgDialog = true;
                    this.$store.dispatch('setToken', res.data.token);
                    this.$store.dispatch('setUser', this.username);
                    this.$emit('closeParent');
                } catch (err) {
                    this.error = err.response.data;
                    this.username = '';
                    this.password = '';
                }
            },
            close(){
                this.msgDialog = false;
                this.$router.push("/analytics/overall");
            },
            closeParent(){}
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
<template>
    <v-card>
        <v-card-title>Register</v-card-title>
        <v-card-text>
            <form name="tab-tracker-form" autocomplete="off">
                <v-text-field label="UserName" v-model="username" :rules="nameRules" required></v-text-field>
                <v-text-field label="Password" type="password" v-model="password" :rules="pwdRules" required></v-text-field>
                <v-text-field label="Confirm Password" type="password" v-model="confirmPW" :rules="cnfPWRules" required></v-text-field>
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
            <v-btn dark class="cyan" @click="register">Register</v-btn>
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
                cnfPWRules: [v => !!v || 'Password is required'],
                username: '',
                password: '',
                confirmPW: '',
                error: null,
                msg: null,
                msgDialog: false
            }
        },
        methods: {
            async register() {
                try {
                    let res = await auth.register({
                        username: this.username,
                        password: this.password,
                        confirmPW: this.confirmPW
                    });
                    this.msg = res.data.msg;
                    this.msgDialog = true;
                } catch (err) {
                    this.error = err.response.data;
                    this.username = '';
                    this.password = '';
                    this.confirmPW = '';
                }
            },
            close(){
                this.msgDialog = false;
                this.$parent.registerDialog = false;
                this.$parent.loginDialog = true;
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

<template lang="html">
    <v-main class="login">
        <v-container fluid fill-height>
            <v-layout flex align-center justify-center>
                <v-flex xs12 sm8 md4>
                    <v-row v-if="logo">
                        <v-flex text-center>
                            <img
                                :src="logo.img"
                                alt="avatar"
                                style="max-width: 100%; max-height:150px; height: auto; width: auto; margin-top: -200px; margin-bottom: 40px;"
                            />
                        </v-flex>
                    </v-row>
                    <v-card class="elevation-12">
                        <v-toolbar dark color="primary">
                            <v-toolbar-title v-t="title"></v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>

                        <!-- Login mode -->
                        <v-card-text v-if="modeLogin" class="pt-4">
                            <v-form v-model="loginFormValid" ref="form" @submit.prevent="login">
                                <v-text-field
                                    id="login"
                                    name="login"
                                    light
                                    :autofocus="true"
                                    prepend-icon="fa-user"
                                    :label="$t('login')"
                                    v-model="email"
                                    :readonly="webauthn"
                                    required
                                    :rules="emailRules"
                                ></v-text-field>
                                <v-text-field
                                    v-if="!webauthn"
                                    id="password"
                                    name="password"
                                    light
                                    :label="$t('password')"
                                    v-model="password"
                                    prepend-icon="fa-lock"
                                    min="8"
                                    :append-icon="showPassword ? 'fa-eye-slash' : 'fa-eye'"
                                    :type="showPassword ? 'text' : 'password'"
                                    :rules="passwordRules"
                                    @click:append="showPassword = !showPassword"
                                    counter
                                    required
                                ></v-text-field>
                                <div v-else class="text-center pa-4">
                                    <i class="fas fa-fingerprint fa-7x fa-size"></i>
                                </div>
                                <v-layout justify-space-between pt-3>
                                    <div class="pt-3">
                                        <!--                                            <a href="" v-t="'password-forgotten'"></a>-->
                                    </div>
                                    <a @click.prevent="modeLogin = !modeLogin" v-t="'forgotten-password'"></a>
                                    <v-spacer></v-spacer>
                                    <v-btn type="submit" color="primary" v-t="'connection'"></v-btn>
                                </v-layout>
                            </v-form>
                        </v-card-text>

                        <!-- Reset mode -->
                        <v-card-text v-else class="pt-4">
                            <v-form @submit.prevent="resetPassword">
                                <v-text-field
                                    id="resetPwd"
                                    name="reset-pwd"
                                    light
                                    :autofocus="true"
                                    prepend-icon="fa-user"
                                    :label="$t('login')"
                                    v-model="email"
                                    required
                                ></v-text-field>
                                <v-layout justify-space-between pt-3>
                                    <div class="pt-3"></div>
                                    <a @click.prevent="modeLogin = !modeLogin" v-t="'cancel'"></a>
                                    <v-spacer></v-spacer>
                                    <v-btn type="submit" color="primary" v-t="'valid'"></v-btn>
                                </v-layout>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <img
                    src="img/Logo-powered.svg"
                    alt="avatar"
                    style="height:40px; width: auto; position: absolute; right:10px; bottom:10px;"
                />
            </v-layout>
        </v-container>
    </v-main>
</template>

<script lang="js">
import FormRules from "@/utils/FormRules";
import { subscriberService } from "@/core/services";

export default {
    name: "login",
    props: [],
    data() {
        return {
            modeLogin: true,
            loginFormValid: false,
            showPassword: false,
            password: "",
            passwordRules: [
                FormRules.required(this.$t("password-required")),
            ],
            email: this.$store.getters.appLocal("login.email"),
            emailRules: [
                FormRules.required(this.$t("login-required")),
            ],
        };
    },
    computed: {
        title: function() {
            if (this.modeLogin) return "connection";
            else                return "reset-password";
        },
        logo() {
            return this.$store.getters.config.logo;
        },
        webauthn(){
            return this.$store.getters.appLocal("settings.webauthn");
        },
    },
    methods: {
        clear() {
            this.$refs.form.reset();
        },
        async getSuppliersList() {
            await subscriberService
                .getList({
                    maxResult: 500,
                    user: false,
                    subscriberType: null,
                    display: "",
                    searchExtra: [
                        {
                            id: "cf_Type",
                            type: "constant",
                            value: "FOURNISSEUR",
                        },
                    ],
                })
                .then(response => {
                    if (sessionStorage.getItem('su-list-suppliers') === null) {
                        sessionStorage.setItem('su-list-suppliers',JSON.stringify(response.data.hits.hits));
                    }
                }).catch((e) => {
                    console.error(e);
                });
        },
        login: function() {
            if(!this.loginFormValid) return;

            let _username = this.email,
                _password = this.password
            ;

            if (this.webauthn) {
                this.$store.dispatch("AUTH_REQUEST_WEBAUTHN", { _username, }).then(async () => {
                    this.$io.init();
                    await this.getSuppliersList();
                    await this.$router.push({ name: "main", });
                }).catch((err) => {
                    this.$toast.error(err);
                });
            } else {
                this.$store.dispatch("AUTH_REQUEST", { _username, _password, }).then(async () => {
                    this.$io.init();
                    await this.getSuppliersList();
                    await this.$router.push({ name: "main", });
                }).catch((err) => {
                    let messageKeyI18n = "error.unexpected";

                    if (err.status === 401) {
                        messageKeyI18n = "error.bad-username-password";
                    }
                    this.$toast.error(this.$t(messageKeyI18n));
                });
            }

        },
        resetPassword() {
            this.$axios.post("/resetpw", {
              email: this.email,
              brandId: this.$store.getters.config.brand.api.id,
              type: this.$store.getters.config.brand.api.type,
              automationEmail: this.$store.getters.config.brand.automation.resetpwd,
            }).then(()=>{
                this.$toast.success("reset-password");
            });
        },
    },
};
</script>

<style scoped lang="scss">
.login {
    .v-card__text {
        background-color: #ffffff;
    }
}
</style>

<i18n>
    {
        "fr": {
            "connection": "Connexion",
            "forgotten-password": "Mot de passe oublié?",
            "login": "Code utilisateur",
            "login-required": "Le code utilisateur est requis",
            "password": "Mot de passe",
            "password-required": "Le mot de passe est requis",
            "password-forgotten": "Mot de passe oublié",
            "reset-password": "Réinitialisation du mot de passe",
            "valid": "Valider",
            "error.bad-username-password": "Mauvais nom d'utilisateur ou mot de passe"
        },
        "en": {
            "connection": "Login",
            "forgotten-password": "Forgotten password?",
            "login": "Username",
            "login-required": "Username required",
            "password": "Password",
            "password-required": "Password required",
            "password-forgotten": "Forgotten password",
            "reset-password": "Reset password",
            "valid": "Valid",
            "error.bad-username-password": "Bad username or password"
        }
    }
</i18n>

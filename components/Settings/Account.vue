<template>
    <v-flex>
        <v-form v-model="validPwd" ref="form" @submit.prevent="changePassword">
            <v-row>
                <v-col cols="12" md="12" class="py-0 text-center"
                    ><b>{{ $store.state.app.user.customId }} - {{ $store.state.app.user.name }}</b></v-col
                >
            </v-row>

            <v-row>
                <v-col cols="12" md="6" class="px-4">
                    <v-col cols="12">
                        <v-text-field
                            id="actualPassword"
                            name="actual-password"
                            :label="$t('actual-password')"
                            v-model="actualPassword"
                            prepend-icon="fa-lock"
                            min="8"
                            type="password"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="py-0">
                        <v-text-field
                            id="newPassword"
                            name="new-password"
                            :label="$t('new-password')"
                            v-model="newPassword"
                            prepend-icon="fa-lock"
                            min="8"
                            type="password"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="py-0">
                        <v-text-field
                            id="confirmPassword"
                            name="confirm-password"
                            :label="$t('confirm-password')"
                            v-model="confirmPassword"
                            prepend-icon="fa-lock"
                            min="8"
                            type="password"
                            required
                        ></v-text-field>
                        <v-flex float-right>
                            <v-spacer></v-spacer>
                            <v-btn type="submit" color="primary" v-t="'save'"></v-btn>
                        </v-flex>
                    </v-col>
                </v-col>
                <v-col cols="12" md="6" v-if="cfg && Object.keys(cfg).includes('bucket') && Object.keys(cfg).includes('bucketAvatarPath')">
                    <v-form ref="avatar">
                        <div class="px-5 mb-5" v-if="$store.state.app.user.info.avatar">
                            <v-card class="mx-auto pa-2" color="primary" dark max-width="400">
                                <v-card-title>
                                    <v-icon large left>
                                        fas fa-camera
                                    </v-icon>
                                    <span class="title font-weight-light">{{ $t("actual-image") }}</span>
                                </v-card-title>

                                <v-card-text class="headline font-weight-bold text-center">
                                    <img :src="photo" style="max-height: 200px; max-width: 200px; width: auto;" />
                                </v-card-text>

                                <v-card-actions>
                                    <v-row align="center" justify="end">
                                        <v-icon class="mr-1" @click="deletePhoto">fas fa-times</v-icon>
                                    </v-row>
                                </v-card-actions>
                            </v-card>
                        </div>

                        <div class="px-5">
                            <v-file-input
                                @change="updateImageDisplay"
                                v-model="picture"
                                :rules="[value => !value || value.size < 1000000 || $t('size')]"
                                color="primary accent-4"
                                accept="image/png, image/jpeg"
                                :label="$t('upload-picture')"
                                :placeholder="$t('fileselect')"
                                prepend-icon=""
                                prepend-inner-icon="fas fa-camera"
                                filled
                            >
                                <template v-slot:selection="{ index, text }">
                                    <v-chip v-if="index < 4" color="primary accent-4" label small>
                                        {{ text }}
                                    </v-chip>
                                </template>
                            </v-file-input>
                        </div>

                        <!-- Preview -->
                        <div class="preview pb-5 text-center"></div>

                        <v-flex float-right>
                            <v-spacer></v-spacer>
                            <v-btn @click="uploadPhoto" color="primary" v-t="'send'"></v-btn>
                        </v-flex>
                    </v-form>
                </v-col>
            </v-row>
        </v-form>
    </v-flex>
</template>

<script>
export default {
    data() {
        return {
            validPwd: false,
            actualPassword: "",
            newPassword: "",
            confirmPassword: "",
            picture: null,
            subscriber: this.$store.state.app.user,
            photo: null,
            cfg: this.$store.getters.config.brand.drive,
        };
    },
    mounted() {
        this.getPhoto();
    },
    methods: {
        changePassword() {
            if (!this.newPassword || !this.confirmPassword || this.newPassword !== this.confirmPassword) {
                this.$toast.error(this.$t("error-new-password"));
                return;
            }
            let data = {
                old_password: this.actualPassword,
                new_password: this.newPassword,
                new_password_verify: this.confirmPassword,
            };
            this.$axios.post("/subscriber/changepw", data).then(() => {
                this.$toast.success(this.$t("success-change-password"));
            });
        },
        async deletePhoto() {
            let res = await this.$confirm(this.$t("ays"));
            if (res) {
                this.$axios.post("/subscriber/" + this.subscriber.id + "/avatar?delete=true").then(resp => {
                    this.$store.dispatch("changeAvatarValue", false);
                    this.$root.$emit("updateLoggedPhoto");
                    this.$toast.success(this.$t("success.deleted"));
                });
            }
        },
        returnFileSize(number) {
            let unit = number + " octets";

            if (number >= 1024 && number < 1048576) {
                unit = (number / 1024).toFixed() + " Ko";
            } else if (number >= 1048576) {
                unit = (number / 1048576).toFixed() + " Mo";
            }

            return unit;
        },
        updateImageDisplay() {
            if (this.$refs.avatar.validate()) {
                let curFile = this.picture;
                let preview = document.querySelector(".preview");

                // Remove eventually older preview
                while (preview.firstChild) {
                    preview.removeChild(preview.firstChild);
                }

                if (this.picture === null) {
                    return;
                }

                // If loaded file or not
                if (curFile.length === 0) {
                    let para = document.createElement("p");
                    para.textContent = this.$t("upload-err-empty");
                    preview.appendChild(para);
                } else {
                    let div = document.createElement("div");
                    preview.appendChild(div);
                    let para = document.createElement("p");

                    // Info curFile
                    para.innerHTML =
                        "<strong>" +
                        this.$t("name") +
                        " : </strong>" +
                        curFile.name +
                        "<br />" +
                        "<strong>" +
                        this.$t("size") +
                        " : </strong>" +
                        this.returnFileSize(curFile.size);

                    // Build preview
                    let image = document.createElement("img");
                    image.src = window.URL.createObjectURL(curFile);
                    image.style.maxWidth = "120px";
                    image.style.maxHeight = "auto";
                    image.classList.add("my-5");

                    div.appendChild(image);
                    div.appendChild(para);
                }
            }
        },
        getPhoto() {
            if (
                this.$store.state.app.user.info.avatar &&
                Object.keys(this.cfg).includes("bucket") &&
                Object.keys(this.cfg).includes("bucketAvatarPath")
            ) {
                let bucket = this.cfg.bucket,
                    bucketPath = this.cfg.bucketAvatarPath;

                this.photo =
                    " https://s3-eu-west-1.amazonaws.com/" +
                    bucket +
                    "/" +
                    bucketPath +
                    "/" +
                    this.$store.state.app.user.id +
                    "-avatar.png?v=" +
                    Math.floor(Date.now() / 1000);
            }
            return null;
        },
        uploadPhoto() {
            if (this.$refs.avatar.validate()) {
                let formData = new FormData();
                this.photo = null;

                formData.append("files", this.picture);

                if (Object.keys(this.cfg).includes("bucket") && Object.keys(this.cfg).includes("bucketAvatarPath")) {
                    let bucket = this.$store.getters.config.brand.drive.bucket,
                        bucketPath = this.$store.getters.config.brand.drive.bucketAvatarPath;

                    this.$axios
                        .post("/subscriber/" + this.subscriber.id + "/avatar?bucket=" + bucket + "&bucketPath=" + bucketPath, formData, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        })
                        .then(() => {
                            let preview = document.querySelector(".preview");

                            // Remove eventually older preview
                            while (preview.firstChild) {
                                preview.removeChild(preview.firstChild);
                            }
                            this.$store.dispatch("changeAvatarValue", true);

                            this.picture = null;
                            this.getPhoto();
                            this.$root.$emit("updateLoggedPhoto");
                            this.$forceUpdate();
                        });
                } else {
                    this.$toast.error(this.$t("bucket-error"));
                }
            }
        },
    },
};
</script>

<i18n>
    {
        "fr": {
            "actual-password": "Mot de passe actuel",
            "new-password": "Nouveau mot de passe",
            "confirm-password": "Confirmation du nouveau mot de passe",
            "error-actual-password": "Le mot de passe actuel est incorrect",
            "error-new-password": "Le nouveau mot de passe ainsi que sa confirmation sont requis et doivent être identiques",
            "success-change-password": "Votre mot de passe a bien été mis à jour",
            "upload-photo": "Uploader une photo",
            "upload-rules": "La photo doit être de type jpg, jpeg ou png.",
            "upload-err-empty": "Aucun fichier sélectionné pour l'upload",
            "upload-err-type": "Le type du fichier n'est pas un type valide. Veuillez en choisir un correct.",
            "upload-picture": "Sélectionner une photo à uploader (PNG, JPG)",
            "fileselect": "Choisir une image",
            "actual-image": "Avatar actuel",
            "success.deleted": "Avatar supprimé avec succès",
            "ays": "Êtes-vous sûr ?",
            "sizeOff": "La taille de l'avatar doit être inferieure à 1 MB",
            "bucket-error": "Le bucket n'est pas configuré"

        },
        "en": {
            "actual-password": "Current password",
            "new-password": "New password",
            "confirm-password": "Confirmation of the new password",
            "error-actual-password": "The current password is incorrect",
            "error-new-password": "The new password and its confirmation are required and must be identical",
            "success-change-password": "Your password has been updated",
            "upload-photo": "Upload a photo",
            "upload-rules": "The photo must be jpg, jpeg or png.",
            "upload-err-empty": "No file selected for upload",
            "upload-err-type": "File is not a valid file type. Update your selection.",
            "upload-picture": "Select a photo to upload (PNG, JPG)",
            "fileselect": "Select picture",
            "actual-image": "Current avatar",
            "success.deleted": "Deleted",
            "ays": "Are you sure?",
            "sizeOff": "Avatar size should be less than 1 MB!",
            "bucket-error": "Bucket not setup"
        }
    }
</i18n>

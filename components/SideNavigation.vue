<template>
    <v-navigation-drawer
        app
        v-model="isOpen"
        @transitionend="openMenu"
        :expand-on-hover="expandOnHover"
        :src="barImage"
        class="side-navigation"
        style="z-index: 50"
        :hide-overlay="true"
        :style="$isMobile ? 'padding-top: 56px' : ''"
    >
        <template v-slot:img="props">
            <v-img style="opacity: 0.3" v-bind="props" />
        </template>
        <v-list-item class="px-2" @click="loadSubs(user)" :style="{ backgroundColor: logo.background }">
            <template v-if="logo">
                <v-list-item-avatar v-if="!isOpenEvt" :size="35">
                    <img
                        :src="photo ? photo : logo.menu ? logo.menu : logo.imgmd"
                        alt="Logo"
                        :style="{ backgroundColor: logo.background }"
                    />
                </v-list-item-avatar>
                <v-list-item-content v-else>
                    <img
                        :src="photo ? photo : logo.menu ? logo.menu : logo.imglg"
                        alt="Logo"
                        :style="{ backgroundColor: logo.background, height: '34px' }"
                    />
                </v-list-item-content>
            </template>
        </v-list-item>
        <v-list rounded :class="'menu-item'" class="rewrite">
            <template v-for="menuItem in menu">
                <!--if external link-->
                <v-list-item
                    v-if="menuItem.externalLink"
                    @click="
                        showSubMenu = false;
                        openLink(menuItem.externalLink);
                    "
                    active-class="accent"
                    :key="menuItem.title[$i18n.locale]"
                    link
                >
                    <v-list-item-action>
                        <v-icon v-if="menuItem.icon" small>fas {{ menuItem.icon }}</v-icon>
                        <img v-else style="width: 20px; height: auto;" :src="menuItem.img" />
                    </v-list-item-action>

                    <v-list-item-content>
                        <v-list-item-title>{{ menuItem.title[$i18n.locale] }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <!--endif-->
                <v-list-item
                    v-if="menuItem.idpage && !menuItem.sectionTitle"
                    @click="showSubMenu = false"
                    :to="{ name: 'main', params: { page: pages[menuItem.idpage].name } }"
                    active-class="accent"
                    :key="menuItem.name || pages[menuItem.idpage].name"
                    link
                >
                    <v-list-item-action>
                        <v-icon v-if="pages[menuItem.idpage].icon" small>fas {{ pages[menuItem.idpage].icon }}</v-icon>
                        <img class="su-menu-icon" v-else style="width: 20px; height: auto;" :src="pages[menuItem.idpage].img" />
                    </v-list-item-action>

                    <v-list-item-content>
                        <v-list-item-title>{{ pages[menuItem.idpage].title[locale] }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item
                    v-if="menuItem.idpage && menuItem.sectionTitle"
                    active-class="accent"
                    :key="menuItem.name || pages[menuItem.idpage].name"
                    v-define-text-color
                    style="margin-top: 30px;"
                >
                    <v-list-item-content>
                        <v-list-item-title>{{ pages[menuItem.idpage].title[locale].toUpperCase() }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <!--Sub menu-->
                <v-list-group v-if="!menuItem.idpage && !menuItem.externalLink" :value="showSubMenu" :key="menuItem.name">
                    <!-- prepend icon -->
                    <v-icon v-if="menuItem.icon" slot="prependIcon" small>fas {{ menuItem.icon }}</v-icon>
                    <img v-else-if="menuItem.img" :src="menuItem.img" slot="prependIcon" alt="custom icon" style=" height: auto;" />

                    <!-- append icon -->
                    <v-icon slot="appendIcon" small>fas fa-chevron-up</v-icon>

                    <!-- Title of sub menu -->
                    <template slot="activator">
                        <v-list-item-title>{{ menuItem.label[locale] }}</v-list-item-title>
                    </template>

                    <!-- Items -->
                    <v-list-item
                        v-for="(subMenu, i) in menuItem.dropdown"
                        :key="i"
                        :to="{ name: 'main', params: { page: pages[subMenu.idpage].name } }"
                        @click="showSubMenu = false"
                        active-class="accent navigation-link-active"
                        style="padding-left: 80px;"
                    >
                        <!--                        <v-list-item-action>-->
                        <!--                            &lt;!&ndash; Custom icon &ndash;&gt;-->
                        <!--                            <template v-if="subMenu.icon || subMenu.img">-->
                        <!--                                <v-icon v-if="subMenu.icon" small>fas {{ subMenu.icon }}</v-icon>-->
                        <!--                                <img-->
                        <!--                                    v-else-if="subMenu.img"-->
                        <!--                                    :src="subMenu.img"-->
                        <!--                                    slot="prependIcon"-->
                        <!--                                    alt="custom icon"-->
                        <!--                                    style="width: 20px; height: auto;"-->
                        <!--                                />-->
                        <!--                            </template>-->

                        <!--                            &lt;!&ndash; Page icon &ndash;&gt;-->
                        <!--                            <template v-else>-->
                        <!--                                <v-icon v-if="pages[subMenu.idpage].icon" small> fas {{ pages[subMenu.idpage].icon }}</v-icon>-->
                        <!--                                <img v-else alt="image custom" style="width: 20px; height: auto;" :src="pages[subMenu.idpage].img" />-->
                        <!--                            </template>-->
                        <!--                        </v-list-item-action>-->

                        <v-list-item-title>{{ pages[subMenu.idpage].title[locale] }}</v-list-item-title>
                    </v-list-item>
                </v-list-group>
            </template>
        </v-list>

        <template slot="append">
            <v-list rounded :class="'menu-item'">
                <!-- SETTINGS -->
                <v-list-item active-class="accent" :to="{ name: 'settings' }">
                    <v-list-item-action>
                        <v-icon>fas fa-cog</v-icon>
                    </v-list-item-action>
                    <v-list-item-title>{{ $t("settings") }}</v-list-item-title>
                </v-list-item>

                <!-- EDIT LAYOUT -->
                <!--                <v-list-item-->
                <!--                    active-class="accent"-->
                <!--                    v-define-text-color-->
                <!--                    @click="$store.commit('toggleEditableLayout')"-->
                <!--                    v-if="!$isMobile && editMode"-->
                <!--                >-->
                <!--                    <v-list-item-action>-->
                <!--                        <v-icon>{{ $store.state.isEditableLayout ? "fas fa-save" : "fas fa-edit" }}</v-icon>-->
                <!--                    </v-list-item-action>-->
                <!--                    <v-list-item-title>{{ $store.state.isEditableLayout ? $t("save") : $t("edit_mode") }}</v-list-item-title>-->
                <!--                </v-list-item>-->

                <!-- LOGOUT -->
                <v-list-item :class="'menu-item'" active-class="accent" v-define-text-color :to="{ name: 'logout' }">
                    <v-list-item-action>
                        <v-icon>fas fa-sign-out-alt</v-icon>
                    </v-list-item-action>
                    <v-list-item-title>{{ $t("logout") }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </template>
        <modal v-model="modal" fullscreen>
            <iframe :src="url" width="100%" height="100vh" frameborder="0"></iframe>
        </modal>
    </v-navigation-drawer>
</template>

<script>
import { VNavigationDrawer, VTooltip } from "vuetify/lib";
import Modal from "./Core/Modal";

export default {
    name: "SideNavigation",
    components: {
        Modal,
        VNavigationDrawer,
        VTooltip,
    },
    props: {
        value: {
            type: Boolean,
            default: true,
        },
        expandOnHover: {
            type: Boolean,
            default: false,
        },
        primaryColor: {
            type: String,
        },
    },
    data() {
        return {
            isOpen: this.value,
            isOpenEvt: false,
            showSubMenu: false,
            photo: null,
            url: "",
            modal: false,
        };
    },
    mounted() {
        // this.getPhoto();
        this.$root.$on("updateLoggedPhoto", () => {
            this.getPhoto();
        });
    },
    methods: {
        isGranted(item) {
            if (item.roles) {
                return this.$store.getters.isGranted(item.roles);
            }
        },
        openMenu(evt) {
            this.isOpenEvt = !(evt.srcElement.style.width === "56px");
        },
        loadSubs(item) {
            let route = item.type === 0 ? "Third" : "Contact";
            this.$router.push({ name: "main", params: { page: route, id: item.id, }, });
        },
        getPhoto() {
            let cfg = this.$store.getters.config.brand.drive;
            if (
                this.$store.state.app.user.info?.avatar &&
                Object.keys(cfg).includes("bucket") &&
                Object.keys(cfg).includes("bucketAvatarPath")
            ) {
                let bucket = cfg.bucket,
                    bucketPath = cfg.bucketAvatarPath;

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
        openLink(url) {
            let user = this.$store.state.app.user;
            this.url = this.$options.filters.render(url, {
                user: user,
            });
            this.modal = true;
        },
    },
    computed: {
        pages() {
            return this.$store.getters.pages;
        },
        menu() {
            const fullMenu = JSON.parse(JSON.stringify(this.$store.getters.menu));

            let filteredMenu = fullMenu.filter(menu => {
                // check if a dropdown
                if (menu.idpage) {
                    const page = this.$store.getters.pages[menu.idpage];
                    return this.$store.getters.hasRightOnPage(page);
                } else if (menu.sectionTitle) {
                    if (menu.roles) {
                        return this.$store.getters.isGranted(menu.roles);
                    }
                }
                return true;
                // end check rights
            });
            filteredMenu.map(menu => {
                if (menu.dropdown) {
                    menu.dropdown = menu.dropdown.filter(menu => {
                        // check if a dropdown
                        if (menu.idpage) {
                            const page = this.$store.getters.pages[menu.idpage];
                            return this.$store.getters.hasRightOnPage(page);
                        }

                        return true;
                        // end check rights
                    });
                }
                return menu;
            });
            return filteredMenu;
        },
        user() {
            return this.$store.getters.app("user");
        },

        logo() {
            return this.$store.getters.config.logo;
        },
        editMode() {
            return this.$store.getters.config.editMode;
        },
        locale() {
            return this.$i18n.locale;
        },
        barImage() {
            let barImage = undefined;
            if (this.$store.getters.config.theming) {
                barImage = this.$store.getters.config.theming.barImage;
            }
            return barImage;
        },
    },
    watch: {
        isOpen(val) {
            this.$emit("input", val);
        },
        value(val) {
            this.isOpen = val;
        },
    },
};
</script>

<style scoped lang="scss">
.v-footer {
    .v-list {
    }
}
iframe {
    height: 100vh;
}

.v-list--rounded .v-list-item {
    border-radius: 10px !important;
}

.menu-item {
    .v-list-item__content {
        padding: 6px 0;
    }

    .v-list-item__action {
        margin-left: -5px;
    }

    .v-list-item {
        min-height: 30px;
    }

    .v-list--rounded .v-list-item,
    .v-list--rounded .v-list-item:before,
    .v-list--rounded .v-list-item > .v-ripple__container {
        border-radius: 10px !important;
    }

    .v-list-item:not(:last-child):not(:only-child),
    .v-list--rounded .v-list-item:not(:last-child):not(:only-child) {
        margin-bottom: 0px !important;
    }

    .theme--light.v-list-item {
        color: white !important;
    }

    .theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
        color: var(--v-secondary-base) !important;
        .v-icon {
            color: var(--v-secondary-base) !important;
        }
    }
}
</style>

<i18n>
    {
        "fr": {
            "logout": "Déconnexion",
            "settings": "Paramètres",
            "eordering": "E-Ordering",
            "edit_mode": "Mode édition"
        },
        "en": {
            "logout": "Logout",
            "settings": "Settings",
            "eordering": "E-Ordering",
            "edit_mode": "Edit mode"
        }
    }
</i18n>

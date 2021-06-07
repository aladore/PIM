<template>
    <v-navigation-drawer
        v-if="navigationLinkOpen"
        dark
        right
        fixed
        width="180"
        class="side-navigation primary"
        :style="$isMobile ? 'top: 56px;  right: 180px;' : 'top: 60px;'"
    >
        <v-list>
            <!-- menuLink is set on config.json-->
            <v-list-item v-for="link in $store.getters.config.menuLink.items" :key="link.name" class="d-block pb-5 title text-center my-5">
                <a
                    :href="link.href | render({ user: $store.getters.app('user') })"
                    target="_blank"
                    style="color: white; text-decoration: none"
                >
                    <img :width="link.width || 70" v-if="link.imgUrl" :src="link.imgUrl" alt="external link" />
                    <v-icon class="icon_nav" :size="link.width || 70" v-else>{{ link.icon || "fas fa-external-link-alt" }}</v-icon>
                    <div style="font-size: 14px;">{{ link.name }}</div>
                </a>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
export default {
    name: "side-navigation-link",
    props: {
        navigationLinkOpen: Boolean,
    },
};
</script>

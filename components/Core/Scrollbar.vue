<template>
    <vue-scroll :ops="ops"><slot></slot></vue-scroll>
</template>

<script>
import VueScroll from "vuescroll";
export default {
    name: "Scrollbar",
    components: { VueScroll },
    data() {
        return {
            ops: {
                bar: {
                    background: this.$vuetify.theme.themes.dark.primary,
                    keepShow: true,
                },
            },
        };
    },
};
</script>

<style scoped lang="scss">
.scrollbar {
}
</style>

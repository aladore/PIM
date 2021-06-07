<script>
export default {
    computed: {
        $transparentPrimary90() {
            return `${this.$vuetify.theme.themes.dark.primary}E6`;
        },
        $transparentPrimary40() {
            return `${this.$vuetify.theme.themes.dark.primary}66`;
        },
        $transparentPrimary30() {
            return `${this.$vuetify.theme.themes.dark.primary}4D`;
        },
        $transparentSecondary70() {
            return `${this.$vuetify.theme.themes.dark.secondary}4D`;
        },
        $transparentSecondary40() {
            return `${this.$vuetify.theme.themes.dark.secondary}66`;
        },
    },
};
</script>

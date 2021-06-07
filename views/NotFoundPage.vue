<template>
    <section class="not-found-page">
        <h1 class="text-h3 text-center" v-t="'404'"></h1>
    </section>
</template>

<script>
export default {
    name: "NotFoundPage",
    i18n: {
        messages: {
            en: {
                404: "Page not found",
            },
            fr: {
                404: "Page non trouvée",
            },
        },
    },
};
</script>

<style scoped lang="scss">
.not-found-page {
}
</style>

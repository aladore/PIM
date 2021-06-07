<template>
    <v-chip label outlined color="primary" v-if="status">
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-icon v-if="btnStatus.icon" :color="btnStatus.status[status].color">{{ btnStatus.icon }}</v-icon>
                <v-img v-else-if="btnStatus.img" width="24" :src="btnStatus.img" :title="btnStatus.status[status].tooltip"></v-img>
                <div v-else class="pellet d-inline-block mr-3" v-on="on" :style="{ backgroundColor: btnStatus.status[status].color }"></div>
            </template>
            <div v-html="btnStatus.status[status].tooltip"></div>
        </v-tooltip>

        <div v-if="btnStatus.status[status].label" class="d-inline-block">{{ btnStatus.status[status].label }}</div>
        <v-tooltip v-if="btnStatus.globalTooltip" bottom z-index="100">
            <template v-slot:activator="{ on }">
                <v-icon :x-small="$isMobile" small v-on="on">fas fa-question</v-icon>
            </template>
            <p
                v-for="index in Object.keys(btnStatus.status)"
                :key="index"
                v-html="
                    `<div
                        class='pellet d-inline-block mr-3'
                        style=\'background-color: ` +
                        btnStatus.status[index].color +
                        `'
                    ></div>` +
                        btnStatus.status[index].tooltip
                "
            ></p>
        </v-tooltip>
    </v-chip>
</template>

<script>
export default {
    name: "btn-status",
    props: {
        btnStatus: Object,
    },
    computed: {
        status: {
            get() {
                let subscriber = this.$store.getters.app("subscriber"),
                    f = this.btnStatus.field,
                    status = null;

                if (f.startsWith("cf_")) {
                    f = f.replace("cf_", "");
                    if (subscriber.customFields.hasOwnProperty(f)) {
                        status = subscriber.customFields[f];
                    }
                } else {
                    status = subscriber[f];
                }

                if (this.btnStatus.hasOwnProperty("condition")) {
                    const params = { user: this.$store.getters.app("user"), subscriber: this.$store.getters.app("subscriber") };

                    let expr = false;
                    if (this.btnStatus.condition.type === "=") {
                        expr = status === this.$options.filters.render(this.btnStatus.condition.value, params);
                    }

                    if (expr) {
                        status = "OK";
                    } else {
                        status = false;
                    }
                    // console.log("btnstatus", status, expr, this.$options.filters.render(this.btnStatus.condition.value, params));
                }

                return status;
            },
        },
    },
};
</script>

<style lang="scss">
.btn-status {
    border: solid 1px black;
}
.pellet {
    border-radius: 20px;
    width: 20px;
    height: 20px;
    @media (max-width: 992px) {
        border-radius: 20px;
        width: 12px;
        height: 12px;
        margin-bottom: 5px;
    }
}
</style>

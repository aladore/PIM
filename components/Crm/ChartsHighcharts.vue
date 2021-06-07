<template lang="html">
    <section class="charts-highcharts">
        <grid-block title="Utilisation des actions">
            <highcharts :options="chartOptions"></highcharts>
        </grid-block>
    </section>
</template>

<script lang="js">
import {Chart,} from 'highcharts-vue';
export default  {
    name: 'ChartsHighcharts',
    components: {
        highcharts: Chart,
    },
    props: [],
    mounted() {
        this.getInfo();
    },
    data() {
        return {
            chartOptions: {
                credits: false,
                chart: {
                    type: 'pie',
                    backgroundColor: 'none',
                },
                title: {
                    text: this.$t('title'),
                },
                backgroundColor: "#000000",
                series: [{
                    data: [],
                    name: "Envoyé",
                },],
            },
            title: '',
        }
    },
    methods: {
        async getInfo(){
            const resp = await this.$axios.get("/action/count");
            this.chartOptions.series[0].data.push({
                y: resp.data.email,
                color: "#ff9e22",
                name: "E-mail",
            });
            this.chartOptions.series[0].data.push({
                y: resp.data.sms,
                color: "#1E88E5",
                name: "SMS",
            });
            this.chartOptions.series[0].data.push({
                y: resp.data.task,
                color: "#00695C",
                name: this.$t('tasks'),
            });
            this.chartOptions.series[0].data.push({
                y: resp.data.event,
                color: "#E65100",
                name: this.$t('meet'),
            });
            this.chartOptions.series[0].data.push({
                y: resp.data.notes,
                color: "#00C853",
                name: "Notes",
            });
            // this.chartOptions.series[0].data.push(resp.data.sms);
            // this.chartData[3][1] = resp.data.task;
            // this.chartData[4][1] = resp.data.meet;
            // this.chartData[5][1] = resp.data.notes;
            this.dataLoaded = true;
        },
    },
    computed: {

    },
}
</script>

<style scoped lang="scss">
.charts-highcharts {
}
</style>

<i18n>
    {
    "en": {
        "title": "Action utilisation",
        "tasks": "Tasks",
        "meet": "Appointment"
    },
    "fr": {
        "title": "Utilisation des actions",
        "tasks": "Tâches",
        "meet": "Rendez-vous"
    }
    }

</i18n>

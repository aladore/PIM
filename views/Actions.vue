<template lang="html">
    <section class="actions">
        <v-flex
            md6
            :style="{
                backgroundColor: $transparentPrimary40,
                marginBottom: '20px',
                overflow: 'hidden',
                wordWrap: 'break-word',
                padding: '2rem',
            }"
            offset-md3
        >
            <v-layout wrap>
                <template v-if="action.name">
                    <v-flex md12 class=" text--secondary">
                        {{ action.name }}
                    </v-flex>
                </template>
                <template v-else>
                    <span v-t="'action'"></span>
                </template>
                <template v-if="action.info">
                    <v-flex md12>
                        <v-card
                            dark
                            :style="{
                                backgroundColor: $transparentPrimary40,
                                marginBottom: '20px',
                                overflow: 'hidden',
                                wordWrap: 'break-word',
                            }"
                            v-if="action.info.comment"
                        >
                            <v-layout>
                                <v-flex sm12>
                                    <v-card-text>
                                        <div class="subheading">
                                            <b>Information</b>
                                        </div>
                                        <div v-html="action.info['comment']"></div>
                                    </v-card-text>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>

                    <v-flex md12>
                        <v-card dark :style="{ backgroundColor: $transparentPrimary40, marginBottom: '20px' }" v-if="action.info.date">
                            <v-layout>
                                <v-flex sm12>
                                    <v-card-text>
                                        <div class="subheading">
                                            <b>Date</b>
                                        </div>
                                        <div>{{ $d(new Date(action.info.date), "medium") }}</div>
                                    </v-card-text>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>

                    <v-flex md12>
                        <v-card dark :style="{ backgroundColor: $transparentPrimary40, marginBottom: '20px' }" v-if="action.info.dateBegin">
                            <v-layout>
                                <v-flex sm12>
                                    <v-card-text>
                                        <div class="subheading">
                                            <b>Date début</b>
                                        </div>
                                        <div>{{ $d(new Date(this.action.info.dateBegin), "medium") }} - {{ action.info.timeBegin }}</div>
                                    </v-card-text>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>

                    <v-flex md12>
                        <v-card dark :style="{ backgroundColor: $transparentPrimary40, marginBottom: '20px' }" v-if="action.info.dateEnd">
                            <v-layout>
                                <v-flex sm12>
                                    <v-card-text>
                                        <div class="subheading">
                                            <b>Date fin</b>
                                        </div>
                                        <div>{{ $d(new Date(this.action.info.dateEnd), "medium") }} - {{ action.info.timeEnd }}</div>
                                    </v-card-text>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>

                    <v-flex md12>
                        <v-card dark :style="{ backgroundColor: $transparentPrimary40, marginBottom: '20px' }" v-if="action.info.time">
                            <v-layout>
                                <v-flex sm12>
                                    <v-card-text>
                                        <div class="subheading">
                                            <b v-t="'time'"></b>
                                        </div>
                                        <div>{{ action.info.time }}</div>
                                    </v-card-text>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>

                    <v-flex md12>
                        <v-card dark :style="{ backgroundColor: $transparentPrimary40, marginBottom: '20px' }" v-if="action.info.rappel">
                            <v-layout>
                                <v-flex sm12>
                                    <v-card-text>
                                        <div class="subheading">
                                            <b v-t="'reminder'"></b>
                                        </div>
                                        <div>{{ action.info.rappel }}</div>
                                    </v-card-text>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>

                    <v-flex md12>
                        <v-card dark :style="{ backgroundColor: $transparentPrimary40 }" v-if="action.info.localization">
                            <v-layout>
                                <v-flex sm12>
                                    <v-card-text>
                                        <div class="subheading">
                                            <b v-t="'localization'"></b>
                                        </div>
                                        <div>{{ action.info.localization }}</div>
                                    </v-card-text>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>

                    <v-flex md12>
                        <v-card dark :style="{ backgroundColor: $transparentPrimary40 }" v-if="action.tags && action.tags.length > 0">
                            <v-layout>
                                <v-flex sm12>
                                    <v-card-text>
                                        <div class="subheading">
                                            <b v-t="'asso-tag'"></b>
                                        </div>
                                        <v-layout wrap>
                                            <template v-for="(tags, index) in action.tags" :v-key="index">
                                                {{ tags.name }}
                                                <template v-if="action.tags.length - 1 !== index">
                                                    ,
                                                </template>
                                            </template>
                                        </v-layout>
                                    </v-card-text>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>
                </template>
            </v-layout>
        </v-flex>
        <v-flex md6 offset-md3 v-if="action.type === 3 && action.status === 0">
            <v-layout>
                <v-flex>
                    <v-flex float-right>
                        <v-btn
                            dark
                            :color="$transparentPrimary90"
                            style="margin-left: 0; margin-bottom: 1.5rem;"
                            @click="changeStatus"
                            v-if="$store.getters.app('subscriber').name !== null"
                            class="mr2"
                        >
                            <v-icon left>fas fa-check-circle</v-icon>
                            {{ $t("close") }}
                            <!--{{ $store.getters.app("subscriber").name }}-->
                        </v-btn>
                    </v-flex>
                </v-flex>
            </v-layout>
        </v-flex>

        <template
            v-if="
                action.type === 4 &&
                    $moment(action.info.dateEnd)
                        .hours(action.info.timeEnd.substr(0, 2))
                        .minutes(action.info.timeEnd.substr(3, 4))
                        .isBefore($moment(new Date()))
            "
        >
            <v-flex
                md6
                :style="{
                    backgroundColor: $transparentPrimary40,
                    marginBottom: '20px',
                    overflow: 'hidden',
                    wordWrap: 'break-word',
                    padding: '2rem',
                }"
                offset-md3
            >
                <v-layout wrap>
                    <v-flex md12>
                        <div class="subheading text--secondary">
                            <b v-t="'summaryTitle'"></b>
                        </div>
                        <v-card dark :style="{ backgroundColor: $transparentPrimary40 }">
                            <v-layout>
                                <v-flex sm12>
                                    <v-card-text>
                                        <div class="subheading">
                                            <b v-t="'priceTalking'"></b>
                                        </div>
                                        <v-layout wrap>
                                            <v-col cols="12">
                                                <v-text-field v-model="priceTalking" :label="$t('priceTalking')" filled></v-text-field>
                                            </v-col>
                                        </v-layout>
                                    </v-card-text>
                                </v-flex>
                            </v-layout>
                        </v-card>
                        <v-card dark :style="{ backgroundColor: $transparentPrimary40, marginTop: '20px' }">
                            <v-layout>
                                <v-flex sm12>
                                    <v-card-text>
                                        <div class="subheading">
                                            <b v-t="'summary'"></b>
                                        </div>
                                        <v-layout wrap>
                                            <v-col cols="12">
                                                <v-textarea v-model="summary" :label="$t('summary')" filled></v-textarea>
                                            </v-col>
                                        </v-layout>
                                    </v-card-text>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex md6 offset-md3>
                <v-layout>
                    <v-flex>
                        <v-flex float-right>
                            <v-btn
                                dark
                                :color="$transparentPrimary90"
                                style="margin-left: 0; margin-bottom: 1.5rem;"
                                @click="saveSummary"
                                v-if="$store.getters.app('subscriber').name !== null"
                                class="mr2"
                            >
                                {{ $t("save") }}
                                <!--{{ $store.getters.app("subscriber").name }}-->
                            </v-btn>
                        </v-flex>
                    </v-flex>
                </v-layout>
            </v-flex>
        </template>
    </section>
</template>

<script lang="js">
import CrmComponentMixin from "@/mixins/CrmComponentMixin";

export default  {
    name: 'actions',
    props: [],
    mixins: [CrmComponentMixin,],
    mounted() {
        this.getAction();
    },
    data() {
        return {
            action: {},
            id : this.$route.params.id,
            priceTalking: "",
            summary: "",
        }
    },
    methods: {
        saveSummary(){
            let data = {
                priceTalking: this.priceTalking,
                summary: this.summary,
            };
            this.$axios.post("/action/summary/" + this.id, data).then((resp) => {
                this.action = resp.data;
                this.$toast.success(this.$t("success.saved"));
            });
        },
        async getAction(){
            this.$axios.get("/action/web/" + this.id).then((resp) => {
                this.action = resp.data;
                if (this.action.type === 4){
                    if (this.action.info.summary.priceTalking){
                        this.priceTalking = this.action.info.summary.priceTalking;
                    }
                    if (this.action.info.summary.summary){
                        this.summary = this.action.info.summary.summary;
                    }
                }
            });
        },
        async changeStatus(){
            let yes = await this.$confirm(this.$t('close') + '?');
            if (yes){
                this.$axios.patch("/action/status/" + this.id).then(() => this.getAction()).catch(err => {
                    console.log('actions', err);
                    this.$toast.error(err);
                });
            }
        },

    },
    computed: {

    },
}
</script>

<style scoped lang="scss">
.actions {
}
</style>

<i18n>
    {
        "fr": {
            "summary": "Résumé de réunion",
            "summaryTitle": "Compte-rendu de RDV",
            "priceTalking": "Montant engagé"
        }
    }
</i18n>

<template ref="childShops">
    <div
            class="card mb-8 pa-0 shadow-1"
            :elevation="4"
    >
        <v-row class="wrapper-service ma-0 d-flex align-center scroll-service px-2 px-sm-8 py-8">
            <v-col cols="6">
                <span v-if="!shop.label" class="title_page">Shop {{ number + 1 }}</span>
                <span v-else class="title_page">{{ shop.label }}</span>
            </v-col>
            <v-col cols="6" class="d-flex justify-end">
                <v-icon
                        class="icon icon_rounded mx-1"
                        @click="remove"
                >fa fa-trash</v-icon
                >
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-icon class="icon icon_rounded icon_handle mx-1"
                        >fa fa-align-justify</v-icon
                        >
                    </template>
                    <span>{{ $t("reorder") }}</span>
                </v-tooltip>
            </v-col>
            <v-col cols="12">
                <v-tabs grow>
                    <v-tab>
                        Information
                    </v-tab>
                    <v-tab>
                        Coordonnées
                    </v-tab>
                    <v-tab>
                        Horaires
                    </v-tab>
                    <v-tab-item>
                        <v-row>
                            <v-col cols="12" md="6" align="center" class="d-flex flex-column su-col-import-img">
                                <div class="jumbotron vertical-center su-block-import-img">
                                    <v-container class="mx-auto my-3">
                                        <label :for="'shop[' + number + '][img]'">
                                            <v-icon
                                                    size="100"
                                                    :class="[dragImg ? 'su-img-import-icon-drag' : 'su-img-import-icon']"
                                                    @drop.prevent="dragDropImg"
                                                    @dragover.prevent
                                                    @dragenter="dragImg=true"
                                                    @dragend="dragImg=false"
                                                    @dragleave="dragImg=false"
                                            >far fa-image
                                            </v-icon>
                                            <div class="clear"></div>
                                            <v-container fluid class="su-import-img-btn px-8 text-none v-btn v-btn_import theme--light">
                                                <span style="display: inline-block;word-wrap: break-word;">{{ $t("importimg") }}</span>
                                            </v-container>
                                        </label>
                                        <input
                                                type="file"
                                                :id="'shop[' + number + '][img]'"
                                                :name="'shop[' + number + '][img]'"
                                                accept="image/*"
                                                style="position:absolute;display: none; opacity: 0;"
                                                @input="updateImg"
                                                @change="previewImage"
                                        />
                                    </v-container>
                                </div>
                            </v-col>
                            <v-col cols="12" md="6" align="center" class="d-flex">
                                <v-container class="su-preview-img-container">
                                    <span class="su-label" style="float: left;">{{ $t("importedImg") }}</span>
                                    <div class="clear"></div>
                                    <div v-for="(img, key) in imgData" :key="key" style="display:inline-flex; position: relative;">
                                        <v-icon
                                                color="red"
                                                size="20"
                                                style="position: absolute;border-radius: 50%;background-color: white;"
                                                @click="removeImg(key)"
                                        >far fa-times-circle
                                        </v-icon>
                                        <img class="su-small-img" :src="img" />
                                    </div>

                                </v-container>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field
                                        v-model="shop.code"
                                        class="su-text-field"
                                        @change="update($event,'code')"
                                        :label="$t('code')"
                                        :rules="[rules.required]"
                                        outlined
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                        v-model="shop.label"
                                        class="su-text-field"
                                        @change="update($event,'label')"
                                        :label="$t('label')"
                                        :rules="[rules.required]"
                                        outlined
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-tab-item>
                    <v-tab-item>
                        <v-row class="mt-3">
                            <v-col cols="12" md="6">
                                <v-text-field
                                        v-model="shop.telephone"
                                        class="su-text-field"
                                        :label="$t('telephone')"
                                        outlined
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                        v-model="shop.fax"
                                        class="su-text-field"
                                        :label="$t('fax')"
                                        outlined
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                        v-model="shop.email"
                                        class="su-text-field"
                                        :label="$t('email')"
                                        :rules="[rules.required, rules.email]"
                                        outlined
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field
                                        v-model="shop.address1"
                                        class="su-text-field"
                                        :label="$t('address1')"
                                        :rules="[rules.required]"
                                        outlined
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                        v-model="shop.address2"
                                        class="su-text-field"
                                        :label="$t('address2')"
                                        outlined
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                        v-model="shop.zipcode"
                                        class="su-text-field"
                                        :label="$t('zipcode')"
                                        :rules="[rules.required]"
                                        outlined
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                        v-model="shop.city"
                                        class="su-text-field"
                                        :label="$t('city')"
                                        :rules="[rules.required]"
                                        outlined
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                        v-model="shop.latitude"
                                        class="su-text-field"
                                        :label="$t('latitude')"
                                        :rules="[rules.required]"
                                        outlined
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                        v-model="shop.longitude"
                                        class="su-text-field"
                                        :label="$t('longitude')"
                                        :rules="[rules.required]"
                                        outlined
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-textarea
                                        v-model="shop.comment"
                                        class="su-text-field"
                                        :label="$t('comment')"
                                        outlined
                                ></v-textarea>
                            </v-col>
                        </v-row>
                    </v-tab-item>
                    <v-tab-item>
                        <v-tabs fixed-tabs>
                            <v-tab>
                                {{ $t('monday')}}
                            </v-tab>
                            <v-tab>
                                {{ $t('tuesday')}}
                            </v-tab>
                            <v-tab>
                                {{ $t('wednesday')}}
                            </v-tab>
                            <v-tab>
                                {{ $t('thursday')}}
                            </v-tab>
                            <v-tab>
                                {{ $t('friday')}}
                            </v-tab>
                            <v-tab>
                                {{ $t('saturday')}}
                            </v-tab>
                            <v-tab>
                                {{ $t('sunday')}}
                            </v-tab>
                            <v-tab-item>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="monday0"
                                                v-model="monday0"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.monday[0]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.monday[0]"
                                                        :label="$t('timeOpenM')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="monday0"
                                                    v-model="shop.opened.monday[0]"
                                                    @change="updateTime($event,'monday','0')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.monday0.save(shop.opened.monday[0])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="monday1"
                                                v-model="monday1"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.monday[1]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.monday[1]"
                                                        :label="$t('timeCloseM')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="monday1"
                                                    v-model="shop.opened.monday[1]"
                                                    @change="updateTime($event,'monday','1')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.monday1.save(shop.opened.monday[1])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="monday2"
                                                v-model="monday2"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.monday[2]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.monday[2]"
                                                        :label="$t('timeOpenE')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="monday2"
                                                    v-model="shop.opened.monday[2]"
                                                    @change="updateTime($event,'monday','2')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.monday2.save(shop.opened.monday[2])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="monday3"
                                                v-model="monday3"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.monday[3]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.monday[3]"
                                                        :label="$t('timeCloseE')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="monday3"
                                                    v-model="shop.opened.monday[3]"
                                                    @change="updateTime($event,'monday','3')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.monday3.save(shop.opened.monday[3])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                </v-row>
                            </v-tab-item>
                            <v-tab-item>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="tuesday0"
                                                v-model="tuesday0"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.tuesday[0]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.tuesday[0]"
                                                        :label="$t('timeOpenM')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="tuesday0"
                                                    v-model="shop.opened.tuesday[0]"
                                                    @change="updateTime($event,'tuesday','0')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.tuesday0.save(shop.opened.tuesday[0])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="tuesday1"
                                                v-model="tuesday1"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.tuesday[1]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.tuesday[1]"
                                                        :label="$t('timeCloseM')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="tuesday1"
                                                    v-model="shop.opened.tuesday[1]"
                                                    @change="updateTime($event,'tuesday','1')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.tuesday1.save(shop.opened.tuesday[1])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="tuesday2"
                                                v-model="tuesday2"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.tuesday[2]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.tuesday[2]"
                                                        :label="$t('timeOpenE')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="tuesday2"
                                                    v-model="shop.opened.tuesday[2]"
                                                    @change="updateTime($event,'tuesday','2')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.tuesday2.save(shop.opened.tuesday[2])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="tuesday3"
                                                v-model="tuesday3"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.tuesday[3]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.tuesday[3]"
                                                        :label="$t('timeCloseE')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="tuesday3"
                                                    v-model="shop.opened.tuesday[3]"
                                                    @change="updateTime($event,'tuesday','3')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.tuesday3.save(shop.opened.tuesday[3])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                </v-row>
                            </v-tab-item>
                            <v-tab-item>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="wednesday0"
                                                v-model="wednesday0"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.wednesday[0]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.wednesday[0]"
                                                        :label="$t('timeOpenM')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="wednesday0"
                                                    v-model="shop.opened.wednesday[0]"
                                                    @change="updateTime($event,'wednesday','0')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.wednesday0.save(shop.opened.wednesday[0])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="wednesday1"
                                                v-model="wednesday1"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.wednesday[1]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.wednesday[1]"
                                                        :label="$t('timeCloseM')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="wednesday1"
                                                    v-model="shop.opened.wednesday[1]"
                                                    @change="updateTime($event,'wednesday','1')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.wednesday1.save(shop.opened.wednesday[1])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="wednesday2"
                                                v-model="wednesday2"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.wednesday[2]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.wednesday[2]"
                                                        :label="$t('timeOpenE')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="wednesday2"
                                                    v-model="shop.opened.wednesday[2]"
                                                    @change="updateTime($event,'wednesday','2')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.wednesday2.save(shop.opened.wednesday[2])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="wednesday3"
                                                v-model="wednesday3"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.wednesday[3]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.wednesday[3]"
                                                        :label="$t('timeCloseE')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="wednesday3"
                                                    v-model="shop.opened.wednesday[3]"
                                                    @change="updateTime($event,'wednesday','3')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.wednesday3.save(shop.opened.wednesday[3])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                </v-row>
                            </v-tab-item>
                            <v-tab-item>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="thursday0"
                                                v-model="thursday0"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.thursday[0]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.thursday[0]"
                                                        :label="$t('timeOpenM')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="thursday0"
                                                    v-model="shop.opened.thursday[0]"
                                                    @change="updateTime($event,'thursday','0')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.thursday0.save(shop.opened.thursday[0])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="thursday1"
                                                v-model="thursday1"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.thursday[1]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.thursday[1]"
                                                        :label="$t('timeCloseM')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="thursday1"
                                                    v-model="shop.opened.thursday[1]"
                                                    @change="updateTime($event,'thursday','1')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.thursday1.save(shop.opened.thursday[1])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="thursday2"
                                                v-model="thursday2"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.thursday[2]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.thursday[2]"
                                                        :label="$t('timeOpenE')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="thursday2"
                                                    v-model="shop.opened.thursday[2]"
                                                    @change="updateTime($event,'thursday','2')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.thursday2.save(shop.opened.thursday[2])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="thursday3"
                                                v-model="thursday3"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.thursday[3]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.thursday[3]"
                                                        :label="$t('timeCloseE')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="thursday3"
                                                    v-model="shop.opened.thursday[3]"
                                                    @change="updateTime($event,'thursday','3')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.thursday3.save(shop.opened.thursday[3])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                </v-row>
                            </v-tab-item>
                            <v-tab-item>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="friday0"
                                                v-model="friday0"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.friday[0]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.friday[0]"
                                                        :label="$t('timeOpenM')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="friday0"
                                                    v-model="shop.opened.friday[0]"
                                                    @change="updateTime($event,'friday','0')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.friday0.save(shop.opened.friday[0])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="friday1"
                                                v-model="friday1"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.friday[1]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.friday[1]"
                                                        :label="$t('timeCloseM')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="friday1"
                                                    v-model="shop.opened.friday[1]"
                                                    @change="updateTime($event,'friday','1')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.friday1.save(shop.opened.friday[1])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="friday2"
                                                v-model="friday2"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.friday[2]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.friday[2]"
                                                        :label="$t('timeOpenE')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="friday2"
                                                    v-model="shop.opened.friday[2]"
                                                    @change="updateTime($event,'friday','2')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.friday2.save(shop.opened.friday[2])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="friday3"
                                                v-model="friday3"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.friday[3]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.friday[3]"
                                                        :label="$t('timeCloseE')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="friday3"
                                                    v-model="shop.opened.friday[3]"
                                                    @change="updateTime($event,'friday','3')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.friday3.save(shop.opened.friday[3])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                </v-row>
                            </v-tab-item>
                            <v-tab-item>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="saturday0"
                                                v-model="saturday0"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.saturday[0]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.saturday[0]"
                                                        :label="$t('timeOpenM')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="saturday0"
                                                    v-model="shop.opened.saturday[0]"
                                                    @change="updateTime($event,'saturday','0')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.saturday0.save(shop.opened.saturday[0])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="saturday1"
                                                v-model="saturday1"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.saturday[1]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.saturday[1]"
                                                        :label="$t('timeCloseM')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="saturday1"
                                                    v-model="shop.opened.saturday[1]"
                                                    @change="updateTime($event,'saturday','1')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.saturday1.save(shop.opened.saturday[1])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="saturday2"
                                                v-model="saturday2"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.saturday[2]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.saturday[2]"
                                                        :label="$t('timeOpenE')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="saturday2"
                                                    v-model="shop.opened.saturday[2]"
                                                    @change="updateTime($event,'saturday','2')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.saturday2.save(shop.opened.saturday[2])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="saturday3"
                                                v-model="saturday3"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.saturday[3]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.saturday[3]"
                                                        :label="$t('timeCloseE')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="saturday3"
                                                    v-model="shop.opened.saturday[3]"
                                                    @change="updateTime($event,'saturday','3')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.saturday3.save(shop.opened.saturday[3])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                </v-row>
                            </v-tab-item>
                            <v-tab-item>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="sunday0"
                                                v-model="sunday0"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.sunday[0]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.sunday[0]"
                                                        :label="$t('timeOpenM')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="sunday0"
                                                    v-model="shop.opened.sunday[0]"
                                                    @change="updateTime($event,'sunday','0')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.sunday0.save(shop.opened.sunday[0])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="sunday1"
                                                v-model="sunday1"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.sunday[1]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.sunday[1]"
                                                        :label="$t('timeCloseM')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="sunday1"
                                                    v-model="shop.opened.sunday[1]"
                                                    @change="updateTime($event,'sunday','1')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.sunday1.save(shop.opened.sunday[1])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="sunday2"
                                                v-model="sunday2"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.sunday[2]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.sunday[2]"
                                                        :label="$t('timeOpenE')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="sunday2"
                                                    v-model="shop.opened.sunday[2]"
                                                    @change="updateTime($event,'sunday','2')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.sunday2.save(shop.opened.sunday[2])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-menu
                                                ref="sunday3"
                                                v-model="sunday3"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="shop.opened.sunday[3]"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        class="su-text-field"
                                                        v-model="shop.opened.sunday[3]"
                                                        :label="$t('timeCloseE')"
                                                        readonly
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                    v-if="sunday3"
                                                    v-model="shop.opened.sunday[3]"
                                                    @change="updateTime($event,'sunday','3')"
                                                    format="24hr"
                                                    full-width
                                                    @click:minute="$refs.sunday3.save(shop.opened.sunday[3])"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                </v-row>
                            </v-tab-item>
                        </v-tabs>
                    </v-tab-item>
                </v-tabs>
            </v-col>
            <v-col cols="2"></v-col>
            <v-spacer></v-spacer>
            <v-col cols="6" class="justify-end">
                <div v-if="saveLoader" class="container_loader">
                    <rotate-square2></rotate-square2>
                </div>
                <v-btn v-else class="su-btn-dark ml-5 float-right" color="#011C40" @click="save">{{ $t("save") }}</v-btn>
                <v-btn class="su-btn-light px-5 float-right" color="#A2D4F2">{{ $t("cancel") }}</v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { required, requiredIf } from "vuelidate/lib/validators";
import Rules from "@/utils/Rules";
import { RotateSquare2, } from "vue-loading-spinner";

export default {
    name: "ShopBlock",
    components: { RotateSquare2,},
    props: {
        number: {
            type: Number,
        },
        shop: {
            type: Object,
            default: () => {
                return {
                    id: 1,
                    code: "",
                    label: "",
                    opened: {
                        monday: [ null, null, null, null],
                        tuesday: [ null, null, null, null],
                        wednesday: [ null, null, null, null],
                        thursday: [ null, null, null, null],
                        friday: [ null, null, null, null],
                        saturday: [ null, null, null, null],
                        sunday: [ null, null, null, null]
                    },
                    telephone: "",
                    email: "",
                    fax: "",
                    comment: "",
                    address1: "",
                    address2: "",
                    zipcode: "",
                    city: "",
                    latitude: "",
                    longitude: "",
                    images: []
                };
            },
        },
    },
    data() {
        return {
            rules: {
                required: value => !!value || this.$t("required"),
                email: value => {
                    Rules.email(value) || this.$t("invalidEmail")
                },
            },
            monday0: false,
            monday1: false,
            monday2: false,
            monday3: false,
            tuesday0: false,
            tuesday1: false,
            tuesday2: false,
            tuesday3: false,
            wednesday0: false,
            wednesday1: false,
            wednesday2: false,
            wednesday3: false,
            thursday0: false,
            thursday1: false,
            thursday2: false,
            thursday3: false,
            friday0: false,
            friday1: false,
            friday2: false,
            friday3: false,
            saturday0: false,
            saturday1: false,
            saturday2: false,
            saturday3: false,
            sunday0: false,
            sunday1: false,
            sunday2: false,
            sunday3: false,
            saveLoader: false,
            imgData: [],
            dragImg: false
        };
    },
    validations: {
        imgData: {
            required,
        },
        dstart: {
            required: requiredIf(function() {
                return this.state === "plan";
            }),
        },
    },
    mounted() {
        this.imgData = [...this.shop.images];

    },
    methods: {
        save() {
            // let formIsValid = this.$refs.childShops.some(shop => {
            //     if (shop.$v) {
            //         return shop.$v.$invalid;
            //     }
            // });
            // console.log(formIsValid);

            // if (formIsValid) {
                this.saveLoader = true;
                let bucket = this.$store.getters.config.brand.drive.bucket,
                    bucketPath = this.$store.getters.config.brand.drive.bucketPath,
                    ecomApi = this.$store.getters.config.brand.ecom.api,
                    formData = new FormData(),
                    nfile = 0;

                formData.append("bucket", bucket);
                formData.append("bucketPath", bucketPath);
                formData.append("shop", JSON.stringify(this.shop));

                if (this.shop.images) {
                    this.shop.images.forEach((img,i) => {
                        if (img instanceof File) {
                            console.log(i,img);
                            formData.append(`images[]`, img, img.name);
                            nfile++;
                        }
                    });
                }

                this.$axios
                    .post("/proxy", formData, {
                        headers: {
                            "x-su-proxyrest-url": ecomApi + "/address/shop",
                            "Content-Type": nfile ? "multipart/form-data" : "application/json",
                            // "Access-Control-Allow-Origin": "*",
                            // "Access-Control-Allow-Methods": "POST",
                        },
                    })
                    .then(data => {
                        this.saveLoader = false;
                        console.log("POST OK", data);
                        this.$toast.success(this.$t("save-message"));
                    })
                    .catch(err => {
                        this.saveLoader = false;
                        console.log(err);
                        this.$toast.error(this.$t("error-message"));
                    });
            // } else {
            //     this.$toast.warning(this.$t("form-invalid"));
            // }
        },
        touch() {
            this.$v.$reset();
            let that = this;
            setTimeout(function() {
                that.$v.$touch();
            }, 100);
        },
        remove() {
            this.$emit("remove", {
                shop: this.shop,
                id: this.number
            });
        },
        update(value,field) {
            console.log(value,field);
            this.shop[field] = value;
            this.$emit("update", this.number, this.shop);
        },
        updateTime(date,day,idx) {
            let ref = day+idx;
            this.shop.opened[day][idx] = date;
            this.$refs[ref].save(date);
            this.$emit("update", this.number, this.shop);
        },
        updateImg(img) {
            this.shop.images.push(img.target.files[0]);
            this.$emit("update", this.number, this.shop);
        },
        dragDropImg(e) {
            let evtCopy = JSON.parse(JSON.stringify(e));
            this.dragImg = false;
            evtCopy.target = {};
            evtCopy.target.files = e.dataTransfer.files;
            this.updateImg(evtCopy);
            this.previewImage(evtCopy);
        },
        removeImg(id) {
            this.imgData.splice(id,1);
            this.shop.images.splice(id,1);
            this.$emit("removeImg", this.shop);
        },
        previewImage: function(event) {
            var input = event.target;
            if (input.files && input.files[0]) {
                for (let file of input.files) {
                    var reader = new FileReader();
                    reader.onload = e => {
                        this.imgData.push(e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            }
        },
    },
    computed: {},
};
</script>

<style scoped lang="scss">
    .clear {
        clear: both;
    }

    .su-text-field {
        background: #ffffff 0% 0% no-repeat padding-box;
        border-radius: 10px;
    }

    .su-block-import-img {
        background: #011c40 0% 0% no-repeat padding-box;
        opacity: 1;
        height: 80%;
        max-height: 500px;
        /*min-height: 400px;*/
        display: flex;
        align-items: center;
    }

    .su-block-import-img-icon {
        background: #011c40 0% 0% no-repeat padding-box;
        opacity: 1;
        width: 36px;
        height: 36px;
        border-radius: 50%;
    }

    .su-import-img-btn {
        background: #a2d4f2 0% 0% no-repeat padding-box;
        border-radius: 7px;
        opacity: 1;
        color: #011c40;
        margin-bottom: 20px;
        /*padding: 12px 35px!important;*/
    }

    .su-col-import-img {
        min-height: 100%;
    }

    .su-img-import-icon {
        opacity: 1;
        color: #ffffff;
        cursor: pointer;
        position: relative;
        top: 0px;
    }

    .su-img-import-icon-drag {
        color: #757575;
        opacity: 1;
        cursor: pointer;
        position: relative;
        top: 0px;
    }
    .su-small-img {
        margin: 10px;
        width: 99px;
        height: 96px;
        border: 1px solid #023473;
        opacity: 1;
    }
    .su-label {
        text-align: center;
        font: Bold 14px/18px Montserrat, sans-serif;
        letter-spacing: 0px;
        color: #023473;
        opacity: 1;
    }
    .su-btn-light {
        text-align: left;
        font: Medium 12px/34px Montserrat;
        letter-spacing: 0px;
        color: #011c40;
        border-radius: 7px;
        opacity: 1;
    }

    .su-btn-dark {
        text-align: left;
        font: Medium 12px/34px Montserrat;
        letter-spacing: 0px;
        color: #ffffff;
        border-radius: 7px;
        opacity: 1;
    }

</style>

<i18n>
    {
    "fr": {
    "shopAdd": "Ajouter un magasin",
    "timeOpenM": "Horaire ouverture matin",
    "timeCloseM": "Horaire fermeture matin",
    "timeOpenE": "Horaire ouverture après-midi",
    "timeCloseE": "Horaire fermeture après-midi",
    "label": "Libellé",
    "telephone": "Téléphone",
    "email": "Email",
    "fax": "Fax",
    "address1": "Adresse 1",
    "address2": "Adresse 2",
    "zipcode": "Code postal",
    "city": "Ville",
    "required": "Champs requis",
    "invalidEmail": "Email n'est pas valid",
    "code": "Code",
    "monday": "Lundi",
    "tuesday": "Mardi",
    "wednesday": "Mercredi",
    "thursday": "Jeudi",
    "friday": "Vendredi",
    "saturday": "Samedi",
    "sunday": "Dimanche",
    "latitude": "Latitude",
    "longitude": "Longitude",
    "importedImg": "Images importées :",
    "importimg": "Importer une image"
    },
    "en": {
    "shopAdd": "Add a shop",
    "timeOpenM": "Morning opening time",
    "timeCloseM": "Morning closing time",
    "timeOpenE": "Afternoon opening time",
    "timeCloseE": "Afternoon closing time",
    "label": "Label",
    "telephone": "Telephone",
    "email": "Email",
    "fax": "Fax",
    "address1": "Address 1",
    "address2": "Address 2",
    "zipcode": "Zip code",
    "city": "City",
    "required": "Required field",
    "invalidEmail": "Invalid email",
    "code": "Code",
    "monday": "Monday",
    "tuesday": "Tuesday",
    "wednesday": "Wednesday",
    "thursday": "Thursday",
    "friday": "Friday",
    "saturday": "Saturday",
    "sunday": "Sunday",
    "latitude": "Latitude",
    "longitude": "Longitude",
    "importedImg": "Imported images :",
    "importimg": "Import image"
    }
    }
</i18n>

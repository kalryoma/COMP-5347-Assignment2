<template>
    <v-container grid-list-md text-xs-center id="container">
        <v-tabs color="cyan" dark slider-color="yellow">
            <v-tab ripple>Sample View</v-tab>
            <v-tab-item>
                <v-layout row wrap>
                    <v-flex xs6>
                        <div>
                            <v-menu top offset-y>
                                <v-btn slot="activator" color="deep-orange" class="MenuBtn">Table</v-btn>
                            </v-menu>
                            <v-data-table :headers="headers" :items="articles" hide-actions>
                                <template slot="items" slot-scope="props">
                                    <td class="text-xs-center">{{ props.item.title }}</td>
                                    <td class="text-xs-center">{{ props.item.revisionNum }}</td>
                                </template>
                            </v-data-table>
                        </div>
                    </v-flex>
                    <v-flex xs6>
                        <div>
                            <v-menu top offset-y>
                                <v-btn slot="activator" color="deep-orange" class="MenuBtn">
                                    Charts
                                    <v-icon>arrow_drop_down</v-icon>
                                </v-btn>
                                <v-list>
                                    <v-list-tile v-for="(item, index) in items" :key="index">
                                        <v-list-tile-action>
                                            <v-icon>{{ item.icon }}</v-icon>
                                        </v-list-tile-action>
                                        <v-list-tile-content>{{ item.title }}</v-list-tile-content>
                                    </v-list-tile>
                                </v-list>
                            </v-menu>
                            <bar-chart/>
                        </div>
                    </v-flex>
                </v-layout>
            </v-tab-item>
        </v-tabs>

    </v-container>
</template>
<script>
    import BarChart from '@/components/BarChart';

    export default {
        components: {
            BarChart
        },
        data() {
            return {
                headers: [{
                        text: 'Article Title',
                        align: 'center',
                        sortable: false,
                        value: 'title'
                    }, {
                        text: 'Revision NUmber',
                        align: 'center',
                        value: 'revisionNum'
                }],
                articles: [{
                    title: "Frozen Yogurt",
                    revisionNum: 159
                }, {
                    title: "Tyrone Garland",
                    revisionNum: 166
                }, {
                    title: "Typhoon Rusa",
                    revisionNum: 151
                }, {
                    title: "Hurricane Erika (1997)",
                    revisionNum: 120
                }, {
                    title: "Michael Jackson",
                    revisionNum: 190
                }, {
                    title: "The Beatles",
                    revisionNum: 188
                }, {
                    title: "FC Barcelona",
                    revisionNum: 133
                }, {
                    title: "Global warming",
                    revisionNum: 90
                }, {
                    title: "Elvis Presley",
                    revisionNum: 80
                }, {
                    title: "Canada",
                    revisionNum: 123
                }, {
                    title: "China",
                    revisionNum: 200
                }, {
                    title: "German",
                    revisionNum: 23
                }],
                items: [{
                        title: 'Bar Chart',
                        icon: 'poll'
                    }, {
                        title: 'Pie Chart',
                        icon: 'pie_chart'
                }]
            }
        }
    }

</script>
<style scoped>
    #container {
        margin: 0;
        max-width: 100%;
    }

    .MenuBtn {
        font-size: 30px;
        color: #fff;
    }

</style>

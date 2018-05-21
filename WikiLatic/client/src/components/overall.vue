<template>
    <v-container grid-list-md text-xs-center id="container">
        <v-card color="cyan">
            <v-card-text>
                <h1>Overall Analytics</h1>
            </v-card-text>
        </v-card>
        <v-tabs color="cyan" dark slider-color="yellow">
            <v-tab ripple>Tables</v-tab>
            <v-tab-item>
                <v-layout row wrap>
                    <v-flex xs6>
                        <div>
                            <v-layout row wrap>
                                <v-flex xs10>
                                    <v-subheader>
                                        <h3>Select the Number of Articles to show for the two tables on the Left</h3>
                                    </v-subheader>
                                </v-flex>
                                <v-flex xs2>
                                    <v-select :items="numSelection" v-model="num" single-line @change="reloadData">
                                    </v-select>
                                </v-flex>
                            </v-layout>
                            <v-card color="light-green lighten-5">
                                <v-card-text>
                                    <h2>Articles with the Highest Number of Revisions</h2>
                                </v-card-text>
                            </v-card>
                            <v-data-table :headers="headers1" :items="topRevisionNum" hide-actions>
                                <template slot="items" slot-scope="props">
                                    <td class="text-xs-center">{{ props.item.title }}</td>
                                    <td class="text-xs-center">{{ props.item.revisionNum }}</td>
                                </template>
                            </v-data-table>
                            <br>
                            <v-card color="light-green lighten-5">
                                <v-card-text>
                                    <h2>Articles with the Lowest Number of Revisions</h2>
                                </v-card-text>
                            </v-card>
                            <v-data-table :headers="headers1" :items="bottomRevisionNum" hide-actions>
                                <template slot="items" slot-scope="props">
                                    <td class="text-xs-center">{{ props.item.title }}</td>
                                    <td class="text-xs-center">{{ props.item.revisionNum }}</td>
                                </template>
                            </v-data-table>
                        </div>
                    </v-flex>
                    <v-flex xs6>
                        <div>
                            <v-card color="light-green lighten-5">
                                <v-card-text>
                                    <h2>Article Edited by the Largest Number of Regular User</h2>
                                </v-card-text>
                            </v-card>
                            <v-data-table :headers="headers2" :items="topUserNum" hide-actions>
                                <template slot="items" slot-scope="props">
                                    <td class="text-xs-center">{{ props.item.title }}</td>
                                    <td class="text-xs-center">{{ props.item.userNum }}</td>
                                </template>
                            </v-data-table>
                            <br>
                            <v-card color="light-green lighten-5">
                                <v-card-text>
                                    <h2>Article Edited by the Smallest Number of Regular User</h2>
                                </v-card-text>
                            </v-card>
                            <v-data-table :headers="headers2" :items="bottomUserNum" hide-actions>
                                <template slot="items" slot-scope="props">
                                    <td class="text-xs-center">{{ props.item.title }}</td>
                                    <td class="text-xs-center">{{ props.item.userNum }}</td>
                                </template>
                            </v-data-table>
                            <br>
                        </div>
                        <div>
                            <v-card color="light-green lighten-5">
                                <v-card-text>
                                    <h2>Top 3 Articles with the Longest History</h2>
                                </v-card-text>
                            </v-card>
                            <v-data-table :headers="headers3" :items="topHistory" hide-actions>
                                <template slot="items" slot-scope="props">
                                    <td class="text-xs-center">{{ props.item.title }}</td>
                                    <td class="text-xs-center">{{ props.item.firstTime }}</td>
                                    <td class="text-xs-center">{{ props.item.history }}</td>
                                </template>
                            </v-data-table>
                            <br>
                            <v-card color="light-green lighten-5">
                                <v-card-text>
                                    <h2>Top 3 Articles with the Shortest History</h2>
                                </v-card-text>
                            </v-card>
                            <v-data-table :headers="headers3" :items="bottomHistory" hide-actions>
                                <template slot="items" slot-scope="props">
                                    <td class="text-xs-center">{{ props.item.title }}</td>
                                    <td class="text-xs-center">{{ props.item.firstTime }}</td>
                                    <td class="text-xs-center">{{ props.item.history }}</td>
                                </template>
                            </v-data-table>
                        </div>
                    </v-flex>
                </v-layout>
            </v-tab-item>
            <v-tab ripple>Charts</v-tab>
            <v-tab-item>
                <v-layout row wrap>
                    <v-flex xs8 offset-xs2>
                        <div>
                            <v-menu top offset-y>
                                <v-btn slot="activator" color="deep-orange" class="MenuBtn">
                                    Charts
                                    <v-icon>arrow_drop_down</v-icon>
                                </v-btn>
                                <v-list dense>
                                    <v-list-tile @click="barChart=true;pieChart=false;">
                                        <v-list-tile-action>
                                            <v-icon>poll</v-icon>
                                        </v-list-tile-action>
                                        <v-list-tile-content>
                                            <v-list-tile-title>Bar Chart</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                    <v-list-tile @click="barChart=false;pieChart=true;">
                                        <v-list-tile-action>
                                            <v-icon>pie_chart</v-icon>
                                        </v-list-tile-action>
                                        <v-list-tile-content>
                                            <v-list-tile-title>Pie Chart</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                </v-list>
                            </v-menu>
                            <bar-chart v-if='barChart' :chart-data="barData" :height="300" :options="barOptions"/>
                            <pie-chart v-if='pieChart' :chart-data="pieData" :height="300" :options="pieOptions"/>
                        </div>
                    </v-flex>
                </v-layout>
            </v-tab-item>
        </v-tabs>
    </v-container>
</template>
<script>
    import analytics from '@/services/analytics';
    import BarChart from '@/charts/BarChart.js';
    import PieChart from '@/charts/PieChart.js';

    export default {
        components: {
            BarChart,
            PieChart
        },
        created: async function () {
            if (!this.$store.state.logged)
                this.$router.push('/');
            else {
                let res = await analytics.overall();
                this.data = res.data;
                this.reloadData(3);
                this.topUserNum = [];
                this.topUserNum.push({
                    title: this.data["TopArticleUniqueUserNum"][0].title,
                    userNum: this.data["TopArticleUniqueUserNum"][0].userNum
                });
                this.bottomUserNum = [];
                this.bottomUserNum.push({
                    title: this.data["BottomArticleUniqueUserNum"][0].title,
                    userNum: this.data["BottomArticleUniqueUserNum"][0].userNum
                });
                this.data["TopArticleHistory"].forEach(element => {
                    let duration = this.$moment.duration(new Date()-new Date(element.firstTime), 'milliseconds');
                    this.topHistory.push({
                        title: element.title,
                        firstTime: element.firstTime,
                        history: duration.years()+" Years "+duration.months()+" Months "+duration.days()+" Days"
                    });
                });
                this.data["BottomArticleHistory"].forEach(element => {
                    let duration = this.$moment.duration(new Date()-new Date(element.firstTime), 'milliseconds');
                    this.bottomHistory.push({
                        title: element.title,
                        firstTime: element.firstTime,
                        history: duration.years()+" Years "+duration.months()+" Months "+duration.days()+" Days"
                    });
                });

                let chartData = this.data["RevisionNumByUserType"];
                let labels = [];
                chartData.forEach(element => {
                    if (!labels.includes(element.year))
                        labels.push(element.year);
                });
                labels.sort();
                let adminData = Array(labels.length).fill(0);
                let regularData = Array(labels.length).fill(0);
                let botData = Array(labels.length).fill(0);
                let anonData = Array(labels.length).fill(0);
                chartData.forEach(element => {
                    if (element.userType=="admin")
                        adminData[labels.indexOf(element.year)] = element.revision_num;
                    if (element.userType=="regular")
                        regularData[labels.indexOf(element.year)] = element.revision_num;
                    if (element.userType=="bot")
                        botData[labels.indexOf(element.year)] = element.revision_num;
                    if (element.userType=="anon")
                        anonData[labels.indexOf(element.year)] = element.revision_num;
                });
                this.barData = {
                    labels: labels,
                    datasets: [{
                            label: 'Administrator',
                            backgroundColor: '#f87979',
                            data: adminData
                        }, {
                            label: 'Regular User',
                            backgroundColor: '#7CB342',
                            data: regularData
                        }, {
                            label: 'Bot',
                            backgroundColor: '#536DFE',
                            data: botData
                        }, {
                            label: 'Anonymous',
                            backgroundColor: '#90A4AE',
                            data: anonData
                    }]
                };
                let adminSum = adminData.reduce((a,b) => a+b);
                let regularSum = regularData.reduce((a,b) => a+b);
                let botSum = botData.reduce((a,b) => a+b);
                let anonSum = anonData.reduce((a,b) => a+b);
                this.pieData = {
                    labels: ['Administrator', 'Regular User', 'Bot', 'Anonymous'],
                    datasets: [{
                        backgroundColor: ['#f87979','#7CB342','#536DFE','#90A4AE'],
                        data: [adminSum, regularSum, botSum, anonSum]
                    }]
                };
            }
        },
        data() {
            return {
                data: null,
                num: 3,
                numSelection:[1,2,3,4,5,6,7,8,9,10],
                headers1: [{
                        text: 'Article Title',
                        align: 'center',
                        sortable: false,
                        value: 'title'
                    }, {
                        text: 'Revision Number',
                        align: 'center',
                        value: 'revisionNum'
                }],
                headers2: [{
                        text: 'Article Title',
                        align: 'center',
                        sortable: false,
                        value: 'title'
                    }, {
                        text: 'Unique Regular User Number',
                        align: 'center',
                        value: 'userNum'
                }],
                headers3: [{
                        text: 'Article Title',
                        align: 'center',
                        sortable: false,
                        value: 'title'
                    }, {
                        text: 'Creation Timestamp',
                        align: 'center',
                        value: 'firstTime'
                    }, {
                        text: 'History',
                        align: 'center',
                        value: 'history'
                }],
                topRevisionNum: [],
                bottomRevisionNum: [],
                topUserNum: [],
                bottomUserNum: [],
                topHistory: [],
                bottomHistory: [],
                barChart: true,
                pieChart: false,
                barData: null,
                barOptions:{
                    title: {
                        display: true,
                        text: 'Revision Number by User Types In Years',
                        fontSize: 20
                    }
                },
                pieData: null,
                pieOptions:{
                    title: {
                        display: true,
                        text: 'Revision Number by User Types',
                        fontSize: 20
                    },
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem, data) {
                                let dataset = data.datasets[tooltipItem.datasetIndex];
                                let total = dataset.data.reduce((a, b) => a + b);
                                let currentValue = dataset.data[tooltipItem.index];
                                let precentage = Math.floor(((currentValue/total) * 100)+0.5);
                                return data.labels[tooltipItem.index]+': '+currentValue+' ('+precentage+'%'+')';
                            }
                        }
                    }
                }
            }
        },
        methods: {
            reloadData (value) {
                this.topRevisionNum = [];
                for (let i=0; i<value; i++){
                    this.topRevisionNum.push({
                        title: this.data["TopArticleRevisionNum"][i].title,
                        revisionNum: this.data["TopArticleRevisionNum"][i].revision_num
                    })
                }
                this.bottomRevisionNum = [];
                for (let i=9; i>9-value; i--){
                    this.bottomRevisionNum.push({
                        title: this.data["BottomArticleRevisionNum"][i].title,
                        revisionNum: this.data["BottomArticleRevisionNum"][i].revision_num
                    })
                }
            }
        }
    }

</script>
<style scoped>
    #container {
        margin: 0;
        max-width: 100%;
    }
    .list__tile__action{
        min-width: 0;
    }
    .MenuBtn {
        font-size: 30px;
        color: #fff;
    }
    .input-group{
        padding-top: 5px;
    }
</style>

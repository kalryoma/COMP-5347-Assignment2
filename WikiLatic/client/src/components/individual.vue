<template>
    <v-container grid-list-md text-xs-center id="container">
        <v-card color="cyan">
            <v-card-text>
                <h1>Individual Analytics</h1>
            </v-card-text>
        </v-card>
        <v-form ref="form" lazy-validation>
            <v-layout row wrap>
                <v-flex xs3 offset-xs2>
                    <v-select
                        prepend-icon="search"
                        :items="selectableTitle"
                        v-model="articleTitle"
                        label="Enter or Select Article Title"
                        autocomplete single-line>
                    </v-select>
                </v-flex>
                <v-subheader>
                    <h3>Filter Revision Number:</h3>
                </v-subheader>
                <v-flex xs2>
                    <v-select
                        :items="revisionNumRange"
                        v-model="revisionNumFilter"
                        label="Range"
                        @change="filterTitle"
                        single-line>
                    </v-select>
                </v-flex>
                <v-flex xs2>
                    <v-btn color="orange" @click="fetchData(articleTitle)">Search Article</v-btn>
                </v-flex>
            </v-layout>
        </v-form>
        <v-dialog v-model="msgDialog" max-width="600px">
            <v-card>
                <v-card-text>
                    <div class="message" v-html="msg" />
                </v-card-text>
                <v-card-actions>
                    <v-btn flat color="primary" @click="msgDialog=false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-layout row wrap v-if="gotData">
            <v-flex xs6>
                <div>
                    <v-menu top offset-y>
                        <v-btn slot="activator" color="deep-orange" class="MenuBtn">Table</v-btn>
                    </v-menu>
                    <v-card color="blue lighten-3">
                        <v-card-text>
                            <h2>The Article: "{{title}}" has {{totalRevisionNum}} revisions in total.</h2>
                        </v-card-text>
                    </v-card>
                    <br>
                    <v-card color="light-green lighten-5">
                        <v-card-text>
                            <h2>Top 5 Regular Users having the largest Revision Number</h2>
                        </v-card-text>
                    </v-card>
                    <v-data-table :headers="headers" :items="userRevisions" hide-actions v-model="selectedUser">
                        <template slot="items" slot-scope="props">
                            <td class="text-xs-center">{{ props.item.username }}</td>
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
                        <v-list dense>
                            <v-list-tile @click="barChart=true;pieChart=false;userBarChart=false;">
                                <v-list-tile-action>
                                    <v-icon>poll</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>Bar Chart</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile @click="userBarChart=true;barChart=false;pieChart=false;">
                                <v-list-tile-action>
                                    <v-icon>poll</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>User Bar Chart</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile @click="barChart=false;pieChart=true;userBarChart=false;">
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
                    <bar-chart v-if='userBarChart' :chart-data="userBarData" :height="300" :options="userBarOptions"/>
                    <pie-chart v-if='pieChart' :chart-data="pieData" :height="300" :options="pieOptions"/>
                </div>
            </v-flex>
        </v-layout>
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
                let res = await analytics.getArticleTitle();
                this.allArticles = res.data;
                this.allArticles.forEach(element => {
                    this.selectableTitle.push(element.title);
                    if (element.revision_num>this.maxRevisionNum)
                        this.maxRevisionNum = element.revision_num;
                });
            }
        },
        data() {
            return {
                title: null,
                articleTitle: null,
                totalRevisionNum: null,
                revisionNumFilter: null,
                maxRevisionNum: 0,
                allArticles: null,
                msgDialog: false,
                gotData: false,
                msg: '',
                selectableTitle: [],
                selectedUser: [],
                revisionNumRange: ["<100", "100~1000", "1000~10000", "10000~20000", ">20000", "All"],
                nameRules: [v => !!v || 'Article Title is required'],
                headers: [{
                        text: 'User Name',
                        align: 'center',
                        sortable: false,
                        value: 'username'
                    }, {
                        text: 'Revision Number',
                        align: 'center',
                        value: 'revisionNum'
                }],
                userRevisions: [],
                barChart: true,
                userBarChart: false,
                pieChart: false,
                barData: null,
                barOptions:{
                    title: {
                        display: true,
                        text: 'Revision Number by User Types In Years',
                        fontSize: 20
                    }
                },
                userBarData: null,
                userBarOptions:{
                    title: {
                        display: true,
                        text: 'Revision Number by User Names In Years',
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
            async fetchData(title){
                this.revisions = [];
                if (title){
                    let res = await analytics.individual({title: title, save: true});
                    let data = res.data;
                    if (data){
                        if (data.DownloadNum>0){
                            this.msg = "There are "+data.DownloadNum+" new revisions downloaded from Wikipedia for Article:'"+title+"'.";
                        }
                        else {
                            this.msg = "You have all the revisoins for Article:'"+title+"'. No new revisions are downloaded.";
                        }
                        this.msgDialog = true;
                        this.gotData = true;
                        let labels = [];
                        data.ArticleData.forEach(element => {
                             this.totalRevisionNum += element.revision_num;
                             if (!labels.includes(element.year))
                                labels.push(element.year);
                        });
                        this.title = title;
                        this.userRevisions = [];
                        data.ArticleDataByUser.forEach(element => {
                            this.userRevisions.push({
                                username: element.user,
                                revisionNum: element.revision_num
                            });
                        });
                        
                        let chartData = data["ArticleData"];
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

                        let userChartData = data["ArticleDataByUserInYear"];
                        let userYears = [];
                        let users = Object.keys(userChartData);
                        users.forEach(element =>{
                            userChartData[element].forEach(element => {
                                if (!userYears.includes(element.year))
                                    userYears.push(element.year);
                            });
                        });
                        userYears.sort();
                        let userBarData = [];
                        for (let i=0; i<users.length; i++){
                            userBarData[i] = Array(userYears.length).fill(0);
                        }
                        for (let i=0; i<users.length; i++){
                            let eachUser = userChartData[users[i]];
                            eachUser.forEach(element => {
                                userBarData[i][userYears.indexOf(element.year)] = element.revision_num;
                            });
                        }
                        let userDataset = [];
                        let color = ['#f87979','#7CB342','#536DFE','#90A4AE', '#512DA8'];
                        for (let i=0; i<users.length; i++){
                            userDataset.push({
                                label: users[i],
                                backgroundColor: color[i],
                                data: userBarData[i]
                            });
                        }
                        this.userBarData = {
                            labels: userYears,
                            datasets: userDataset
                        }
                    }
                }
            },
            filterTitle(filter){
                let start=0;
                let end=this.maxRevisionNum+1;
                switch (filter) {
                    case "<100":
                        end = 100;
                        break;
                    case "100~1000":
                        start = 100;
                        end = 1000;
                        break;
                    case "1000~10000":
                        start = 1000;
                        end = 10000;
                        break;
                    case "10000~20000":
                        start = 10000;
                        end = 20000;
                        break;
                    case ">20000":
                        start = 20000;
                        break;
                    default:
                        break;
                }
                this.selectableTitle = [];
                this.allArticles.forEach(element => {
                    if (element.revision_num>=start && element.revision_num<end)
                        this.selectableTitle.push(element.title);
                });
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
    .subheader{
        padding-top: 28px;
        margin-left: 3%;
    }
    .message{
        font-size: 1.5em;
    }
</style>

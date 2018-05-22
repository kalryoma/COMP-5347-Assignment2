<template>
    <div>
        <pie-chart :chart-data="datacollection" :height="300" :options="options"></pie-chart>
    </div>
</template>

<script>
    import PieChart from '@/charts/PieChart.js'

    export default {
        components: {
            PieChart
        },
        data () {
            return {
                datacollection: null,
                options:{
                    title: {
                        display: true,
                        text: 'Revision Number by User Types',
                        fontSize: 20
                    }
                }
            }
        },
        mounted () {
            this.fillData()
        },
        methods: {
            fillData () {
                this.datacollection = {
                    labels: ['Administrator', 'Regular User', 'Bot', 'Anonymous'],
                    datasets: [{
                        backgroundColor: ['#f87979','#7CB342','#536DFE','#90A4AE'],
                        data: [this.getRandomInt(),this.getRandomInt(),this.getRandomInt(),this.getRandomInt()]
                    }]
                }
            },
            getRandomInt () {
                return Math.floor(Math.random() * (50 - 5 + 1)) + 5
            }
        }
    }
</script>

<style scoped>
</style>
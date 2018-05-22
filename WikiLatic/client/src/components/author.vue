<template>
    <v-container grid-list-md text-xs-center id="container">
        <v-card color="cyan">
            <v-card-text>
                <h1>Author Analytics</h1>
            </v-card-text>
        </v-card>
        <v-layout row wrap>
            <v-flex xs8 offset-xs2>
                <div>
                    <v-form ref="form" lazy-validation>
                        <v-layout row wrap>
                            <v-flex xs3 offset-xs2>
                                <v-subheader>
                                    <h3>Enter the Author Name</h3>
                                </v-subheader>
                            </v-flex>
                            <v-flex xs3>
                                <v-text-field v-model="authorName" prepend-icon="search"
                                    :rules="nameRules" label="Author Name" required>
                                </v-text-field>
                            </v-flex>
                            <v-flex xs3>
                                <v-btn color="orange" @click="getData(authorName)">Search Author</v-btn>
                            </v-flex>
                        </v-layout>
                    </v-form>
                    <v-card color="light-green lighten-5">
                        <v-card-text>
                            <h2>All Articles Edited By Author: {{author}}</h2>
                        </v-card-text>
                    </v-card>
                    <v-data-table :headers="headers" :items="revisions" hide-actions>
                        <template slot="items" slot-scope="props">
                            <tr @click="props.expanded=!props.expanded">
                                <td class="text-xs-center">{{ props.item.title }}</td>
                                <td class="text-xs-center">{{ props.item.revisionNum }}</td>
                                <td class="text-xs-center timestamp">
                                    <v-select
                                        :items="props.item.timeStamp"
                                        v-model="props.item.timeStamp[0]"
                                        autocomplete single-line>
                                    </v-select>
                                </td>
                            </tr>
                        </template>
                        <template slot="expand" slot-scope="props">
                            <v-card flat>
                                <v-card-text>Peek-a-boo!</v-card-text>
                            </v-card>
                        </template>
                    </v-data-table>
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    import analytics from '@/services/analytics';

    export default {
        created: async function () {
            if (!this.$store.state.logged)
                this.$router.push('/');
        },
        data() {
            return {
                author: null,
                authorName: null,
                nameRules: [v => !!v || 'Author Name is required'],
                headers: [{
                        text: 'Article Title',
                        align: 'center',
                        sortable: false,
                        value: 'title'
                    }, {
                        text: 'Revision Number',
                        align: 'center',
                        value: 'revisionNum'
                    }, {
                        text: 'TimeStamp',
                        align: 'center',
                        value: 'timeStamp'
                }],
                revisions: []
            }
        },
        methods: {
            async getData(author){
                this.revisions = [];
                if (author){
                    this.author = author;
                    let res = await analytics.author({author: author});
                    let data = res.data;
                    if (data.length!=0){
                        data.forEach(element => {
                            this.revisions.push({
                                title: element.title,
                                revisionNum: element.revision_num,
                                timeStamp: element.revision_time
                            });
                        });
                    }
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
    .subheader{
        padding-top: 18px;
    }
    .timestamp{
        max-width: 300px;
    }
</style>

import api from '@/services/api';

export default {
    overall() {
        return api().get('analytics/overall');
    },
    author(author) {
        return api().post('analytics/author', author);
    },
    getArticleTitle(){
        return api().get('analytics/individual');
    },
    individual(title){
        return api().post('analytics/individual', title);
    }
}
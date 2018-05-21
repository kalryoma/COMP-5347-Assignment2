import api from '@/services/api';

export default {
    overall () {
        return api().get('analytics/overall');
    }
}
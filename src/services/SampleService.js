import BaseService from './BaseService';
import Sample from '../models/Sample';
import api from './api';

class SampleService extends BaseService {
    constructor() {
        super('/sample', Sample);
    }
    
    async update(data) {
        const url = `${this.endpoint}/${data.s_id}/${encodeURIComponent(data.s_stamp)}`;
        await api.put(url, data);
    }

    async delete(data) {
        const url = `${this.endpoint}/${data.s_id}/${encodeURIComponent(data.s_stamp)}`;
        await api.delete(url);
    }
}

export default new SampleService();
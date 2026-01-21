import BaseService from './BaseService';
import Box from '../models/Box';
import api from './api';

class BoxService extends BaseService {
    constructor() {
        super('/box', Box);
    }

    async update(data) {
        await api.put(`${this.endpoint}/${data.b_id}`, data);
    }

    async delete(data) {
        await api.delete(`${this.endpoint}/${data.b_id}`);
    }
}

export default new BoxService();
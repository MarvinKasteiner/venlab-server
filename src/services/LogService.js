import BaseService from './BaseService';
import Log from '../models/Log';
import api from './api';

class LogService extends BaseService {
    constructor() {
        super('/logs', Log);
    }

    async update(data) {
        await api.put(`${this.endpoint}/${data.log_id}`, data);
    }

    async delete(data) {
        await api.delete(`${this.endpoint}/${data.log_id}`);
    }
}

export default new LogService();
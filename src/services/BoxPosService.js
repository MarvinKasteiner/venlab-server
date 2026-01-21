import BaseService from './BaseService';
import BoxPos from '../models/BoxPos';
import api from './api';

class BoxPosService extends BaseService {
    constructor() {
        super('/boxpos', BoxPos);
    }

    async update(data) {
        await api.put(`${this.endpoint}/${data.bpos_id}/${data.b_id}`, data);
    }

    async delete(data) {
        await api.delete(`${this.endpoint}/${data.bpos_id}/${data.b_id}`);
    }
}

export default new BoxPosService();
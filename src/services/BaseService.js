import api from './api';

export default class BaseService {
    constructor(endpoint, modelClass) {
        this.endpoint = endpoint;
        this.modelClass = modelClass;
    }

    async getAll(params = {}) {
        const response = await api.get(this.endpoint, { params });
        let rawData = [];

        if (response.data.content && Array.isArray(response.data.content)) {
            rawData = response.data.content;
        } else if (Array.isArray(response.data)) {
            rawData = response.data;
        }

        return rawData.map(item => new this.modelClass(item));
    }
    
    async create(data) {
        const response = await api.post(this.endpoint, data);
        return new this.modelClass(response.data);
    }
}
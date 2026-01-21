export default class Log {
    constructor(data = {}) {
        this.log_id = data.log_id || data.id;
        this.date_created = data.date_created;
        this.level = data.level;
        this.info = data.info;
        this.s_id = data.s_id;
        this.s_stamp = data.s_stamp;
        this.a_id = data.a_id;
        this.date_exported = data.date_exported;
    }
}
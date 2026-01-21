export default class Box {
    constructor(data = {}) {
        this.b_id = data.b_id;
        this.name = data.name;
        this.num_max = data.num_max;
        this.type = data.type;
        this.comment = data.comment;
        this.date_exported = data.date_exported;
    }
}
export default class Sample {
    constructor(data = {}) {
        this.s_id = data.s_id;
        this.s_stamp = data.s_stamp;
        this.name = data.name;
        this.weight_net = data.weight_net;
        this.weight_bru = data.weight_bru;
        this.weight_tar = data.weight_tar;
        this.quantity = data.quantity;
        this.distance = data.distance;
        this.date_crumbled = data.date_crumbled;
        this.s_flags = data.s_flags;
        this.lane = data.lane;
        this.comment = data.comment;
        this.date_exported = data.date_exported;
        this.box_position = data.box_position;
    }
}
function cell () {
    // cell gene related attributes
    this.R = 0;
    this.G = 0;
    this.B = 0;
    this.shape = null;
    this.pulse_interval = 0;        // unit: 50ms
    this.pulse_delay = 0;           // unit: 10ms
    this.growth_delay = 0;          // unit: 500ms
    this.allow_neighbors = 255;

    // cell instance related attributes
    this.dom = null;
    this.row = null;
    this.col = null;
    this.is_center = false;
    this.growth_counter = 0;
    // to record where pulse from
    this.pulse_queue = [];
    this.pulse_queue[-1] = [];
    this.pulse_queue[0] = [];
    this.pulse_queue[1] = [];
    this.pulse_queue_dirty = false;
    this.distance_map = [];
    for (var i = -1; i <= 1; i++) {
        this.distance_map[i] = [];
        this.distance_map[i][-1] = Infinity;
        this.distance_map[i][0] = Infinity;
        this.distance_map[i][1] = Infinity;
    }
    $(this).bind('MESSAGE', this.receive);
    this.master = null;
    this.master_direction = null;
    this.growth_flag = false;
}

cell.prototype.gene = function () {
    var ret = '';
    ret += to_hex(this.R, 2);
    ret += to_hex(this.G, 2);
    ret += to_hex(this.B, 2);
    ret += {DIAMAND: '0', SQUARE: '1', null: 'Z'}[this.shape];
    ret += to_hex(this.pulse_interval, 2);
    ret += to_hex(this.pulse_delay, 1);
    ret += to_hex(this.growth_delay, 2);
    ret += to_hex(this.allow_neighbors, 2);
    return ret;
};

cell.prototype.set_color = function (r, g, b) {
    this.R = r;
    this.G = g;
    this.B = b;
    if (this.dom != null) {
        this.dom.css(
            'background',
            'rgb('+ this.R +','+ this.G +','+ this.B +')'
        );
    }
};

cell.prototype.bind_dom = function (dom) {
    this.dom = dom;
    this.dom.addClass('cell');
    this.set_color(this.R, this.G, this.B);
};

cell.prototype.generate_pulse = function () {
    if (!this.is_center) { return; }
    var t = this;

    if (t.dom != null) {
        // no dom element, no pulse generated
        var msg = {};
        msg.type = MSG_WAVE;
        msg.master = t.dom.attr('id');
        msg.distance = 0;
        t.send(msg, O);
        if (t.growth_counter >= t.growth_delay) {
            t.grow_cell();
            t.growth_counter = 0;
        }
    }

    // next pulse
    setTimeout(function () {
        t.growth_counter += t.pulse_interval * PULSE_INTERVAL_UNIT;
        t.generate_pulse();
    }, t.pulse_interval * PULSE_INTERVAL_UNIT);
};

cell.prototype.grow_cell = function () {
    var t = this;
    if (t.row == null) { return; }
    var new_cell_direction = sample([U, L, R, D].filter(function (x) {
        return t.distance_map[x.row][x.col] > t.distance_map[0][0];
    }));
    var new_cell_coord = new_cell_direction.add(new vector(t.row, t.col));
    var target_cell = map.get_cell_at(new_cell_coord);
    if (target_cell == null) {
        map.put_cell(t.copy(), new_cell_coord);
    } else if (target_cell.gene() == t.gene()) {
        var msg = {};
        msg.type = MSG_GROW;
        msg.master = this.dom.attr('id');
        msg.distance = 0;
        t.send(msg, new_cell_direction)
    }
};

cell.prototype.send = function (msg, direction) {
    if (this.row == null) { return; }
    var v = new vector(this.row, this.col).add(direction);
    var other_cell = map.get_cell_at(v);
    if (other_cell == null) { return; }
    $(other_cell).trigger('MESSAGE', [msg, direction.reverse]);
};

cell.prototype.receive = function (e, msg, from) {
    var t = this;
    switch (msg.type) {
    case MSG_WAVE:
        t.pulse_queue[from.row][from.col] = msg;
        t.distance_map[from.row][from.col] = msg.distance;
        if (msg.distance + 1 < t.distance_map[0][0]) {
            t.distance_map[0][0] = msg.distance + 1;
        }
        switch (t.master) {
        case null:
            t.master = msg.master;
            break;
        case msg.master:
            break;
        default:
            break;
        }
        t.pulse_queue_dirty = true;
        if (t.dom) {
            t.dom.removeClass('block').addClass('pulse-block');
            // t.dom.text(t.distance_map[0][0]);
        }

        if (t.pulse_queue_dirty) {
            setTimeout(function () {
                var msg = {};
                msg.type = MSG_WAVE;
                msg.distance = t.distance_map[0][0];
                msg.master = t.master;
                if (t.dom) {
                    t.dom.removeClass('pulse-block').addClass('block');
                }
                for (var i = 0; i < SHAPE_VECTOR[t.shape].length; i++) {
                    var sv = SHAPE_VECTOR[t.shape][i]
                    if (t.distance_map[sv.row][sv.col] > t.distance_map[0][0]) {
                        t.send(msg, SHAPE_VECTOR[t.shape][i]);
                    }
                }
                t.pulse_queue_dirty = false;
                if (t.growth_flag) {
                    t.grow_cell();
                    t.growth_flag = false;
                }
            }, t.pulse_delay * PULSE_DELAY_UNIT);
        }
        break;
    case MSG_GROW:
        t.growth_flag = true;
        break;
    }
};

cell.prototype.set_center = function (c) {
    if (c == undefined) {
        c = true;
    }

    if (this.is_center == c) { return; }

    this.is_center = c;
    if (this.is_center) {
        var t = this;
        setTimeout(t.generate_pulse(), 0);
    }
};

cell.prototype.copy = function () {
    var c = new cell();
    c.R = this.R;
    c.G = this.G;
    c.B = this.B;
    c.shape = this.shape;
    c.pulse_interval = this.pulse_interval;
    c.pulse_delay = this.pulse_delay;
    c.growth_delay = this.growth_delay;
    c.allow_neighbors = this.allow_neighbors;
    return c;
};

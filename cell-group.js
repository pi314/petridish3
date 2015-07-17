function cell_group (r, g, b) {
    // cell gene related attributes
    this.R = r;
    this.G = g;
    this.B = b;
    this.shape = null;
    this.pulse_interval = null;     // unit: 50ms
    this.pulse_delay = null;        // unit: 10ms
    this.growth_delay = null;       // unit: 500ms
    this.allow_neighbors = null;

    // center coordinate
    this.row = null;
    this.col = null;

    // member cell list
    this.member = [];
}

cell_group.prototype.gene = function () {
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

cell_group.prototype.put_cell = function (v, col) {
    if (!(v instanceof vector)) {
        v = new vector(v, col);
    }
    var c = new cell(this);
    map.put_cell(c, v);
    if (!(c.distance in this.member)) {
        this.member[c.distance] = {};
    }
    this.member[c.distance][c.id] = c;
};

cell_group.prototype.set_center = function (v, col) {
    var t = this;
    if (!(v instanceof vector)) {
        v = new vector(v, col);
    }
    t.row = v.row;
    t.col = v.col;
    map.get_cell_at(t.row, t.col).set_distance(0);
    setTimeout(function () {
        t.generate_pulse();
    }, 0);
};

cell_group.prototype.set_distance = function (c, new_dist) {
    delete this.member[c.distance][c.id];
    c.distance = new_dist;
    if (!(c.distance in this.member)) {
        this.member[c.distance] = {};
    }
    this.member[c.distance][c.id] = c;
};

cell_group.prototype.generate_pulse = function () {
    if (this.row == null || this.col == null) { return; }
    console.log('pulse');
    var t = this;

    t.wave_up();

    // next pulse
    setTimeout(function () {
        t.growth_counter += t.pulse_interval * PULSE_INTERVAL_UNIT;
        t.generate_pulse();
    }, t.pulse_interval * PULSE_INTERVAL_UNIT);
};

cell_group.prototype.wave_up = function (wave_distance) {
    var t = this;
    if (wave_distance == undefined) {
        wave_distance = 0;
    }

    for (var i in this.member[wave_distance]) {
        var c = t.member[wave_distance][i];
        c.dom.removeClass('block').addClass('pulse-block');
        var v = new vector(c.row, c.col);
        for (var j = 0; j < SHAPE_VECTOR[this.shape].length; j++) {
            var cc = map.get_cell_at(v.add(SHAPE_VECTOR[this.shape][j]))
            if (cc != null && cc.distance == Infinity) {
                cc.set_distance(c.distance + 1);
            }
        }
    }

    setTimeout(function () {
        t.wave_down(wave_distance);
        t.wave_up(wave_distance + 1);
    }, t.pulse_delay * PULSE_DELAY_UNIT);
};

cell_group.prototype.wave_down = function (wave_distance) {
    for (var i in this.member[wave_distance]) {
        this.member[wave_distance][i].dom.removeClass('pulse-block').addClass('block');
    }
};

cell_group.prototype.grow_cell = function () {
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

cell_group.prototype.send = function (msg, direction) {
    if (this.row == null) { return; }
    var v = new vector(this.row, this.col).add(direction);
    var other_cell = map.get_cell_at(v);
    if (other_cell == null) { return; }
    $(other_cell).trigger('MESSAGE', [msg, direction.reverse]);
};

cell_group.prototype.receive = function (e, msg, from) {
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

cell_group.prototype.copy = function () {
    var c = new cell_group();
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

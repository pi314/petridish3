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

    // member cell list, indexed by their distance (to center)
    this.member = {};

    // cell growth related attributes
    this.grow_flag = false;
    this.growth_counter = 0;
    this.grow_distance = null;
}

cell_group.prototype.gene = function (new_gene) {
    // get/set the cell's gene, not finished yet
    var ret = '';
    ret += to_hex(this.R, 2);
    ret += to_hex(this.G, 2);
    ret += to_hex(this.B, 2);
    ret += {0: '0', 1: '1', null: 'Z'}[this.shape];
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
    // the cell get its id AFTER the it is on the map
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
    var t = this;

    if (t.growth_counter >= t.growth_delay) {
        t.grow_flag = true;
        t.grow_distance = parseInt(sample(
            Object.keys(t.member).filter(
                function (x) { return x != 'Infinity'}
            )
        ));
        t.growth_counter = 0;
    }

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

    if (!(wave_distance in this.member) ||
            Object.keys(this.member[wave_distance]).length == 0) {
        // no further cells, stop pulsing
        if (t.grow_flag && wave_distance == t.grow_distance) {
            // unfortunately we did not successfully grow new cell
            // find a new place from start
            t.grow_distance = 0;
        }
        return;
    }

    var available_space = [];
    for (var i in this.member[wave_distance]) {
        var this_cell = t.member[wave_distance][i];
        this_cell.dom.removeClass('block').addClass('pulse-block');
        var this_coord = new vector(this_cell.row, this_cell.col);
        // check surrounding cells (according to their pulse shape)
        for (var j = 0; j < SHAPE_VECTOR[this.shape].length; j++) {
            var neighbor_coord = this_coord.add(SHAPE_VECTOR[this.shape][j]);
            var neighbor_cell = map.get_cell_at(neighbor_coord)

            if (neighbor_cell == EMPTY) {
                // neighbor cell is empty, add it into check list
                if (t.grow_flag && wave_distance == t.grow_distance) {
                    available_space.push(neighbor_coord);
                }
            } else if (neighbor_cell.group == this_cell.group) {
                // neighbor cell is not empty, and we are in same group
                // update its distance
                if (neighbor_cell.distance == Infinity ||
                        this_cell.distance + 1 < neighbor_cell.distance) {
                    neighbor_cell.set_distance(this_cell.distance + 1);
                }
            }
        }
    }

    if (t.grow_flag && wave_distance == t.grow_distance) {
        // we need to grow a new cell, check available place to put
        var neighbor_coord = sample(available_space)
        if (neighbor_coord != undefined) {
            t.put_cell(neighbor_coord);
            t.grow_flag = false;
        } else {
            t.grow_distance += 1;
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

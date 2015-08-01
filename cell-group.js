PULSE_INTERVAL_UNIT = 50;
PULSE_DELAY_UNIT = 10;
GROWTH_UNIT = 500;

MERGE_INDEX = 15;

DIAMAND = 0;
SQUARE = 1;

SHAPE_VECTOR = {};
SHAPE_VECTOR[DIAMAND] = [U, L, R, D];
SHAPE_VECTOR[SQUARE] = [U, L, R, D, UL, UR, DL, DR];

STATE_FREEZE = 0;
STATE_PETRIDISH = 1;
STATE_HARVEST = 2;
STATE_SURRENDER = 3;

function cell_group (gene) {
    // cell gene related attributes
    if (gene == undefined) {
        // default null values
        this.color = null;
        this.shape = null;
        this.pulse_interval = null;     // unit: 50ms
        this.pulse_delay = null;        // unit: 10ms
        this.growth_delay = null;       // unit: 500ms
        this.allow_neighbors = null;
    } else {
        this.color = int(gene[0], 16);
        this.shape = int(gene[1], 16);
        this.pulse_interval = int(gene.slice(2, 4), 16);
        this.pulse_delay = int(gene.slice(4, 5), 16);
        this.growth_delay = int(gene.slice(5, 7), 16);
        this.allow_neighbors = int(gene.slice(7, 9), 16);
    }

    // center coordinate
    this.row = null;
    this.col = null;

    // member cells
    this.member = {};

    // cell growth related attributes
    this.grow_flag = false;
    this.growth_counter = 0;

    // to identify different pulses
    this.pulse_counter = 1;

    this.state = STATE_FREEZE;
    this.move_center_counter = 0;
}

cell_group.prototype.gene = function () {
    // get the cell's gene
    var ret = '';
    ret += hex(this.color, 1);
    ret += {0: '0', 1: '1', null: 'Z'}[this.shape];
    ret += hex(this.pulse_interval, 2);
    ret += hex(this.pulse_delay, 1);
    ret += hex(this.growth_delay, 2);
    ret += hex(this.allow_neighbors, 2);
    return ret;
};

cell_group.prototype.put_cell = function (v, col) {
    if (!(v instanceof vector)) {
        v = new vector(v, col);
    }
    var target_cell = map.get_cell_at(v);
    if (target_cell == EMPTY) {
        target_cell = new cell(this);
    } else {
        target_cell.group = this;
        target_cell.timestamp = 0;
    }
    map.put_cell(target_cell, v);
    // the cell get its id AFTER the it is on the map
    this.member[target_cell.id] = target_cell;
};

cell_group.prototype.set_center = function (v, col) {
    var t = this;
    if (!(v instanceof vector)) {
        v = new vector(v, col);
    }
    t.row = v.row;
    t.col = v.col;
    if (this.state == STATE_FREEZE) {
        this.state = STATE_PETRIDISH;
        setTimeout(function () {
            t.generate_pulse();
        }, 0);
    }
};

cell_group.prototype.center_coord = function () {
    return new vector(this.row, this.col);
};

cell_group.prototype.cell_amount = function () {
    return Object.keys(this.member).length;
};

cell_group.prototype.generate_pulse = function () {
    if (this.state != STATE_PETRIDISH) { return; }
    if (this.row == null || this.col == null) { return; }
    var t = this;

    if (t.growth_counter >= t.growth_delay * GROWTH_UNIT) {
        if (!t.grow_flag) {
            t.grow_flag = true;
        }
        t.growth_counter = 0;
    }

    var pulse_data = {};
    var center_cell = map.get_cell_at(t.row, t.col);
    pulse_data['receivers'] = {};
    pulse_data['receivers'][center_cell.id] = center_cell;
    pulse_data['timestamp'] = t.pulse_counter;
    pulse_data['distance'] = 0;
    pulse_data['friends'] = {};
    t.pulse_up(pulse_data);
    t.pulse_counter += 1;

    // next pulse
    setTimeout(function () {
        t.growth_counter += t.pulse_interval * PULSE_INTERVAL_UNIT;
        t.generate_pulse();
    }, t.pulse_interval * PULSE_INTERVAL_UNIT);
};

cell_group.prototype.pulse_up = function (pulse_data) {
    var t = this;
    if (t.state != STATE_PETRIDISH) { return; }
    if (Object.keys(pulse_data['receivers']).length == 0
            && Object.keys(pulse_data['friends']).length == 0) {
        console.log('end of pulse');
        return;
    }

    var grow_here = choice([true, true, false]);
    var available_space = [];
    var current_receivers = pulse_data['receivers'];
    var current_friends = pulse_data['friends']
    var next_receivers = {};
    for (var i in current_receivers) {
        var this_cell = current_receivers[i];
        this_cell.dom.removeClass('block').addClass('pulse-block');
        this_cell.timestamp = pulse_data['timestamp'];
        this_cell.distance = pulse_data['distance'];

        // check surrounding cells (based on their pulse shape)
        var neighbors = this_cell.neighbors();
        if (t.grow_flag && grow_here) {
            for (var j in neighbors['empty']) {
                available_space.push(neighbors['empty'][j]);
            }
        }

        for (var j in neighbors['team']) {
            if (neighbors['team'][j].timestamp < pulse_data['timestamp']) {
                next_receivers[neighbors['team'][j].id] = neighbors['team'][j];
            }
        }

        // same gene but different group, detecting their center
        for (var j in neighbors['friends']) {
            current_friends[neighbors['friends'][j].id] = neighbors['friends'][j];
        }
    }

    var next_friends = {};
    for (var i in current_friends) {
        var this_cell = current_friends[i];
        this_cell.dom.addClass('message-block');

        var neighbors = this_cell.neighbors();
        for (var j in neighbors['team']) {
            if (neighbors['team'][j].distance < this_cell.distance) {
                next_friends[neighbors['team'][j].id] = neighbors['team'][j];
            }
        }
    }

    // detecting friend group's center
    var next_friends_index = Object.keys(next_friends);
    if (next_friends_index.length == 1) {
        var last_one_friend = next_friends[next_friends_index[0]];
        if (last_one_friend.is_center()) {
            // got their center
            var friend_group = last_one_friend.group;
            if (friend_group.cell_amount() > t.cell_amount()) {
                // they are more than my group, merge into them
                if (randrange(MERGE_INDEX) == 0) {
                    t.state = STATE_SURRENDER;
                    for (var i in t.member) {
                        friend_group.put_cell(t.member[i].coord());
                        delete t.member[i];
                    }
                }
            }
        }
    }

    // we need to grow a new cell, check available place to put
    if (t.grow_flag && grow_here && available_space.length > 0) {
        // we got a place to put cell
        var neighbor_coord = choice(available_space)
        // check if we need to create a new mutated cell group
        // but white cell doesn't mutate
        if (t.color != 10 && randrange(100) == 0) {
            var mutated_cg = t.mutate();
            mutated_cg.put_cell(neighbor_coord);
            mutated_cg.set_center(neighbor_coord);
        } else {
            t.put_cell(neighbor_coord);
            var next_cell = map.get_cell_at(neighbor_coord);
            next_receivers[next_cell.id] = next_cell;
        }
        t.grow_flag = false;
    }

    pulse_data['distance'] += 1;
    pulse_data['receivers'] = next_receivers;
    pulse_data['friends'] = next_friends;
    setTimeout(function () {
        for (var i in current_friends) {
            current_friends[i].dom.removeClass('message-block');
        }
        t.pulse_down(current_receivers);
        t.pulse_up(pulse_data);
    }, t.pulse_delay * PULSE_DELAY_UNIT);
};

cell_group.prototype.pulse_down = function (current_receivers) {
    if (this.state != STATE_PETRIDISH && this.state != STATE_SURRENDER) { return; }
    for (var i in current_receivers) {
        current_receivers[i].dom.removeClass('pulse-block').addClass('block');
    }
};

cell_group.prototype.copy = function () {
    var c = new cell_group();
    c.color = this.color;
    c.shape = this.shape;
    c.pulse_interval = this.pulse_interval;
    c.pulse_delay = this.pulse_delay;
    c.growth_delay = this.growth_delay;
    c.allow_neighbors = this.allow_neighbors;
    return c;
};

cell_group.prototype.harvest = function (coord) {
    var t = this;
    if (t.state == STATE_HARVEST) { return; }
    t.row = coord.row;
    t.col = coord.col;
    t.state = STATE_HARVEST;
    t.grow_flag = false;

    var farest_distance = 0;
    var distance_indexed_member = {};
    var this_cell = map.get_cell_at(coord);
    var queue = [new pair(this_cell, 0)];
    delete t.member[this_cell.id];
    while (queue.length > 0) {
        var this_pair = queue.shift();
        var this_cell = this_pair.first;
        var this_dist = this_pair.second;

        this_cell.distance = this_dist;
        if (!(this_dist in distance_indexed_member)) {
            distance_indexed_member[this_dist] = [];
        }
        distance_indexed_member[this_dist].push(this_cell);
        farest_distance = Math.max(farest_distance, this_dist);
        var this_coord = new vector(this_cell.row, this_cell.col);
        for (var i in SHAPE_VECTOR[DIAMAND]) {
            var next_cell = map.get_cell_at(this_coord.add(SHAPE_VECTOR[DIAMAND][i]));
            if (next_cell != EMPTY && next_cell.id in t.member) {
                queue.push(new pair(next_cell, this_dist + 1));
                delete t.member[next_cell.id];
            }
        }
    }

    t.member = distance_indexed_member;
    setTimeout(function () {
        t.shake(0);
        t.harvest_round(farest_distance);
    }, 0);
};

cell_group.prototype.harvest_round = function (distance) {
    var t = this;
    if (distance < 0) { return; }
    inventory.add(t, Object.keys(t.member[distance]).length);
    for (var c in t.member[distance]) {
        map.destroy_cell(t.member[distance][c]);
    }
    delete t.member[distance];
    setTimeout(function () {
        t.harvest_round(distance - 1);
    }, t.pulse_delay * PULSE_DELAY_UNIT);
};

cell_group.prototype.shake = function (odd) {
    var t = this;
    if (t.state != STATE_HARVEST) { return; }
    for (d in t.member) {
        for (var c in t.member[d]) {
            var this_cell = t.member[d][c];
            if (d % 2 == odd) {
                this_cell.dom.removeClass('pulse-block').addClass('block');
            } else {
                this_cell.dom.removeClass('block').addClass('pulse-block');
            }
        }
    }
    setTimeout(function () {
        t.shake(1-odd);
    }, t.pulse_delay * PULSE_DELAY_UNIT);
};

cell_group.prototype.mutate = function () {
    var mutated_cg = this.copy();
    var r = randrange(50);
    if (r == 0) {
        mutated_cg.color = 10;  // ranbow cell, not implemented yet
    } else if (r < 10) {
        mutated_cg.color = 10;
    } else {
        mutated_cg.color = (mutated_cg.color + choice([1, -1]) + 10) % 10;
    }
    return mutated_cg;
};

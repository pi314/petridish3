function cell () {
    this.R = 0;
    this.G = 0;
    this.B = 0;
    this.shape = null;
    this.pulse_interval = 0;        // unit: 50ms
    this.pulse_delay = 0;           // unit: 10ms
    this.growth_delay = 0;          // unit: 500ms
    this.allow_neighbors = 255;

    this.dom = null;
    this.is_center = false;
    this.growth_counter = 0;
    this.growth_direction = null;
    this.pulse_queue = [];
    $(this).bind('MESSAGE', this.receive);
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
        $(t).trigger('MESSAGE', [MSG_WAVE, t.dom.attr('id'), [0, 0]]);
    }

    setTimeout(function () {
        t.generate_pulse();
    }, t.pulse_interval * PULSE_INTERVAL_UNIT);
};

cell.prototype.send = function (type, value, direction) {
    if (this.dom == null) { return; }
    var coord = map.get_coordinate(this);
    if (coord == null) { return; }
    var v = vector_add(coord, direction);
    var other_cell = map.get_cell_at(v[0], v[1]);
    if (other_cell == null) { return; }
    $(other_cell).trigger('MESSAGE', [type, value, [-direction[0], -direction[1]]]);
};

cell.prototype.receive = function (e, type, value, from) {
    var t = this;
    t.pulse_queue.push(from);
    if (t.dom) {
        t.dom.removeClass('block').addClass('pulse-block');
    }

    if (t.pulse_queue.length == 1) {
        setTimeout(function () {
            if (t.dom) {
                t.dom.removeClass('pulse-block').addClass('block');
            }
            for (var i = 0; i < SHAPE_VECTOR[t.shape].length; i++) {
                var j = array_index_of(t.pulse_queue, SHAPE_VECTOR[t.shape][i]);
                if (j == -1) {
                    t.send(type, value, SHAPE_VECTOR[t.shape][i]);
                }
            }
            while (t.pulse_queue.length) { t.pulse_queue.pop(); }
        }, t.pulse_delay * PULSE_DELAY_UNIT);
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

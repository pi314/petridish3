function cell () {
    this.dom = null;
    this.is_center = false;
    this.R = 0;
    this.G = 0;
    this.B = 0;
    this.shape = null;
    this.pulse_interval = 0;        // unit: 50ms
    this.pulse_delay = 0;           // unit: 10ms
    this.growth_delay = 0;          // unit: 500ms
    this.allow_neighbors = 255;
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

cell.prototype.pulse_loop = function () {
    if (!this.is_center) { return; }
    var t = this;

    this.dom.removeClass('block').addClass('pulse-block');

    setTimeout(function () {
        t.dom.removeClass('pulse-block').addClass('block');
    }, t.pulse_delay * PULSE_DELAY_UNIT);

    setTimeout(function () {
        t.pulse_loop();
    }, t.pulse_interval * PULSE_INTERVAL_UNIT);
};

cell.prototype.set_center = function (c) {
    if (c == undefined) {
        c = true;
    }

    if (this.is_center == c) { return; }

    this.is_center = c;
    if (this.is_center) {
        var t = this;
        setTimeout(t.pulse_loop(), 0);
    }
};

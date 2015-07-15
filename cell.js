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


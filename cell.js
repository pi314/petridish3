function cell (group) {
    this.row = null;
    this.col = null;
    this.id = null;
    this.group = group;
    this.distance = Infinity;
    this.dom = null;
}

cell.prototype.bind_dom = function (dom) {
    this.dom = dom;
    this.dom.addClass('cell').removeClass('empty');
    var g = this.group;
    this.dom.css('background', format('rgb({}, {}, {})', g.R, g.G, g.B));
    this.id = dom.attr('id');
};

cell.prototype.set_distance = function (new_dist) {
    this.group.set_distance(this, new_dist);
};

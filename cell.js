function cell (group) {
    this.row = null;
    this.col = null;
    this.id = null;
    this.group = group;
    this.timestamp = 0;
    this.dom = null;
}

cell.prototype.bind_dom = function (dom) {
    this.dom = dom;
    this.dom.addClass('cell').removeClass('empty');
    var g = this.group;
    this.dom.css('background', '#{}'.format(COLORS[g.color].hex));
    this.id = dom.attr('id');
};

cell.prototype.neighbors = function () {
    var this_coord = new vector(this.row, this.col);
    var ret = {
        'empty': [],
        'team': [],
    };
    for (var j in SHAPE_VECTOR[this.group.shape]) {
        var neighbor_coord = this_coord.add(SHAPE_VECTOR[this.group.shape][j]);
        var neighbor_cell = map.get_cell_at(neighbor_coord)

        if (neighbor_cell == EMPTY) {
            ret['empty'].push(neighbor_coord);
        } else if (neighbor_cell.group == this.group) {
            ret['team'].push(neighbor_cell);
        }
    }
    return ret;
};

function parse_id (id) {
    var coord = /^cell-(\d+)-(\d+)$/.exec(id);
    if (coord == null) { return null; }
    return new vector(int(coord[1]), int(coord[2]));
};

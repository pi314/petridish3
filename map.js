OUT_OF_MAP = 1;
EMPTY = 2;

var map = {};

map.WIDTH = 27;
map.HEIGHT = 27;

map.init = function () {
    var s = '';
    for (var i = 0; i < map.HEIGHT; i++) {
        s += '<div class="row">';
        for (var j = 0; j < map.WIDTH; j++) {
            s += '<div id="cell-{}-{}" class="block empty"></div>'.format(i, j);
        }
        s += '</div>';
    }
    $('#petridish').append(s);

    petridish = [];
    for (var i = 0; i < map.HEIGHT; i++) {
        petridish[i] = [];
        for (var j = 0; j < map.WIDTH; j++) {
            petridish[i][j] = EMPTY;
        }
    }

};

map.put_cell = function (c, v, col) {
    if (!(v instanceof vector)) {
        v = new vector(v, col);
    }
    if (0 <= v.row && v.row < map.HEIGHT && 0 <= v.col && v.col < map.WIDTH) {
        petridish[v.row][v.col] = c;
        c.row = v.row;
        c.col = v.col;
        c.bind_dom($('#cell-{}-{}'.format(v.row, v.col)));
    }
};

map.get_coordinate = function (c) {
    if (c.dom == null) { return null; }
    var res = /^cell-(\d+)-(\d+)$/.exec(c.dom.attr('id'));
    if (res == null) { return null; }
    return [parseInt(res[1]), parseInt(res[2])];
}

map.get_cell_at = function (v, col) {
    if (!(v instanceof vector)) {
        v = new vector(v, col);
    }
    if (v.row < 0 || v.row >= map.HEIGHT) { return OUT_OF_MAP; }
    if (v.col < 0 || v.col >= map.WIDTH) { return OUT_OF_MAP; }
    return petridish[v.row][v.col];
}

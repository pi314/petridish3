var map = {};

map.WIDTH = 27;
map.HEIGHT = 27;

map.init = function () {
    var s = '';
    for (var i = 0; i < map.HEIGHT; i++) {
        s += '<div class="row">';
        for (var j = 0; j < map.WIDTH; j++) {
            s += '<div id="cell-'+ i +'-'+ j +'" class="block empty"></div>';
        }
        s += '</div>';
    }
    $('#petridish').append(s);

    petridish = [];
    for (var i = 0; i < map.HEIGHT; i++) {
        petridish[i] = [];
        for (var j = 0; j < map.WIDTH; j++) {
            petridish[i][j] = null;
        }
    }

};

map.put_cell = function (c, row, col) {
    if (0 <= row && row < map.HEIGHT && 0 <= col && col < map.WIDTH) {
        petridish[row][col] = c;
        c.bind_dom($(format('#cell-{}-{}', row, col)));
    }
};

map.get_coordinate = function (c) {
    if (c.dom == null) { return null; }
    var res = /^cell-(\d+)-(\d+)$/.exec(c.dom.attr('id'));
    if (res == null) { return null; }
    return [parseInt(res[1]), parseInt(res[2])];
}

map.get_cell_at = function (row, col) {
    if (row < 0 || row >= map.HEIGHT) { return null; }
    if (col < 0 || col >= map.WIDTH) { return null; }
    return petridish[row][col];
}

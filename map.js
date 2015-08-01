OUT_OF_MAP = 1;
EMPTY = 2;

var map = {};

map.WIDTH = 27;
map.HEIGHT = 27;

map.init = function () {
    var s = '';
    for (var i = 0; i < map.HEIGHT; i++) {
        s += '<div class="map-row">';
        for (var j = 0; j < map.WIDTH; j++) {
            s += '<div id="cell-{}-{}" class="block empty"></div>'.format(i, j);
        }
        s += '</div>';
    }
    $('#petridish').append(s);
    for (var i = 0; i < map.HEIGHT; i++) {
        for (var j = 0; j < map.WIDTH; j++) {
            $('#cell-{}-{}'.format(i, j))
                .mouseenter(mouse.enter_block)
                .click(function () {
                    mouse.click_block($(this));
                    return false;
                });
        }
    }

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
        if (petridish[v.row][v.col] == c) {
            ;
        } else {
            petridish[v.row][v.col] = c;
            c.row = v.row;
            c.col = v.col;
            var target_dom = $('#cell-{}-{}'.format(v.row, v.col));
            c.bind_dom(target_dom);
            unfocus_block(target_dom);
        }
    }
};

map.destroy_cell = function (v, col) {
    if (v instanceof Number && col instanceof Number) {
        v = new vector(v, col);
    } else if (v instanceof cell && col == undefined) {
        v = new vector(v.row, v.col);
    } else {
        return;
    }
    if (0 <= v.row && v.row < map.HEIGHT && 0 <= v.col && v.col < map.WIDTH) {
        petridish[v.row][v.col] = EMPTY;
        var target_dom = $('#cell-{}-{}'.format(v.row, v.col))
        target_dom.removeAttr('style');
        target_dom.removeClass('pulse-block');
        target_dom.removeClass('cell');
        target_dom.addClass('empty');
        target_dom.addClass('block');
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

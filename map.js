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
    petridish[row][col] = c;
    console.log(c, $(format('#cell-{}-{}', row, col)));
    c.bind_dom($(format('#cell-{}-{}', row, col)));
};

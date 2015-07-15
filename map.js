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

};

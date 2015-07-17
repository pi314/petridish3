$(function () {
    map.init();

    cg = new cell_group(0, 255, 0);
    cg.shape = DIAMAND;
    cg.pulse_interval = 30;
    cg.pulse_delay = 10;
    cg.growth_delay = 2;
    cg.allow_neighbors = 255;
    for (var i = 0; i < map.HEIGHT; i++) {
        for (var j = 0; j < map.WIDTH; j++) {
            cg.put_cell(i, j);
        }
    }
    console.log('a');
    cg.set_center(10, 10);
    console.log('b');

});

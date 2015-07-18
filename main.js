$(function () {
    map.init();

    var cg = new cell_group(0, 255, 0);
    cg.shape = DIAMAND;
    cg.pulse_interval = 30;
    cg.pulse_delay = 10;
    cg.growth_delay = 2;
    cg.allow_neighbors = 255;
    inventory.add(cg, 1);

});

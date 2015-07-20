$(function () {
    map.init();

    var cg = new cell_group();
    cg.R = 0;
    cg.G = 255;
    cg.B = 0;
    cg.shape = DIAMAND;
    cg.pulse_interval = 30;
    cg.pulse_delay = 10;
    cg.growth_delay = 2;
    cg.allow_neighbors = 255;
    inventory.add(cg, 3);
    cg.R = 0;
    cg.G = 255;
    cg.B = 255;
    inventory.add(cg, 3);
    cg.R = 255;
    cg.G = 100;
    cg.B = 100;
    inventory.add(cg, 3);
    cg.R = 255;
    cg.G = 0;
    cg.B = 255;
    inventory.add(cg, 3);
    cg.R = 255;
    cg.G = 255;
    cg.B = 0;
    inventory.add(cg, 3);
    cg.R = 0;
    cg.G = 0;
    cg.B = 255;
    inventory.add(cg, 3);

    $(document).mousemove(function (e) {
        mouse.mousemove(e.clientY, e.clientX);
    });

    $('#tool-pipette').click(mouse.take_pipette);

});

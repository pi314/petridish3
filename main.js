$(function () {
    map.init();
    var cg = new cell_group();
    cg.shape = DIAMAND;
    cg.pulse_interval = 30;
    cg.pulse_delay = 10;
    // cg.growth_delay = 40;
    cg.growth_delay = 2;
    cg.allow_neighbors = 255;
    cg.color = 0;
    inventory.add(cg, 0);
    cg.color = 1;
    inventory.add(cg, 0);
    cg.color = 2;
    inventory.add(cg, 0);
    cg.color = 3;
    inventory.add(cg, 0);
    cg.color = 4;
    inventory.add(cg, 1);   // lime
    cg.color = 5;
    inventory.add(cg, 0);
    cg.color = 6;
    inventory.add(cg, 0);
    cg.color = 7;
    inventory.add(cg, 0);
    cg.color = 8;
    inventory.add(cg, 0);
    cg.color = 9;
    inventory.add(cg, 0);
    cg.color = 10;
    inventory.add(cg, 0);

    $(document).mousemove(function (e) {
        mouse.mousemove(e.clientY, e.clientX);
    });

    $('#petridish')
        .mouseleave(mouse.leave_petridish)
        .click(mouse.click_petridish);

    $('#tool-pipette').click(mouse.take_pipette);

    cg.color = 4;
    for (var i = 0; i < 20; i++) {
        for (var j = 0; j < 20; j++) {
            cg.put_cell(i, j);
        }
    }
    cg.set_center(10, 10);

});

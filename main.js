$(function () {
    map.init();
    var cg = new cell_group();
    cg.shape = DIAMAND;
    cg.pulse_interval = 30;
    cg.pulse_delay = 10;
    cg.growth_delay = 2;
    cg.allow_neighbors = 255;
    cg.color = COLORS[0];
    inventory.add(cg, 3);
    cg.color = COLORS[1];
    inventory.add(cg, 0);
    cg.color = COLORS[2];
    inventory.add(cg, 3);
    cg.color = COLORS[3];
    inventory.add(cg, 0);
    cg.color = COLORS[4];
    inventory.add(cg, 3);
    cg.color = COLORS[5];
    inventory.add(cg, 0);
    cg.color = COLORS[6];
    inventory.add(cg, 3);
    cg.color = COLORS[7];
    inventory.add(cg, 3);
    cg.color = COLORS[8];
    inventory.add(cg, 3);
    cg.color = COLORS[9];
    inventory.add(cg, 0);
    cg.color = COLORS[10];
    inventory.add(cg, 0);

    $(document).mousemove(function (e) {
        mouse.mousemove(e.clientY, e.clientX);
    });

    $('#petridish')
        .mouseleave(mouse.leave_petridish)
        .click(mouse.click_petridish);

    $('#tool-pipette').click(mouse.take_pipette);

});

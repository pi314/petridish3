$(function () {
    map.init();
    var c = new cell();
    c.set_color(0, 255, 0);
    c.shape = DIAMAND;
    c.pulse_interval = 30;
    c.pulse_delay = 10;
    var cg = c.gene();
    inventory.add(cg);
    c.bind_dom($(format('#{} > .cell', cg)));
    c.set_center();

});

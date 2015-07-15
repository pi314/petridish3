$(function () {
    map.init();
    var c = new cell();
    c.set_color(0, 255, 0);
    var cg = c.gene();
    inventory.add(cg);
    c.bind_dom($(format('#{} > .cell', cg)));

});

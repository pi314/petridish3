MOUSE_FREE = 0;
MOUSE_HOLD_CELL = 1;

var mouse = {};

mouse.state = MOUSE_FREE;
mouse.selected_cell_gene = null;
mouse.color = null;

mouse.select_inventory = function (e, cell_gene) {
    switch (mouse.state) {
    case MOUSE_FREE:
        mouse.selected_cell_gene = cell_gene;
        $('#{}'.format(mouse.selected_cell_gene)).addClass('inventory-cell-item-selected');
        mouse.state = MOUSE_HOLD_CELL;
        mouse.mousemove(e.pageY, e.pageX);
        mouse.set_color(mouse.selected_cell_gene.substr(0, 6));
        mouse.show();
        break;

    case MOUSE_HOLD_CELL:
        if (mouse.selected_cell_gene == cell_gene) {
            $('#{}'.format(mouse.selected_cell_gene)).removeClass('inventory-cell-item-selected');
            mouse.state = MOUSE_FREE;
            mouse.hide();
        } else {
            $('#{}'.format(mouse.selected_cell_gene)).removeClass('inventory-cell-item-selected');
            mouse.selected_cell_gene = cell_gene;
            $('#{}'.format(mouse.selected_cell_gene)).addClass('inventory-cell-item-selected');
            mouse.set_color(mouse.selected_cell_gene.substr(0, 6));
        }
        break;

    }
};

mouse.mousemove = function (top, left, force) {
    if (mouse.state != MOUSE_HOLD_CELL) { return; }
    $('#cursor-cell-icon').css({
        'top': top - 13,
        'left': left + 3,
    });
};

mouse.set_color = function (color) {
    mouse.color = '#{}'.format(color);
    $('#cursor-cell-icon').css('background', mouse.color);
};

mouse.show = function () {
    $('#cursor-cell-icon').removeClass('hidden');
};

mouse.hide = function () {
    $('#cursor-cell-icon').addClass('hidden');
};

mouse.enter_block = function (e) {
    if (mouse.state == MOUSE_HOLD_CELL) {
        var coord = parse_id($(this).attr('id'));
        if (map.get_cell_at(coord) == EMPTY) {
            $(this).addClass('cell cell-shadow');
            $(this).css('background', mouse.color);
        }
    }
};

mouse.leave_block = function (e) {
    if (mouse.state == MOUSE_HOLD_CELL) {
        var coord = parse_id($(this).attr('id'));
        if (map.get_cell_at(coord) == EMPTY) {
            $(this).removeClass('cell cell-shadow');
            $(this).removeAttr('style');
        }
    }
};

mouse.click_block = function (e) {
    if (mouse.state == MOUSE_HOLD_CELL) {
        var coord = parse_id($(this).attr('id'));
        $(this).removeClass('cell-shadow');
        $(this).removeAttr('style');
        var cg = new cell_group(mouse.selected_cell_gene);
        cg.put_cell(coord);
        cg.set_center(coord);

        mouse.hide();
        mouse.state = MOUSE_FREE;

        inventory.sub(mouse.selected_cell_gene);
        $('#{}'.format(mouse.selected_cell_gene)).removeClass('inventory-cell-item-selected');
    }
};

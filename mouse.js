MOUSE_FREE = 0;
MOUSE_SELECT_INVENTORY = 1;

var mouse = {};

mouse.state = MOUSE_FREE;
mouse.selected_cell = null;

mouse.select_inventory = function (e, cell_gene) {
    switch (mouse.state) {
    case MOUSE_FREE:
        mouse.selected_cell = cell_gene;
        $('#{}'.format(mouse.selected_cell)).addClass('inventory-cell-item-selected');
        mouse.state = MOUSE_SELECT_INVENTORY;
        mouse.mousemove(e.pageY, e.pageX);
        mouse.set_color(mouse.selected_cell.substr(0, 6));
        mouse.show();
        break;

    case MOUSE_SELECT_INVENTORY:
        if (mouse.selected_cell == cell_gene) {
            $('#{}'.format(mouse.selected_cell)).removeClass('inventory-cell-item-selected');
            mouse.state = MOUSE_FREE;
            mouse.hide();
        } else {
            $('#{}'.format(mouse.selected_cell)).removeClass('inventory-cell-item-selected');
            mouse.selected_cell = cell_gene;
            $('#{}'.format(mouse.selected_cell)).addClass('inventory-cell-item-selected');
            mouse.set_color(mouse.selected_cell.substr(0, 6));
        }
        break;

    }
};

mouse.mousemove = function (top, left) {
    if (mouse.state == MOUSE_SELECT_INVENTORY) {
        $('#cursor-cell-icon').css({
            'top': top - 26,
            'left': left + 3,
        });
    }
};

mouse.set_color = function (color) {
    $('#cursor-cell-icon').css('background', '#{}'.format(color));
};

mouse.show = function () {
    $('#cursor-cell-icon').removeClass('hidden');
};

mouse.hide = function () {
    $('#cursor-cell-icon').addClass('hidden');
};

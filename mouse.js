MOUSE_FREE = 0;
MOUSE_SELECT_INVENTORY = 1;

var mouse = {};

mouse.state = MOUSE_FREE;
mouse.selected_cell = null;

mouse.select_inventory = function (cell_gene) {
    switch (mouse.state) {
    case MOUSE_FREE:
        mouse.selected_cell = cell_gene;
        $('#{}'.format(mouse.selected_cell)).addClass('inventory-cell-item-selected');
        mouse.state = MOUSE_SELECT_INVENTORY;
        break;
    case MOUSE_SELECT_INVENTORY:
        if (mouse.selected_cell == cell_gene) {
            $('#{}'.format(mouse.selected_cell)).removeClass('inventory-cell-item-selected');
            mouse.state = MOUSE_FREE;
        } else {
            $('#{}'.format(mouse.selected_cell)).removeClass('inventory-cell-item-selected');
            mouse.selected_cell = cell_gene;
            $('#{}'.format(mouse.selected_cell)).addClass('inventory-cell-item-selected');
        }
        break;
    }
};

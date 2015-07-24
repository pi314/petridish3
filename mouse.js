MOUSE_FREE = 0;
MOUSE_HOLD_CELL = 1;
MOUSE_HOLD_PIPETTE = 2;

var mouse = {};

mouse.state = MOUSE_FREE;
mouse.selected_cell_gene = null;
mouse.color = null;
mouse.last_entered_block = [];

mouse.set_state = function (new_state, data) {
    switch (mouse.state) {
    case MOUSE_FREE:
        break;

    case MOUSE_HOLD_CELL:
        $('#{}'.format(mouse.selected_cell_gene)).removeClass('panel-item-selected');
        $('#cursor-cell-icon').addClass('hidden');
        break;

    case MOUSE_HOLD_PIPETTE:
        $('#cursor-tool-icon').addClass('hidden');
        $('#tool-pipette').removeClass('panel-item-selected');
        break;

    }

    mouse.state = new_state;

    switch (mouse.state) {
    case MOUSE_FREE:
        break;

    case MOUSE_HOLD_CELL:
        mouse.selected_cell_gene = data['cell_gene'];
        $('#cursor-cell-icon').removeClass('hidden');
        $('#{}'.format(mouse.selected_cell_gene)).addClass('panel-item-selected');
        mouse.set_color(mouse.selected_cell_gene.substr(0, 6));
        mouse.mousemove(data['y'], data['x']);
        break;

    case MOUSE_HOLD_PIPETTE:
        $('#cursor-tool-icon').css('background-image', 'url(pipette.svg)');
        $('#cursor-tool-icon').removeClass('hidden');
        $('#tool-pipette').addClass('panel-item-selected');
        mouse.mousemove(data['y'], data['x']);
        break;

    }
};

mouse.select_inventory = function (e, cell_gene) {
    switch (mouse.state) {
    case MOUSE_FREE:
        mouse.set_state(
            MOUSE_HOLD_CELL,
            {'cell_gene': cell_gene, 'x': e.pageX, 'y': e.pageY}
        );
        break;

    case MOUSE_HOLD_CELL:
        if (mouse.selected_cell_gene == cell_gene) {
            mouse.set_state(MOUSE_FREE);
        } else {
            mouse.set_state(MOUSE_HOLD_CELL, {'cell_gene': cell_gene});
        }
        break;

    case MOUSE_HOLD_PIPETTE:
        mouse.set_state(
            MOUSE_HOLD_CELL,
            {'cell_gene': cell_gene, 'x': e.pageX, 'y': e.pageY}
        );
        break;

    }
};

mouse.mousemove = function (top, left, force) {
    switch (mouse.state) {
    case MOUSE_HOLD_CELL:
        $('#cursor-cell-icon').css({
            'top': top - 13,
            'left': left + 3,
        });
        break;
    case MOUSE_HOLD_PIPETTE:
        $('#cursor-tool-icon').css({
            'top': top - 30,
            'left': left + 5,
        });
        break;
    }
};

mouse.set_color = function (color) {
    mouse.color = '#{}'.format(color);
    $('#cursor-cell-icon').css('background', mouse.color);
};

function unfocus_block (last_block) {
    var coord = parse_id(last_block.attr('id'));
    last_block.removeClass('cell-shadow');
    if (map.get_cell_at(coord) == EMPTY) {
        last_block.removeClass('cell cell-shadow');
        last_block.removeAttr('style');
    }
}

mouse.enter_block = function () {
    if (mouse.state == MOUSE_HOLD_CELL) {
        while (mouse.last_entered_block.length > 0) {
            unfocus_block(mouse.last_entered_block.shift())
        }

        var coord = parse_id($(this).attr('id'));
        if (map.get_cell_at(coord) == EMPTY) {
            $(this).addClass('cell cell-shadow');
            $(this).css('background', mouse.color);
        }
    }

    mouse.last_entered_block.push($(this));

};

mouse.click_block = function (clicked_block) {
    var coord = parse_id(clicked_block.attr('id'));
    switch (mouse.state) {
    case MOUSE_HOLD_CELL:
        if (map.get_cell_at(coord) == EMPTY) {
            clicked_block.removeClass('cell-shadow');
            clicked_block.removeAttr('style');
            var cg = new cell_group(mouse.selected_cell_gene);
            cg.put_cell(coord);
            cg.set_center(coord);
            inventory.sub(mouse.selected_cell_gene);
            if (inventory[mouse.selected_cell_gene] == 0) {
                mouse.set_state(MOUSE_FREE);
            }

        } else {
            mouse.set_state(MOUSE_FREE);

        }
        break;

    case MOUSE_HOLD_PIPETTE:
        var clicked_cell = map.get_cell_at(coord);
        if (clicked_cell != EMPTY) {
            clicked_cell.group.harvest(coord);
        }
        break;

    }
};

mouse.leave_petridish = function () {
    while (mouse.last_entered_block.length > 0) {
        unfocus_block(mouse.last_entered_block.shift())
    }
};

mouse.click_petridish = function () {
    while (mouse.last_entered_block.length > 1) {
        unfocus_block(mouse.last_entered_block.shift())
    }
    mouse.click_block(mouse.last_entered_block.shift());
};

mouse.take_pipette = function (e) {
    switch (mouse.state) {
    case MOUSE_FREE:
        mouse.set_state(MOUSE_HOLD_PIPETTE, {'x': e.pageX, 'y': e.pageY});
        break;

    case MOUSE_HOLD_CELL:
        mouse.set_state(MOUSE_HOLD_PIPETTE, {'x': e.pageX, 'y': e.pageY});
        break;

    case MOUSE_HOLD_PIPETTE:
        mouse.set_state(MOUSE_FREE);
        break;

    }
};

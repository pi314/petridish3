var inventory = {};

inventory.add = function (cg, amount) {
    var cell_gene = cg.gene();

    if (amount == undefined) {
        amount = 1;
    }

    if (inventory[cell_gene] == undefined) {
        inventory[cell_gene] = 0;
        var d = $('<div id="{}" class="panel-item">'.format(cell_gene));
        var c = $('<div class="block cell">');
        var n = $('<div class="cell-amount">');
        d.append(c);
        d.append(n);
        $('#inventory-cells').append(d);
        d.click(function (e) {
            mouse.select_inventory(e, this.id);
        });
    } else if (inventory[cell_gene] == 0) {
        $('#{}'.format(cell_gene)).removeClass('hidden');
    }
    inventory[cell_gene] += amount;
    $('#{} > .cell'.format(cell_gene)).css('background', '#{}'.format(cg.color.hex));
    $('#{} > .cell-amount'.format(cell_gene)).text(inventory[cell_gene]);
};

inventory.sub = function (cell_gene, amount) {
    if (amount == undefined) {
        amount = 1;
    }

    inventory[cell_gene] -= amount;
    $('#{} > .cell-amount'.format(cell_gene)).text(inventory[cell_gene]);

    if (inventory[cell_gene] == 0) {
        $('#{}'.format(cell_gene)).addClass('hidden');
    }
};

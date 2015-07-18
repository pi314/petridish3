var inventory = {};

inventory.add = function (cg, amount) {
    var cell_gene = cg.gene();

    if (amount == undefined) {
        amount = 1;
    }

    if (inventory[cell_gene] == undefined) {
        inventory[cell_gene] = 0;
        var d = $('<div id="'+ cell_gene +'"class="inventory-cell-item">');
        var c = $('<div class="block cell">');
        var n = $('<div class="cell-amount">');
        d.append(c);
        d.append(n);
        $('#inventory-cells').append(d);
        d.click(function () {
            mouse.select_inventory(this.id);
        });
    }
    inventory[cell_gene] += amount;
    $('#{} > .cell'.format(cell_gene)).css('background', 'rgb({}, {}, {})'.format(cg.R, cg.G, cg.B));
    $('#{} > .cell-amount'.format(cell_gene)).text(inventory[cell_gene]);
};

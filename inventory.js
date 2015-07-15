var inventory = {};

inventory.add = function (cell_gene) {
    if (inventory[cell_gene] == undefined) {
        inventory[cell_gene] = 0;
        var d = $('<div id="'+ cell_gene +'"class="inventory-cell-item">');
        var c = $('<div class="block cell">');
        var n = $('<div class="cell-amount">');
        d.append(c);
        d.append(n);
        $('#inventory-cells').append(d);
    }
    inventory[cell_gene] += 1;
    $('#'+ cell_gene +' > .cell-amount').text(inventory[cell_gene]);
};

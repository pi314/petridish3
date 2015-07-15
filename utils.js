DIAMAND = 0;
SQUARE = 1;

to_hex = function (d, padding) {
    var h = d.toString(16);
    while (h.length < padding) {
        h = '0'+ h;
    }
    return h;
}

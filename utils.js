DIAMAND = 0;
SQUARE = 1;

function to_hex (d, padding) {
    var h = d.toString(16);
    while (h.length < padding) {
        h = '0'+ h;
    }
    return h;
}

function format (s) {
    for (var i = 1; i < arguments.length; i++) {
        s = s.replace('{}', arguments[i]);
    }
    return s;
}

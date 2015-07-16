DIAMAND = 0;
SQUARE = 1;

V_U = [-1, 0];
V_L = [0, -1];
V_R = [0, 1];
V_D = [1, 0];
V_UL = [-1, -1];
V_UR = [-1, 1];
V_DL = [1, -1];
V_DR = [1, 1];
SHAPE_VECTOR = {};
SHAPE_VECTOR[DIAMAND] = [V_U, V_L, V_R, V_D];
SHAPE_VECTOR[SQUARE] = [V_U, V_L, V_R, V_D, V_UL, V_UR, V_DL, V_DR];

PULSE_INTERVAL_UNIT = 50;
PULSE_DELAY_UNIT = 10;

MSG_WAVE = 0;

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

function array_index_of (ary, obj) {
    /* This function is not correct in all cases, but may be enough for me */
    for (var i = 0; i < ary.length; i++) {
        if (ary[i].toString() == obj.toString()) {
            return i;
        }
    }
    return -1;
}

function vector_add (v1, v2) {
    return [v1[0] + v2[0], v1[1] + v2[1]];
}

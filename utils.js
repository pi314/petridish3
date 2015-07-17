DIAMAND = 0;
SQUARE = 1;

function vector (row, col) {
    this.row = row;
    this.col = col;
    this.reverse = null;
}

vector.prototype.add = function (v) {
    return new vector(this.row + v.row, this.col + v.col);
};

vector.prototype.equals = function (v) {
    return this.row == v.row && this.col == v.col;
}

U = new vector(-1, 0);
L = new vector(0, -1);
R = new vector(0, 1);
D = new vector(1, 0);
UL = new vector(-1, -1);
UR = new vector(-1, 1);
DL = new vector(1, -1);
DR = new vector(1, 1);
O = new vector(0, 0);
U.reverse = D;
D.reverse = U;
L.reverse = R;
R.reverse = L;
UL.reverse = DR;
DR.reverse = UL;
DL.reverse = UR;
UR.reverse = DL;
O.reverse = O;

SHAPE_VECTOR = {};
SHAPE_VECTOR[DIAMAND] = [U, L, R, D];
SHAPE_VECTOR[SQUARE] = [U, L, R, D, UL, UR, DL, DR];

PULSE_INTERVAL_UNIT = 50;
PULSE_DELAY_UNIT = 10;

MSG_WAVE = 0;
MSG_GROW = 1;

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

function sample (sample_space) {
    return sample_space[Math.floor(Math.random() * sample_space.length)];
}


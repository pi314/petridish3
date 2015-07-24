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

function hex (d, padding) {
    var h = d.toString(16);
    while (h.length < padding) {
        h = '0'+ h;
    }
    return h;
}

function choice (sample_space) {
    return sample_space[Math.floor(Math.random() * sample_space.length)];
}

String.prototype.format = function () {
    var ret = this;
    for (var i = 0; i < arguments.length; i++) {
        ret = ret.replace('{}', arguments[i]);
    }
    return ret;
}

String.prototype.slice = String.prototype.substring;

int = parseInt;

function rgb (index, r, g, b) {
    this.index = index;
    this.r = r;
    this.g = g;
    this.b = b;
    this.hex = hex(this.r, 2) + hex(this.g, 2) + hex(this.b, 2);
}

COLORS = [
    new rgb(0,  200, 80,  80),
    new rgb(1,  255, 150, 0),
    new rgb(2,  255, 230, 0),
    new rgb(3,  180, 255, 0),
    new rgb(4,  0,   255, 0),
    new rgb(5,  0,   255, 180),
    new rgb(6,  0,   255, 255),
    new rgb(7,  0,   128, 255),
    new rgb(8,  128, 0,   255),
    new rgb(9,  255, 0,   255),
    new rgb(10, 235, 235, 235),
];

for (var i = 0; i < COLORS.length; i++) {
    COLORS[COLORS[i].hex] = COLORS[i];
}

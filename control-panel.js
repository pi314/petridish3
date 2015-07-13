var control_panel = {};
var cp = control_panel;

control_panel.init = function () {
    cp.put_logo();
};

control_panel.put_logo = function () {
    var logo = '<div id="logo_frame"></div>';
    $('control-panel').append(logo);
};

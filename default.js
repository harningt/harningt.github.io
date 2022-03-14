function loadStylesheet(src) {
    if (document.createStyleSheet) {
        document.createStyleSheet(src);
    } else {
        $("head").append($("<link rel='stylesheet' href='"+src+"' type='text/css' media='screen' />"));
    }
}

$(function() {
    loadStylesheet("/css/main.css");
});

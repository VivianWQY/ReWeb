(function($) {
    define('jqplot/core', ['require', 'jquery', 'jqplot/jqplot.core'], function(require) {
        require('jqplot/jqplot.core');
    });
    define('jqplot', ['require', 'jquery', 'jqplot/core', 'jqplot/jqplot.linearTickGenerator', 'jqplot/jqplot.linearAxisRenderer', 'jqplot/jqplot.axisTickRenderer', 'jqplot/jqplot.axisLabelRenderer', 'jqplot/jqplot.tableLegendRenderer', 'jqplot/jqplot.lineRenderer', 'jqplot/jqplot.markerRenderer', 'jqplot/jqplot.divTitleRenderer', 'jqplot/jqplot.canvasGridRenderer', 'jqplot/jqplot.linePattern', 'jqplot/jqplot.shadowRenderer', 'jqplot/jqplot.shapeRenderer', 'jqplot/jqplot.sprintf', 'jqplot/jsdate', 'jqplot/jqplot.themeEngine', 'jqplot/jqplot.toImage', 'jqplot/jqplot.effects.core', 'jqplot/jqplot.effects.blind'], function(require) {
        require('jqplot/jqplot.linearTickGenerator');
        require('jqplot/jqplot.linearAxisRenderer');
        require('jqplot/jqplot.axisTickRenderer');
        require('jqplot/jqplot.axisLabelRenderer');
        require('jqplot/jqplot.tableLegendRenderer');
        require('jqplot/jqplot.lineRenderer');
        require('jqplot/jqplot.markerRenderer');
        require('jqplot/jqplot.divTitleRenderer');
        require('jqplot/jqplot.canvasGridRenderer');
        require('jqplot/jqplot.linePattern');
        require('jqplot/jqplot.shadowRenderer');
        require('jqplot/jqplot.shapeRenderer');
        require('jqplot/jqplot.sprintf');
        require('jqplot/jsdate');
        require('jqplot/jqplot.themeEngine');
        require('jqplot/jqplot.toImage');
        require('jqplot/jqplot.effects.core');
        require('jqplot/jqplot.effects.blind');
    });
}(jQuery))
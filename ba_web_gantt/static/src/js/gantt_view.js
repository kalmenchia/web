odoo.define('ba_web_gantt.GanttView', function (require) {
"use strict";
 
var AbstractView = require('web.AbstractView');
var view_registry = require('web.view_registry'); 
var GanttModel = require('ba_web_gantt.GanttModel');
var GanttRenderer = require('ba_web_gantt.GanttRenderer');
var GanttController = require('ba_web_gantt.GanttController');
var core = require('web.core');
  
var _t = core._t;
var _lt = core._lt;


var GanttView = AbstractView.extend({
    display_name: _lt('Gantt'),
    icon: 'fa-tasks',
    viewType: 'ganttview',
    cssLibs: [
        '/ba_web_gantt/static/src/css/frappe-gantt.css',
    ],
    jsLibs: [
        '/ba_web_gantt/static/src/lib/moment.min.js',
        '/ba_web_gantt/static/src/lib/svg.min.js',
        '/ba_web_gantt/static/src/lib/frappe-gantt.js',

    ],
    config: {
        Model: GanttModel,
        Controller: GanttController,
        Renderer: GanttRenderer,
    },
    init: function (viewInfo, params) {
        this._super.apply(this, arguments);
      
        this.loadParams.timeframe = 'Quarter Day';
        this.loadParams.fieldsInfo = viewInfo.fieldsInfo;
        this.loadParams.fields = viewInfo.fields;
        this.loadParams.context = params.context || {};
        this.loadParams.start_date = this.arch.attrs.start_date || false;
        this.loadParams.stop_date = this.arch.attrs.stop_date || false;
    
    },  
 
});
  
view_registry.add('ganttview', GanttView);

});
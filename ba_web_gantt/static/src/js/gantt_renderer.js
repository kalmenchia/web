odoo.define('ba_web_gantt.GanttRenderer', function (require) {
"use strict";

var AbstractRenderer = require('web.AbstractRenderer');
var Context = require('web.Context');  
var core = require('web.core');
  
var _t = core._t;

var GanttRenderer = AbstractRenderer.extend({
    className: "o-gantt-target",

    init: function (parent, state, params) {
        this._super.apply(this, arguments);
        this.modelName = params.modelName;
    },
  
    _render: function () {
        var chart = this._render_Gantt();
        return this._super.apply(this, arguments);
    },
  
    _render_Gantt: function () {
        this.$el.empty();
        var self = this;
        var tasks = this.state.data;
    
        if (tasks.length == 0) {
            this.$el.append(_t('<div class="oe_view_nocontent"><p class="oe_view_nocontent_create">Click to add a new record.</p></div>'));
            return;
        };      
     
        var gantt = new Gantt(this.el, tasks, {
            view_mode: this.state.timeframe,
			bar_corner_radius: 0,
            on_click: function (task) {             
                self.trigger_up('switch_view', {
                    view_type: 'form',
                    res_id: parseInt(task.id),
                });
            },
            on_date_change: function(task, start, end) {
                var st = new Date(start);
                var context = new Context(self.state.context, {from_ui: true});
                var dates = {};
                dates[self.state.start_date] = moment.utc(start).utc().format("YYYY-MM-DD HH:mm:ss");
                dates[self.state.stop_date] = moment.utc(end).utc().format("YYYY-MM-DD HH:mm:ss");            
                          
                self._rpc({
                    model: self.state.modelName,
                    method: 'write',
                    args: [[parseInt(task.id)], dates],
                    context: context
                });             
            },

        });
      
        var timerId = setInterval(function() {
            if (gantt.$container.scrollWidth > 0) {
                document.querySelector('div.o_content').scrollLeft = gantt.startScrollLeft;
                clearInterval(timerId);
            }
        }, 200);
     
    },


});

return GanttRenderer;

});

odoo.define('ba_web_gantt.GanttController', function (require) {
"use strict";

var AbstractController = require('web.AbstractController');
var core = require('web.core');

var qweb = core.qweb;

var GanttController = AbstractController.extend({
    className: 'o_ganttview',
  
    renderButtons: function ($node) {
        if ($node) {
            this.$buttons = $(qweb.render('GanttView.buttons', this));
            this.$buttons.find('button').tooltip();
            this.$buttons.on('click', 'button.o-gantt-timeframe', this._onButtonClick.bind(this));
            this.$buttons.on('click', 'button.o-gantt-button-new', this._onButtonNew.bind(this));
            this._updateButtons();
            this.$buttons.appendTo($node);
        }
    },
  
    _setMode: function (timeframe) {
        this.reload({timeframe: timeframe});
        this._updateButtons();
    },
  
    _updateButtons: function () {
        if (!this.$buttons) {
            return;
        }
        var state = this.model.get();
        this.$buttons.find('.o-gantt-timeframe').removeClass('active');
        this.$buttons
            .find('.o-gantt-timeframe[data-timeframe="' + state.timeframe + '"]')
            .addClass('active');
    },
  
    _onButtonClick: function (event) {
        var $target = $(event.target);
        this._setMode($target.data('timeframe'));
    },
  
    _onButtonNew: function (event) {
        this.trigger_up('switch_view', {
                view_type: 'form',
                res_id: undefined,
            });
    },
  
});

return GanttController;

});

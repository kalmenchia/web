odoo.define('ba_web_gantt.GanttModel', function (require) {
    "use strict";

    let AbstractModel = require('web.AbstractModel');


    let GanttModel = AbstractModel.extend({
        init: function () {
            this._super.apply(this, arguments);
            this.chart = null;
        },
        get: function () {
            return _.extend({}, this.chart, {
                fields: this.fields,
            });
        },
        load: function (params) {
            this.fields = params.fields;
            this.modelName = params.modelName;
            this.chart = {
                modelName: this.modelName,
                data: [],
                domain: params.domain,
                context: params.context,
                timeframe: params.timeframe,
                start_date: params.start_date,
                stop_date: params.stop_date,
            };
            return this._loadTasks();
        },
        reload: function (handle, params) {
            if ('context' in params) {
                this.chart.context = params.context;
            }
            if ('domain' in params) {
                this.chart.domain = params.domain;
            }
            if ('timeframe' in params) {
                this.chart.timeframe = params.timeframe;
            }
            return this._loadTasks();
        },
        _loadTasks: function () {
            return this._rpc({
                model: this.modelName,
                method: 'search_read',
                context: this.chart.context,
                domain: this.chart.domain,
                fields: [
                    this.chart.start_date,
                    this.chart.stop_date,
                    'name',
                    'progress',
                    'parent_id',
                    'color',
                    'user_id',
                ],
            })
                .then(this._processData.bind(this));
        },
        _processData: function (raw_data) {
            this.chart.data = [];
            if (!raw_data) {
                return;
            }
            for (let i = 0; i < raw_data.length; i++) {
                let start = false;
                let stop = false;
                let color = 0;
                let user_id = '';
                if (raw_data[i][this.chart.start_date]) {
                    start = moment.utc(raw_data[i][this.chart.start_date]).local().format("YYYY-MM-DD HH:mm:ss");
                }
                if (raw_data[i][this.chart.stop_date]) {
                    stop = moment.utc(raw_data[i][this.chart.stop_date]).local().format("YYYY-MM-DD HH:mm:ss");
                }
                if (raw_data[i]['color']) {
                    color = raw_data[i]['color'];
                }
                if (raw_data[i]['user_id']) {
                    user_id = raw_data[i]['user_id'];
                }

                let task_data = {
                    id: raw_data[i]['id'].toString(),
                    name: raw_data[i]['name'],
                    start: start,
                    end: stop,
                    color: color,
                    user_id: user_id,
                };
                if (raw_data[i]['progress']) {
                    task_data['progress'] = raw_data[i]['progress'];
                }
                if (raw_data[i]['parent_id']) {
                    task_data['dependencies'] = raw_data[i]['parent_id'].toString().split(',')[0];
                }
                this.chart.data.push(task_data);
            }

            let child_ids = [];
            for (let i = this.chart.data.length - 1; i >= 0; i--) {
                if (this.chart.data[i].dependencies) {
                    child_ids.push(this.chart.data.splice(i, 1));
                }
            }
            let warn_for_while = 0;
            while (1 === 1) {
                warn_for_while++;
                for (let i = 0; i < child_ids.length; i++) {
                    let child_id = child_ids[i][0];
                    let parent_id = undefined;
                    for (let j = 0; j < this.chart.data.length; j++) {
                        if (this.chart.data[j].id === child_id.dependencies) {
                            parent_id = j;
                        }
                    }
                    if (parent_id >= 0) {
                        this.chart.data.splice(parent_id + 1, 0, child_id);
                        child_ids.splice(i, 1)
                    }
                }

                if (child_ids.length === 0) {
                    break;
                }

                if (warn_for_while === 100000) {
                    for (let i = 0; i < child_ids.length; i++) {
                        this.chart.data.push(child_ids[i][0])
                    }
                    break;
                }
            }
        },

    });

    return GanttModel;

});

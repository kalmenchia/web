# -*- coding: utf-8 -*-

from odoo import api, fields, models

   
class ViewGanttProjectTak(models.Model):
    _inherit = 'project.task'
    _order = 'name, priority desc, sequence, id desc'
    
    gantt_start_date = fields.Datetime(string='Planned start', index=True, copy=False)
    gantt_stop_date = fields.Datetime(string='Planned stop', index=True, copy=False)
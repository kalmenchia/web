# -*- coding: utf-8 -*-

from odoo import api, fields, models


class ViewGanttBa(models.Model):
    _inherit = 'ir.ui.view'
    
    type = fields.Selection(selection_add=[('ganttview', 'GanttView')])
# -*- coding: utf-8 -*-
# Part of Odoo Module Developed by Kinfinity Tech Pvt. Ltd.
# See LICENSE file for full copyright and licensing details.

from odoo import http
from odoo.addons.web.controllers.main import WebClient, Binary, Home
from odoo.http import request

class WebCustomizeThemeColors(Home):

    def get_view_ids(self, xml_ids):
        ids = []
        for xml_id in xml_ids:
            if "." in xml_id:
                record_id = request.env.ref(xml_id).id
            else:
                record_id = int(xml_id)
            ids.append(record_id)
        return ids

    @http.route(['/web/web_customize_menu_get'], type='json', website=True, auth="public")
    def web_customize_menu_get(self, xml_ids):
        enable = []
        disable = []
        ids = self.get_view_ids(xml_ids)
        for view in request.env['ir.ui.view'].with_context(
                active_test=True).browse(ids):
            if view.active:
                enable.append(view.xml_id)
            else:
                disable.append(view.xml_id)
        return [enable, disable]

    @http.route(['/web/web_customize_menu'], type='json', auth="user")
    def web_customize_menu(self, enable, disable, get_bundle=False):
        def set_active(ids, active):
            if ids:
                real_ids = self.get_view_ids(ids)
                request.env['ir.ui.view'].browse(real_ids).write(
                    {'active': active})

        set_active(disable, False)
        set_active(enable, True)
        if get_bundle:
            context = dict(request.context)
            return {
                'web.assets_backend': request.env["ir.qweb"]._get_asset(
                    'web.assets_backend', options=context),
                'web.assets_common': request.env["ir.qweb"]._get_asset(
                    'web.assets_common', options=context),
                'web_editor.assets_editor': request.env["ir.qweb"]._get_asset(
                    'web_editor.assets_editor', options=context)
            }

        return True

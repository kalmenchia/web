# -*- coding: utf-8 -*-
{
    'name': "Gantt view for Project",
    'version': "0.1",
    'author': 'AppsTG',
    'website': 'https://appstg.com',
    'support': "info@appstg.com",
    'category': "Project",
    'summary': "Add gantt view for Project Tasks",
    'description': "",
    'license':'OPL-1',
    'price': 0.00,
    'currency': 'EUR',
    'images':['static/description/banner.jpg'],
    'data': [
        'views/views.xml',
    ],
    'qweb': [
        'static/src/xml/*.*',
    ],
    'depends': ['project','ba_web_gantt'],
    'application': False,
}

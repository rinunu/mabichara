# -*- coding: utf-8 -*-
"""
"""

import re
import logging
import types

from django.views.generic.simple import direct_to_template
from django.shortcuts import render_to_response
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.http import HttpResponse

from mabi.enchant_class import EnchantClass

def enchants(request):
    """エンチャント一覧を表示する
    """
    
    context = {
        'enchants': EnchantClass.all(),
        }

    return direct_to_template(request, 'enchants.html', context)

# def blogparts(request, id_):
#     a = Enchant.get_by_id(id)
#     if not a:
#         raise Http404

#     return direct_to_template(request, 'blogparts_enchant.html', {enchant: a})

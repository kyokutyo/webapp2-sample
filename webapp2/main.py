#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import webapp2

from datetime import date, timedelta
from google.appengine.ext import ndb
from webapp2_extras import jinja2


BIRTHDAY = date(2013, 12, 17)


class LastUpdate(ndb.Model):
    update_date = ndb.DateProperty(indexed=True, auto_now=True)


class Day(ndb.Model):
    """Models an individual Day entry with date, photo_url."""
    date = ndb.DateProperty(indexed=True)
    photo_url = ndb.StringProperty(indexed=True)


class BaseHandler(webapp2.RequestHandler):

    @webapp2.cached_property
    def jinja2(self):
        return jinja2.get_jinja2(app=self.app)

    def render_response(self, _template, **context):
        rv = self.jinja2.render_template(_template, **context)
        self.response.write(rv)


class MainHandler(BaseHandler):
    def get(self):
        update_date = LastUpdate()
        update_date.put()

        today = date.today()
        edge = update_date.update_date + timedelta(days=5)

        if (today > edge):
            should_update = True
        else:
            should_update = False

        is_exists = bool(Day.query(Day.date == today).count())
        if not is_exists:
            day = Day()
            day.date = today
            day.photo_url = 'dododo'
            day.put()

        time_after_birth = abs(today - BIRTHDAY)
        context = {
            'days': str(time_after_birth.days),
            'should_update': should_update,
            'last_update': str(update_date.update_date),
        }
        self.render_response('index.html', **context)

app = webapp2.WSGIApplication([
    ('/', MainHandler)
], debug=True)

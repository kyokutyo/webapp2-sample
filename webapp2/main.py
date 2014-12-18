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

import dateutil.tz
import webapp2

from datetime import date, datetime, timedelta
from google.appengine.ext import ndb
from webapp2_extras import jinja2

jst = dateutil.tz.gettz('Asia/Tokyo')


class LastUpdate(ndb.Model):
    update_date = ndb.DateTimeProperty(indexed=True, auto_now=True)


class Day(ndb.Model):
    """Models an individual Day entry with date, photo_url."""
    date = ndb.DateTimeProperty(indexed=True)
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
        today = date.today()

        if (self._should_update()):
            update_date = LastUpdate()
            update_date.put()

        is_exists = bool(Day.query(Day.date == today).count())
        if not is_exists:
            day = Day()
            day.date = datetime.now(jst)
            day.photo_url = 'dododo'
            day.put()

        context = {
            'last_update': str('update_date.update_date'),
        }
        self.render_response('index.html', **context)

    def _should_update(self):
        now = datetime.now(jst)
        today = date.today()
        update_date = LastUpdate.query().order(-LastUpdate.update_date).get()
        edge = update_date.update_date + timedelta(days=5)
        return now > edge

app = webapp2.WSGIApplication([
    ('/', MainHandler)
], debug=True)

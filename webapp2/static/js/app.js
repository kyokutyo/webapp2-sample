/**
 * @fileOverview View file (ReactJS)
 *
 * @author kyokutyo <kyokutyo@gmail.com>
 * @version 1.0.0
 */

(function() {
    'use strict';

    var flickr   = new Flickr({ api_key: '17570926bf4df161849251ae5cdfaa1b' });
    var user_id  = '112437165@N04';
    var birthday = '2013-12-17';

    var Infos = React.createClass({
        render: function() {
            var days_old_that_date, days_ago;

            days_old_that_date = this.props.days_old_today - this.props.days_ago;
            if(days_old_that_date) {
                days_ago = (
                    <div className="infos__days-ago">
                    <p>
                    <span className="date">{this.props.days_ago}</span> day(s) ago ({days_old_that_date} days old)
                    </p>
                    </div>
                );
            }

            return (
                <div className="infos">
                    {days_ago}
                </div>

            );
        }
    });

    var Today = React.createClass({
        render: function() {
            var total, days_old_today;

            if(typeof this.props.total !== 'undefined') {
                total = (
                    <div className="today__total">
                    <p>Total: {this.props.total} photos</p>
                    </div>
                );
            }
            if(typeof this.props.days_old_today !== 'undefined') {
                days_old_today = (
                    <div className="today__days-old">
                    <p>
                    Today, Rintaro is <span className="today__days-old__date">{this.props.days_old_today}</span> days old.
                    </p>
                    </div>
                );
            }

            return (
                <div className="today">
                    {total}
                    {days_old_today}
                </div>

            );
        }
    });

    var App = React.createClass({
        getInitialState: function() {
            return {
                days_old_today  : moment().diff(moment(birthday), 'day'),
                total           : undefined,
                photo_number    : undefined,
                photo_url       : undefined,
                photo_date_taken: undefined,
                photo_days_ago  : undefined
            };
        },
        setPhotoState: function(data, photo_number) {
            var that   = this;
            var photos = data.photos;
            var photo  = photos.photo[0];
            var date_taken, days_ago;

            flickr.photos.getInfo({
                photo_id: photo.id
            }, function(err, result) {
                if(err) { throw new Error(err); }
                date_taken = moment(result.photo.dates.taken, 'YYYY-MM-DD');
                days_ago = moment().diff(date_taken, 'day');
                that.setState({
                    total           : parseInt(photos.total, 10),
                    photo_number    : photo_number,
                    photo_url       : 'http://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg',
                    photo_date_taken: date_taken.format('YYYY-MM-DD'),
                    photo_days_ago  : days_ago
                });
            });

            // flickr.photos.getSizes({
            //     photo_id: photo.id
            // }, function(err, result) {
            //     if(err) { throw new Error(err); }
            //     console.log(result.sizes.size[8].height);
            //     console.log(result.sizes.size[8].width);
            // });
        },
        componentDidMount: function() {
            var that = this;

            flickr.photos.search({
                user_id : user_id,
                per_page: 1
            }, function(err, result) {
                if(err) { throw new Error(err); }
                var random = _.random(1, result.photos.total);
                flickr.photos.search({
                    user_id : user_id,
                    per_page: 1,
                    page    : random
                }, function(err, result) {
                    if(err) { throw new Error(err); }
                    that.setPhotoState(result, random);
                });
            });
        },
        render: function() {
            var photo;

            if(typeof this.state.photo_url !== 'undefined') {
                photo = (
                    <div className="photo">
                        <img className="photo__item" src={this.state.photo_url} alt="" />
                    </div>
                );
            }
            return (
                <div>
                    {photo}
                    <Infos total={this.state.total} days_old_today={this.state.days_old_today} days_ago={this.state.photo_days_ago} />
                    <Today total={this.state.total} days_old_today={this.state.days_old_today} />
                </div>
            );
        }
    });

    React.renderComponent(
        <App />,
        document.getElementById('contents')
    );
}());

(function() {
    'use strict';

    var flickr   = new Flickr({ api_key: '17570926bf4df161849251ae5cdfaa1b' });
    var user_id  = '112437165@N04';
    var birthday = '2013-12-17'

    var App = React.createClass({
        getInitialState: function() {
            return {
                days_old_today: moment().diff(moment(birthday), 'day'),
                total         : undefined,
                photo_number  : undefined,
                photo         : undefined
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
                    total       : parseInt(photos.total, 10),
                    photo_number: photo_number,
                    photo       : {
                        url       : 'http://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg',
                        date_taken: date_taken.format('YYYY-MM-DD'),
                        days_ago  : days_ago
                    }
                });
            });
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
            var total, photo, days_old_today, days_old_that_date, days_ago, style;

            if(typeof this.state.photo !== 'undefined') {
                style = {
                    backgroundImage: 'url(' + this.state.photo.url + ')',
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover',
                    width: '100%',
                    minHeight: '1300px'
                };
                photo = (
                    <div style={style}></div>
                );
                days_old_that_date = this.state.days_old_today - this.state.photo.days_ago;
                days_ago = (
                    <p>
                    <span className="date">{this.state.photo.days_ago}</span> day(s) ago ({days_old_that_date} days old)
                    </p>
                );
            }
            if(typeof this.state.total !== 'undefined') {
                total = (
                    <p>Total: {this.state.total} photos</p>
                );
            }
            if(typeof this.state.days_old_today !== '') {
                days_old_today = (
                    <div className="days-old-today">
                        Today, Rintaro is <span className="days-old-today__date">{this.state.days_old_today}</span> days old.
                    </div>
                );
            }
            return (
                <div>
                    {days_old_today}
                    {total}
                    {days_ago}
                    {photo}
                </div>
            );
        }
    });

    React.renderComponent(
        <App />,
        document.getElementById('contents')
    );
}());

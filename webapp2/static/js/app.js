(function() {
    'use strict';

    var api_url = 'https://api.flickr.com/services/rest/';
    var api_key = '17570926bf4df161849251ae5cdfaa1b';
    var user_id = '112437165@N04';
    var flickr = new Flickr({ api_key: api_key });
    var App = React.createClass({
        getInitialState: function() {
            return {
                photo: undefined,
                total: undefined
            };
        },
        setPhotoState: function(data) {
            var photos = data.photos;
            var photo = photos.photo[0];

            this.setState({
                total: parseInt(photos.total, 10),
                photo: {
                    url: 'http://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg',
                    name: photo.title
                }
            });
        },
        componentDidMount: function() {
            var that = this;

            flickr.photos.search({
                user_id: user_id,
                per_page: 1
            }, function(err, result) {
                if(err) { throw new Error(err); }
                var random = _.random(1, result.photos.total);
                flickr.photos.search({
                    user_id: user_id,
                    per_page: 1,
                    page: random
                }, function(err, result) {
                    if(err) { throw new Error(err); }
                    that.setPhotoState(result);
                });
            });
        },
        render: function() {
            var total, photo;

            if(typeof this.state.photo !== 'undefined') {
                photo = (
                    <p><img alt={this.state.photo.name} src={this.state.photo.url} /></p>
                );
            }
            if(typeof this.state.total !== 'undefined') {
                total = (
                    <p>Total: {this.state.total}</p>
                );
            }
            return (
                <div>
                    {total}
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

(function() {
    'use strict';

    var api_url = 'https://api.flickr.com/services/rest/';
    var params = {
        method: 'flickr.photos.search',
        api_key: '17570926bf4df161849251ae5cdfaa1b',
        user_id: '112437165@N04',
        format: 'json',
        nojsoncallback: '1'
    };

    var App = React.createClass({
        getInitialState: function() {
            return {
                photo_id: undefined,
                total: undefined
            };
        },
        setPhotoState: function(data) {
            var total = parseInt(data.photos.total, 10);
            var photo_id = _.random(1, total);

            this.setState({
                photo_id: photo_id,
                total: total
            });
        },
        componentDidMount: function() {
            var that = this;

            $.ajax(api_url, {
                dataType: 'json',
                data: params,
                success: function(data) {
                    that.setPhotoState(data);
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        render: function() {
            var link, photo_id;

            if(typeof this.state.photo_id !== 'undefined') {
                photo_id = (
                    <p>PhotoID: <a href={api_url}>{this.state.photo_id}</a></p>
                );
            }
            if(typeof this.state.total !== 'undefined') {
                link = (
                    <p>Total: {this.state.total}</p>
                );
            }
            return (
                <div>
                    {link}
                    {photo_id}
                </div>
            );
        }
    });

    React.renderComponent(
        <App />,
        document.getElementById('contents')
    );

}());

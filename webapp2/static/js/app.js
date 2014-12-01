(function() {
    'use strict';

    var App = React.createClass({
        render: function() {
            return (
                <p>あああ</p>
            );
        }
    });

    React.renderComponent(
        <App />,
        document.getElementById('contents')
    );

}());

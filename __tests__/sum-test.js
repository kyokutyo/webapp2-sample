jest.dontMock('../webapp2/static/build/sum');

describe('sum', function() {
    it('add 1 + 2 to equal 3', function() {
        var sum = require('../webapp2/static/build/sum');
        expect(sum(1, 2)).toBe(3);
    });
});

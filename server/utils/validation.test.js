const expect = require('expect');
const {isRealString} = require('./validation');

describe('isRealString', () => {
    it('should reject non-string values', () => {
        var s = 987;
        expect(isRealString(s)).toBeFalsy();
    });

    it('should reject string with only spaces', () => {
        var s = '          ';
        expect(isRealString(s)).toBeFalsy();
    });

    it('should allow string with non-space characters', () => {
        var s = 'Thisisavalidstring';
        expect(isRealString(s)).toBeTruthy();
    });
});


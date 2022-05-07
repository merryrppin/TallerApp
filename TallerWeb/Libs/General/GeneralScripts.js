$(document).ready(function () {
    Array.prototype.unique = function (propertyArray) {
        function inArray(elm, array) {
            for (var i = 0; i < array.length; i++) {
                if (array[i][propertyArray] === elm[propertyArray]) {
                    return true;
                }
            }
            return false;
        }
        var r = [], i = 0;
        for (; i < this.length; i++) {
            if (!inArray(this[i], r)) {
                r.push(this[i]);
            }
        }
        return r;
    };
});
define(['ko'], function (ko) {
    "use strict";

    return function (config) {
        return {
            title: ko.observable("This is a test!"),
            config: config
        }
    };
});
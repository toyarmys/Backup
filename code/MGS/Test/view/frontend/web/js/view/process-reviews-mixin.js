define(
    [
        'jquery'
    ], function ($) {
        'use strict';

        function processReviews(url, fromPages) {
            this._super();
        }

        return function (config) {
            processReviews(config.productReviewUrl);

            this._super();
        };
    }
);

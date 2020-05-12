define(['jquery', 'collapsible'], function ($) {
    'use strict';

    const waitForUpdate = function () {
        if(!this.content.attr('aris-busy')) {
            return this.content.trigger('contentUpdated');
        }
        setTimeout(waitForUpdate.bind(this), 100);
    };

    $.widget('test.collapsible', $.mage.collapsible, {
        _loadContent: function () {
            this._super();
            waitForUpdate.bind(this)();
        }
    });

    return $.test.collapsible;
});
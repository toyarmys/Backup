define(
    [
        'uiComponent',
        'Magento_Checkout/js/model/payment/additional-validators',
        'MGS_Test/js/model/new-validator'
    ],
    function (Component, additionalValidators, newValidator) {
        'use strict';
        additionalValidators.registerValidator(newValidator);
        return Component.extend({});
    }
);

define(
    [
        'uiComponent',
        'Magento_Checkout/js/model/payment/renderer-list'
    ],
    function (
        Component,
        rendererList
    ) {
        'use strict';
        rendererList.push(
            {
                type: 'newPayment',
                component: 'MGS_Test/js/view/payment/new-payment'
            }
            // other payment method renderers if required
        );
        /** Add view logic here if needed */
        return Component.extend({});
    }
);

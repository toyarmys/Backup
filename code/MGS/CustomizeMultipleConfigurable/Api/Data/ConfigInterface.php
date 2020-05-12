<?php
/**
 *
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace MGS\CustomizeMultipleConfigurable\Api\Data;

/**
 * Interface ConfigInterface
 * @api
 * @since 101.0.0
 */
interface ConfigInterface
{
	/**#@+
     * Constants defined for keys of  data array
     */
    const XML_PATH_ENABLE = 'mgs_customeize_configurable/general/enabled';

    const XML_PATH_SHOW_STOCK = 'mgs_customeize_configurable/general/show_stock';

    const XML_PATH_USE_DEFAULT = 'mgs_customeize_configurable/general/use_default';

    const USE_DEFAULT = 2;
    const VALUE_YES   = 1;
    const VALUE_NO    = 0;

    const LABLE_USE_DEFAULT = 'Use default';
    const LABLE_VALUE_YES   = 'Yes';
    const LABLE_VALUE_NO    = 'No';

    /**#@-*/
}

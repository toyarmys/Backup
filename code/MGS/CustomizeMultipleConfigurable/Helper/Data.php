<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace MGS\CustomizeMultipleConfigurable\Helper;

use MGS\CustomizeMultipleConfigurable\Api\Data\ConfigInterface;

/**
 *
 * @api
 *
 * @SuppressWarnings(PHPMD.TooManyFields)
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 * @since 100.0.2
 */
class Data extends \Magento\Framework\App\Helper\AbstractHelper implements ConfigInterface
{
    /**
     * check is enabled / disabled
     *
     * @return boolem
     */
    public function isEnable()
    {
        return $this->scopeConfig->getValue(
            self::XML_PATH_ENABLE,
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }

    /**
     * Allow show input quantity under swatch option of attribute
     *
     * @return boolem
     */
    public function allowShowInputQuantityUnderSwatchOption()
    {
        return $this->scopeConfig->getValue(
            self::XML_PATH_USE_DEFAULT,
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }

    /**
     * Allow show quantity of child product
     *
     * @return boolem
     */
    public function allowShowQuantity()
    {
        return $this->scopeConfig->getValue(
            self::XML_PATH_SHOW_STOCK,
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }
}
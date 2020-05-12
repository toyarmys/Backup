<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace MGS\CustomizeMultipleConfigurable\Model\Entity\Attribute\Source;

use MGS\CustomizeMultipleConfigurable\Api\Data\ConfigInterface;

/**
 * @api
 * @since 100.0.2
 */
class Options extends \Magento\Eav\Model\Entity\Attribute\Source\AbstractSource implements ConfigInterface
{
    /**
     * Retrieve all options array
     *
     * @return array
     */
    public function getAllOptions()
    {
        if ($this->_options === null) {
            $this->_options = [
                ['label' => __(self::LABLE_USE_DEFAULT), 'value' => self::USE_DEFAULT],
                ['label' => __(self::LABLE_VALUE_YES), 'value' => self::VALUE_YES],
                ['label' => __(self::LABLE_VALUE_NO), 'value' => self::VALUE_NO]
            ];
        }
        return $this->_options;
    }
}

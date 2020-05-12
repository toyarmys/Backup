<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace MGS\CustomizeMultipleConfigurable\Observer;

use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\App\ObjectManager;
use Magento\Swatches\Model\SwatchAttributesProvider;
use Magento\Catalog\Api\Data\ProductInterface;

class HandlerLayoutObserver implements ObserverInterface
{
    /**
     * @var \Magento\Framework\Registry
     */
    private $_registry;

	/**
     * @var SwatchAttributesProvider
     */
    private $swatchAttributesProvider;

    /**
     * @var \MGS\CustomizeMultipleConfigurable\Helper\Data 
     */
    private $mgsHelper;

    /**
     * @param \Magento\Framework\Registry $registry
     * @param \MGS\CustomizeMultipleConfigurable\Helper\Data $mgsHelper
     * @param SwatchAttributesProvider $swatchAttributesProvider
     */
    public function __construct(
        \Magento\Framework\Registry $registry,
        \MGS\CustomizeMultipleConfigurable\Helper\Data $mgsHelper,
        SwatchAttributesProvider $swatchAttributesProvider = null
    )
    {
        $this->_registry = $registry;
        $this->mgsHelper = $mgsHelper;
        $this->swatchAttributesProvider = $swatchAttributesProvider
            ?: ObjectManager::getInstance()->get(SwatchAttributesProvider::class);
    }

	/**
     * update layout for swatch product
     *
     * @param \Magento\Framework\Event\Observer $observer
     * @return void
     */
    public function execute(\Magento\Framework\Event\Observer $observer)
    {      
        $product = $this->_registry->registry('current_product');
        if (!$product){
            return $this;
        }
        
        if(!$this->isEnable($product)){
            return $this;
        }
        
        if($this->isProductHasSwatchAttribute($product)){
            $layout = $observer->getEvent()->getLayout();
            $layout->getUpdate()->addHandle('mgs_catalog_product_view_type_configurable');
        }
        return $this;
    }

    /**
     * Check that product has at least one swatch attribute
     *
     * @param ProductInterface $product
     * @return bool
     * @since 100.1.5
     */
    protected function isProductHasSwatchAttribute(ProductInterface $product)
    {
        $swatchAttributes = $this->swatchAttributesProvider->provide($product);
        return count($swatchAttributes) > 0;
    }

    private function isEnable($product)
    {
        $value = $product->getCustomizeSwatch();
        return ($value && $value == 2) ? $this->mgsHelper->isEnable() : $value;
    }
}
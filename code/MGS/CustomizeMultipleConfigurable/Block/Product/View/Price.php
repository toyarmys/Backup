<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace MGS\CustomizeMultipleConfigurable\Block\Product\View;

use Magento\Framework\Pricing\PriceCurrencyInterface;
use Magento\Catalog\Api\ProductRepositoryInterface;

/**
 * Product price block
 */
class Price extends \Magento\Framework\View\Element\Template
{
    /**
     * @var PriceCurrencyInterface
     */
    private $priceCurrency;

    /**
     * Core registry
     *
     * @var \Magento\Framework\Registry
     */
    private $_coreRegistry;

    /**
     * @var ProductRepositoryInterface
     */
    private $productRepository;

    /**
     * @var \MGS\CustomizeMultipleConfigurable\Helper\Data
     */
    private $mgsHelper;

    /**
     * Constructor
     *
     * @param \Magento\Framework\View\Element\Template\Context $context
     * @param PriceCurrencyInterface $priceCurrency
     * @param \Magento\Framework\Registry $registry
     * @param ProductRepositoryInterface|\Magento\Framework\Pricing\PriceCurrencyInterface $productRepository
     * @param \MGS\CustomizeMultipleConfigurable\Helper\Data $mgsHelper
     * @param array $data
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function __construct(
    	\Magento\Framework\View\Element\Template\Context $context,
        PriceCurrencyInterface $priceCurrency,
        \Magento\Framework\Registry $registry,
        ProductRepositoryInterface $productRepository,
        \MGS\CustomizeMultipleConfigurable\Helper\Data $mgsHelper,
        array $data = []
    ) {
        $this->_coreRegistry = $registry;
        $this->productRepository = $productRepository;
        $this->priceCurrency = $priceCurrency;
        $this->mgsHelper = $mgsHelper;
        parent::__construct($context, $data);
    }

    /**
     * Retrieve current product model
     *
     * @return \Magento\Catalog\Model\Product
     */
    private function getProduct()
    {
        if (!$this->_coreRegistry->registry('product') && $this->getProductId()) {
            $product = $this->productRepository->getById($this->getProductId());
            $this->_coreRegistry->register('product', $product);
        }
        return $this->_coreRegistry->registry('product');
    }

    /**
     * Get formatted by currency price
     *
     * @param float $amount
     * @return  array || float
     */
    public function getFormatedPrice($amount)
    {
        return $this->priceCurrency->format($amount);
    }

    /**
     * check is enabled / disabled
     *
     * @return boolem
     */
    public function isEnable()
    {
        $value = $this->getProduct()->getCustomizeSwatch();
        return ($value && $value == 2) ? $this->mgsHelper->isEnable() : $value;
    }
}
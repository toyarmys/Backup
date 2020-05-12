<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace MGS\CustomizeMultipleConfigurable\Block\Product;

use Magento\Catalog\Api\ProductRepositoryInterface;

/**
 * Product view block
 */
class View extends \Magento\Framework\View\Element\Template
{
	/**
     * Core registry
     *
     * @var \Magento\Framework\Registry
     */
    protected $_coreRegistry;

    /**
     * @var ProductRepositoryInterface
     */
    protected $productRepository;

    /**
     * @var \MGS\CustomizeMultipleConfigurable\Helper\Data
     */
    protected $mgsHelper;

    /**
     * @var \Magento\Framework\Json\EncoderInterface
     */
    protected $jsonEncoder;

	/**
     * Constructor
     *
     * @param \Magento\Framework\View\Element\Template\Context $context
     * @param \Magento\Framework\Registry $registry
     * @param ProductRepositoryInterface|\Magento\Framework\Pricing\PriceCurrencyInterface $productRepository
     * @param \MGS\CustomizeMultipleConfigurable\Helper\Data $mgsHelper
     * @param \Magento\Framework\Json\EncoderInterface $jsonEncoder
     * @param array $data
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function __construct(
    	\Magento\Framework\View\Element\Template\Context $context,
        \Magento\Framework\Registry $registry,
        ProductRepositoryInterface $productRepository,
        \MGS\CustomizeMultipleConfigurable\Helper\Data $mgsHelper,
        \Magento\Framework\Json\EncoderInterface $jsonEncoder,
        array $data = []
    ) {
        $this->_coreRegistry = $registry;
        $this->productRepository = $productRepository;
        $this->mgsHelper = $mgsHelper;
        $this->jsonEncoder = $jsonEncoder;
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
     * check is enabled / disabled
     *
     * @return boolem
     */
    private function isEnable()
    {
        $value = $this->getProduct()->getCustomizeSwatch();
        return ($value && $value == 2) ? $this->mgsHelper->isEnable() : $value;
    }

    /**
     * Allow show input quantity under swatch option of attribute
     *
     * @return boolem
     */
    private function allowShowInputQuantityUnderSwatchOption()
    {
        return $this->mgsHelper->allowShowInputQuantityUnderSwatchOption();
    }

    /**
     * Allow show quantity of child product
     *
     * @return boolem
     */
    private function allowShowQuantity()
    {
        return $this->mgsHelper->allowShowQuantity();
    }

    /**
     * get json config
     *
     * @return string
     */
    public function getJsonConfig()
    {
        $config = [];
        $config['isEnabled'] = $this->isEnable();
        $config['allowShowQuantity'] = $this->allowShowQuantity();
        $config['allowShowInputQuantityUnderSwatchOption'] = $this->allowShowInputQuantityUnderSwatchOption();
        return $this->jsonEncoder->encode($config);
    }
}
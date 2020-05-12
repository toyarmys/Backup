<?php
/**
 * Catalog super product configurable part block
 *
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace MGS\CustomizeMultipleConfigurable\Plugin\Block\Product\View\Type;

use Magento\CatalogInventory\Api\StockStateInterface;

/**
 * @api
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 * @api
 * @since 100.0.2
 */
class Configurable
{
	/**
     * @var \Magento\Framework\Json\EncoderInterface
     */
    private $jsonEncoder;

    /**
     * @var \Magento\Framework\Json\DecoderInterface
     */
    private $jsonDecoder;

    /**
     * @var StockStateInterface
     */
    private $stockState;

	/**
     * @param \Magento\Framework\Json\EncoderInterface $jsonEncoder
     * @param \Magento\Framework\Json\DecoderInterface $jsonDecoder
     * @param StockStateInterface $stockState
     * @param array $data
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function __construct(
        \Magento\Framework\Json\EncoderInterface $jsonEncoder,
        \Magento\Framework\Json\DecoderInterface $jsonDecoder,
        StockStateInterface $stockState,
        array $data = []
    ) {
        $this->jsonEncoder = $jsonEncoder;
        $this->jsonDecoder = $jsonDecoder;
        $this->stockState = $stockState;
    }
	/**
     * Composes configuration for js
     *
     * @return string
     */
	public function afterGetJsonConfig(\Magento\ConfigurableProduct\Block\Product\View\Type\Configurable $subject, $result)
	{
		$config = $this->jsonDecoder->decode($result);
		foreach ($subject->getAllowProducts() as $product) {
			$qty = $this->stockState->getStockQty($product->getId(), $product->getStore()->getWebsiteId());
			$config['index'][$product->getId()]['qty'] = $qty;
		}
		return $this->jsonEncoder->encode($config);
	}
}
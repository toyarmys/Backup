<?php
/**
 *
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace MGS\CustomizeMultipleConfigurable\Controller\Checkout\Cart;

use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Checkout\Model\Cart as CustomerCart;
use Magento\Framework\Exception\NoSuchEntityException;

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class Add extends \Magento\Checkout\Controller\Cart\Add
{
    /**
     * Add product to shopping cart action
     *
     * @return \Magento\Framework\Controller\Result\Redirect
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     */
    public function execute()
    {
        $params = $this->getRequest()->getParams();
        $super_attribute = [];
        $isMultiple = false;
        if(isset($params['super_attribute']) && !empty($params['super_attribute'])){
            foreach ($params['super_attribute'] as $k => $v) {
                if(is_array($v)){
                    $isMultiple = true;
                    $super_attribute[$k] = $v;
                }
            }
            if($isMultiple){
                // add multiple product
                $this->addProducts($params, $super_attribute);
            }else{
                parent::execute();
            }
        }else{
            parent::execute();
        }
    }

    /**
     * add multiple product
     *
     * @param array $params
     * @param array $super_attribute
     * @return \Magento\Framework\Controller\Result\Redirect
     */
    private function addProducts($params, $super_attribute)
    {
        $product = $this->_initProduct();
        try {
            foreach ($super_attribute as $k => $v) {
                foreach ($v as $o => $q) {
                    if($q > 0){
                        $params['super_attribute'][$k] = $o;
                        $params['qty'] = $q;
                        // add product
                        $this->addProduct($params);
                    }
                }
            }
            
            $related = $this->getRequest()->getParam('related_product');
            if (!empty($related)) {
                $this->cart->addProductsByIds(explode(',', $related));
            }

            // save cart
            $this->cart->save();

            /**
             * @todo remove wishlist observer \Magento\Wishlist\Observer\AddToCart
             */
            $this->_eventManager->dispatch(
                'checkout_cart_add_product_complete',
                ['product' => $product, 'request' => $this->getRequest(), 'response' => $this->getResponse()]
            );

            if (!$this->_checkoutSession->getNoCartRedirect(true)) {
                if (!$this->cart->getQuote()->getHasError()) {
                    $message = __(
                        'You added %1 to your shopping cart.',
                        $product->getName()
                    );
                    $this->messageManager->addSuccessMessage($message);
                }
                return $this->goBack(null, $product);
            }
        } catch (\Magento\Framework\Exception\LocalizedException $e) {
            if ($this->_checkoutSession->getUseNotice(true)) {
                $this->messageManager->addNotice(
                    $this->_objectManager->get(\Magento\Framework\Escaper::class)->escapeHtml($e->getMessage())
                );
            } else {
                $messages = array_unique(explode("\n", $e->getMessage()));
                foreach ($messages as $message) {
                    $this->messageManager->addError(
                        $this->_objectManager->get(\Magento\Framework\Escaper::class)->escapeHtml($message)
                    );
                }
            }

            $url = $this->_checkoutSession->getRedirectUrl(true);

            if (!$url) {
                $cartUrl = $this->_objectManager->get(\Magento\Checkout\Helper\Cart::class)->getCartUrl();
                $url = $this->_redirect->getRedirectUrl($cartUrl);
            }

            return $this->goBack($url);
        } catch (\Exception $e) {
            $this->messageManager->addException($e, __('We can\'t add this item to your shopping cart right now.'));
            $this->_objectManager->get(\Psr\Log\LoggerInterface::class)->critical($e);
            return $this->goBack();
        }
    }

    /**
     * add product
     *
     * @param array $params
     */
    private function addProduct($params)
    {
        $storeId = $this->_objectManager->get(
                \Magento\Store\Model\StoreManagerInterface::class
            )->getStore()->getId();
        
        if (isset($params['qty'])) {
            $filter = new \Zend_Filter_LocalizedToNormalized(
                ['locale' => $this->_objectManager->get(
                    \Magento\Framework\Locale\ResolverInterface::class
                )->getLocale()]
            );
            $params['qty'] = $filter->filter($params['qty']);
        }
        $product = $this->productRepository->getById($params['product'], false, $storeId, true);
        /**
         * Check product availability
         */
        if (!$product) {
            return $this->goBack();
        }
        $_params = new \Magento\Framework\DataObject($params);
        $this->cart->addProduct($product, $_params);
    }
}
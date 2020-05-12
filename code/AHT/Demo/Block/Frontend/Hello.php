<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Aht\Demo\Block\Frontend;

class Hello extends \Magento\Framework\View\Element\Template
{

    public function __construct(\Magento\Framework\View\Element\Template\Context $context)
	{
		parent::__construct($context);
	}

    public function sayHello()
    {
        return __("Say Hello from the block Demo");
    }

}

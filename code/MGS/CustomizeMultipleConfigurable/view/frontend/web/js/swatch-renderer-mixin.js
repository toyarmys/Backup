/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'mage/template',
    'mage/translate',
    'priceUtils'
], function($, mageTemplate, $t, priceUtils){
    'use strict';    
    return function(widget){
        $.widget('mage.SwatchRenderer', widget, {
            /**
             * @private
             */
            _init: function () {
                if(parseInt(window.swatchConfig.isEnabled) === 1){
                    $('#product-addtocart-button').attr("disabled", true);
                }
                return this._super();
            },

            /**
             * Event listener
             *
             * @private
             */
            _EventListener: function () {
                var $widget = this;
                if(parseInt(window.swatchConfig.isEnabled) === 1){
                    $widget.element.on('focus', 'input.input-text', function () {
                        return $widget._OnFocus($(this), $widget);
                    });

                    $widget.element.on('focusout', 'input.input-text', function () {
                        return $widget._OnFocusout($(this));
                    });

                    $widget.element.on('keyup', 'input.input-text', function () {
                        return $widget._OnKeyUp($(this), $widget);
                    });
                }
                return this._super();
            },

            /**
             * Render controls
             *
             * @private
             */
            _RenderControls: function() {
                if(parseInt(window.swatchConfig.isEnabled) !== 1){
                    return this._super();
                }
                var $widget = this,
                    container = this.element,
                    classes = this.options.classes,
                    chooseText = this.options.jsonConfig.chooseText,
                    attrLength = this.options.jsonConfig.attributes.length - 1;
                
                $widget.optionsMap = {};
                $.each(this.options.jsonConfig.attributes, function (index) {

                    var item = this,
                        controlLabelId = 'option-label-' + item.code + '-' + item.id,
                        options = (index ==attrLength) ? $widget._RenderSwatchOptionsCustomize($widget, item, controlLabelId) : $widget._RenderSwatchOptions(item, controlLabelId),
                        select = $widget._RenderSwatchSelect(item, chooseText),
                        input = $widget._RenderFormInput(item),
                        listLabel = '',
                        label = '';
                    // Show only swatch controls
                    if ($widget.options.onlySwatches && !$widget.options.jsonSwatchConfig.hasOwnProperty(item.id)) {
                        return;
                    }

                    if ($widget.options.enableControlLabel) {
                        label +=
                            '<span id="' + controlLabelId + '" class="' + classes.attributeLabelClass + '">' +
                                item.label +
                            '</span>' +
                            '<span class="' + classes.attributeSelectedOptionLabelClass + '"></span>';
                    }

                    if ($widget.inProductList) {
                        $widget.productForm.append(input);
                        input = '';
                        listLabel = 'aria-label="' + item.label + '"';
                    } else {
                        listLabel = 'aria-labelledby="' + controlLabelId + '"';
                    }
                    if(index == attrLength){
                        // Create new control
                        container.append(
                            '<div class="' + classes.attributeClass + ' ' + item.code + '" ' +
                                 'attribute-code="' + item.code + '" ' +
                                 'attribute-id="' + item.id + '">' +
                                label +
                                '<div aria-activedescendant="" ' +
                                     'tabindex="0" ' +
                                     'aria-invalid="false" ' +
                                     'aria-required="true" ' +
                                     'role="listbox" ' + listLabel +
                                     'class="' + classes.attributeOptionsWrapper + ' clearfix">' +
                                     options + select +
                                '</div>' +
                            '</div>'
                        )
                    }else{
                        // Create new control
                        container.append(
                            '<div class="' + classes.attributeClass + ' ' + item.code + '" ' +
                                 'attribute-code="' + item.code + '" ' +
                                 'attribute-id="' + item.id + '">' +
                                label +
                                '<div aria-activedescendant="" ' +
                                     'tabindex="0" ' +
                                     'aria-invalid="false" ' +
                                     'aria-required="true" ' +
                                     'role="listbox" ' + listLabel +
                                     'class="' + classes.attributeOptionsWrapper + ' clearfix">' +
                                    options + select +
                                '</div>' + input +
                            '</div>'
                        )
                    }
                    

                    $widget.optionsMap[item.id] = {};

                    // Aggregate options array to hash (key => value)
                    $.each(item.options, function () {
                        if (this.products.length > 0) {
                            $widget.optionsMap[item.id][this.id] = {
                                price: parseInt(
                                    $widget.options.jsonConfig.optionPrices[this.products[0]].finalPrice.amount,
                                    10
                                ),
                                products: this.products
                            };
                        }
                    });
                });

                // Hide all elements below more button
                $('.' + classes.moreButton).nextAll().hide();

                // Handle events like click or change
                $widget._EventListener();

                // Rewind options
                $widget._Rewind(container);

                //Emulate click on all swatches from Request
                $widget._EmulateSelected($.parseQuery());
                $widget._EmulateSelected($widget._getSelectedAttributes());
            },

            /**
             * Render swatch options by part of config
             *
             * @param {String} controlId
             * @param {Int} id
             * @param {Int} type
             * @param {String} label
             * @param {String} thumb
             * @param {String} value
             * @param {String} optionClass
             * @param {Int} isProduct
             * @returns {String}
             * @private
             */
            _RenderSwatchOptionsDefault: function(controlId, id, type, label, thumb, value, optionClass, isProduct){
                var attr, html = '';
                attr =
                    ' id="' + controlId + '-item-' + id + '"' +
                    ' aria-checked="false"' +
                    ' aria-describedby="' + controlId + '"' +
                    ' tabindex="0"' +
                    ' option-type="' + type + '"' +
                    ' option-id="' + id + '"' +
                    ' option-label="' + label + '"' +
                    ' aria-label="' + label + '"' +
                    ' option-tooltip-thumb="' + thumb + '"' +
                    ' option-tooltip-value="' + value + '"' +
                    ' role="option"';

                if (isProduct) {
                    attr += ' option-empty="true"';
                }

                if (type === 0) {
                    // Text
                    html += '<div class="' + optionClass + ' text" ' + attr + '>' + (value ? value : label) +
                        '</div>';
                } else if (type === 1) {
                    // Color
                    html += '<div class="' + optionClass + ' color" ' + attr +
                        ' style="background: ' + value +
                        ' no-repeat center; background-size: initial;">' + '' +
                        '</div>';
                } else if (type === 2) {
                    // Image
                    html += '<div class="' + optionClass + ' image" ' + attr +
                        ' style="background: url(' + value + ') no-repeat center; background-size: initial;">' + '' +
                        '</div>';
                } else if (type === 3) {
                    // Clear
                    html += '<div class="' + optionClass + '" ' + attr + '></div>';
                } else {
                    // Default
                    html += '<div class="' + optionClass + '" ' + attr + '>' + label + '</div>';
                }
                return html;
            },

            /**
             * Render swatch options by part of config
             *
             * @param {Object} $widget
             * @param {Object} config
             * @param {String} controlId
             * @returns {String}
             * @private
             */
            _RenderSwatchOptionsCustomize: function ($widget, config, controlId) {
                var optionConfig = this.options.jsonSwatchConfig[config.id],
                    optionClass = this.options.classes.optionClass,
                    moreLimit = parseInt(this.options.numberToShow, 10),
                    moreClass = this.options.classes.moreButton,
                    moreText = this.options.moreButtonText,
                    countAttributes = 0,
                    html = '';

                if (!this.options.jsonSwatchConfig.hasOwnProperty(config.id)) {
                    return '';
                }

                $.each(config.options, function () {
                    var id,
                        type,
                        value,
                        thumb,
                        label,
                        attr,
                        labelInput,
                        input,
                        isProduct = false;

                    if (!optionConfig.hasOwnProperty(this.id)) {
                        return '';
                    }

                    // Add more button
                    if (moreLimit === countAttributes++) {
                        html += '<a href="#" class="' + moreClass + '">' + moreText + '</a>';
                    }

                    id = this.id;
                    type = parseInt(optionConfig[id].type, 10);
                    value = optionConfig[id].hasOwnProperty('value') ? optionConfig[id].value : '';
                    thumb = optionConfig[id].hasOwnProperty('thumb') ? optionConfig[id].thumb : '';
                    label = this.label ? this.label : '';
                    attr =
                        ' id="' + controlId + '-item-' + id + '"' +
                        ' option-type="' + type + '"' +
                        ' option-id="' + id + '"' +
                        ' option-label="' + label + '"' +
                        ' min="0"';
                    if (!this.hasOwnProperty('products') || this.products.length <= 0) {
                        attr += ' option-empty="true"';
                        isProduct = true;
                    }
                    if(parseInt(window.swatchConfig.allowShowInputQuantityUnderSwatchOption) === 1){
                        labelInput = $widget._RenderSwatchOptionsDefault(controlId, id, type, label, thumb, value, optionClass, isProduct);
                    }else{
                        labelInput = '<label class="label" for="' + controlId + '-item-' + id + '"><span>' + label + '</span></label>';
                    }
                    
                    input = '<input type="number" '+ attr +' name="super_attribute['+
                             config.id + '][' + id + ']" id="' + 
                             controlId + '-item-' + id + '" value="0" class="input-text">';
                    html += '<div class="field">' + labelInput + '<div class="control">'+ input + '<div class="available"></div></div></div>';
                });

                return html;
            },

            /**
             * Event for swatch options
             *
             * @param {Object} $this
             * @param {Object} $widget
             * @param {String|undefined} eventName
             * @private
             */
            _OnClick: function ($this, $widget, eventName) {
                if(parseInt(window.swatchConfig.isEnabled) === 1){
                    var productPriceTotalHtml,
                        $parent = $('.swatch-attribute input.input-text').parents('.' + $widget.options.classes.attributeClass);
                    if ($this.hasClass('disabled')) {
                        return;
                    }

                    $('.swatch-attribute input.input-text').each(function(){
                        $(this).val(0);
                    });
                    if(parseInt(window.swatchConfig.allowShowInputQuantityUnderSwatchOption) !== 1){
                        $parent.removeAttr('option-selected');
                    }
                    
                    $('#product-addtocart-button').attr("disabled", true);

                    productPriceTotalHtml = mageTemplate(
                        '#product-price-totals-template',
                        {
                            'qty': 0,
                            'amount' : 0,
                            '$t': $t,
                            'currencyFormat': this.options.jsonConfig.currencyFormat,
                            'priceUtils': priceUtils
                        }
                    );
                    $('.product_price_totals').html(productPriceTotalHtml);
                }
                return this._super($this, $widget, eventName);
            },

            /**
             * Event input forcus
             *
             * @param {Object} $this
             * @param {Object} $widget
             * @param {String|undefined} eventName
             * @private
             */
            _OnFocus: function($this, $widget, eventName) {
                var $parent = $this.parents('.' + $widget.options.classes.attributeClass);
                if($this.val() == 0){
                    $this.val('');
                }
                if(parseInt(window.swatchConfig.allowShowInputQuantityUnderSwatchOption) === 1){
                    return;
                }
                $parent.attr('option-selected', $this.attr('option-id'));
                $widget._loadMedia(eventName);
                $widget._UpdateTierPrice($this);
            },

            /**
             * Event input forcus out
             *
             * @param {Object} $this
             * @private
             */
            _OnFocusout: function($this) {
                if($this.val() == ''){
                    $this.val(0);
                }
                this._UpdatePriceCustomize($this);
            },

            /**
             * Event for swatch options
             *
             * @param {Object} $this
             * @param {Object} $widget
             * @param {String|undefined} eventName
             * @private
             */
            _OnKeyUp: function($this, $widget, eventName) {
                if($this.val() > 0){
                    $('#product-addtocart-button').attr("disabled", false);
                }else{
                    var $qty = 0;
                    $('.swatch-attribute input.input-text').each(function(){
                        $qty += $(this).val();
                    });
                    if($qty > 0) {
                        $('#product-addtocart-button').attr("disabled", false);
                    }else{
                        $('#product-addtocart-button').attr("disabled", true);
                    }
                }
                if ($widget.element.parents($widget.options.selectorProduct)
                    .find(this.options.selectorProductPrice).is(':data(mage-priceBox)')
                ) {
                    $widget._UpdatePriceCustomize($this);
                }
            },

            /**
             * Update tier price
             *
             * @param {Object} $this
             * @private
             */
            _UpdateTierPrice: function($this) {
                var $widget = this,
                    options = _.object(_.keys($widget.optionsMap), {}),
                    result,
                    tierPriceHtml;
                $widget.element.find('.' + $widget.options.classes.attributeClass).each(function () {
                    var attributeId = $(this).attr('attribute-id');
                    if(typeof $(this).attr('option-selected') !== 'undefined'){
                        options[attributeId] = $(this).attr('option-selected');
                    }else{
                        options[attributeId] = $this.attr('option-id');
                    }
                });
                result = $widget.options.jsonConfig.optionPrices[_.findKey($widget.options.jsonConfig.index, options)];
                if (typeof result != 'undefined' && result.tierPrices.length) {
                    if (this.options.tierPriceTemplate) {
                        tierPriceHtml = mageTemplate(
                            this.options.tierPriceTemplate,
                            {
                                'tierPrices': result.tierPrices,
                                '$t': $t,
                                'currencyFormat': this.options.jsonConfig.currencyFormat,
                                'priceUtils': priceUtils
                            }
                        );
                        $(this.options.tierPriceBlockSelector).html(tierPriceHtml).show();
                    }
                } else {
                    $(this.options.tierPriceBlockSelector).hide();
                }
            },

            /**
             * Update total price
             *
             * @param {Object} $this
             * @private
             */
            _UpdatePriceCustomize: function ($this) {
                var $widget = this,
                    $product = $widget.element.parents($widget.options.selectorProduct),
                    $productPrice = $product.find(this.options.selectorProductPrice),
                    options = _.object(_.keys($widget.optionsMap), {}),
                    result,
                    prices;
                $widget.element.find('.' + $widget.options.classes.attributeClass).each(function () {
                    var attributeId = $(this).attr('attribute-id');
                    if(typeof $(this).attr('option-selected') !== 'undefined'){
                        options[attributeId] = $(this).attr('option-selected');
                    }else{
                        options[attributeId] = $this.attr('option-id');
                    }
                });
                result = $widget.options.jsonConfig.optionPrices[_.findKey($widget.options.jsonConfig.index, options)];
                prices = $widget._getPricesCustomize($this, result, $productPrice.priceBox('option').prices, options);
                $productPrice.trigger(
                    'updatePrice',
                    {
                        'prices': prices
                    }
                );
                if (typeof result != 'undefined' && result.oldPrice.amount !== result.finalPrice.amount) {
                    $(this.options.slyOldPriceSelector).show();
                } else {
                    $(this.options.slyOldPriceSelector).hide();
                }
                this._updateTotalPriceTemplate(prices);
                $(this.options.normalPriceLabelSelector).hide();
                _.each($('.' + this.options.classes.attributeOptionsWrapper), function (attribute) {
                    if ($(attribute).find('.' + this.options.classes.optionClass + '.selected').length === 0) {
                        if ($(attribute).find('.' + this.options.classes.selectClass).length > 0) {
                            _.each($(attribute).find('.' + this.options.classes.selectClass), function (dropdown) {
                                if ($(dropdown).val() === '0') {
                                    $(this.options.normalPriceLabelSelector).show();
                                }
                            }.bind(this));
                        } else {
                            $(this.options.normalPriceLabelSelector).show();
                        }
                    }
                }.bind(this));
            },

            /**
             * update total price template
             *
             * @param {Object} displayPrices
             * @private
             */
            _updateTotalPriceTemplate: function(displayPrices){
                var qty = 0, productPriceTotalHtml;
                $('.swatch-attribute input.input-text').each(function(){
                    if($(this).val() > 0){
                        qty = parseInt(qty) + parseInt($(this).val());
                    }
                })
                productPriceTotalHtml = mageTemplate(
                    '#product-price-totals-template',
                    {
                        'qty': qty,
                        'amount' : displayPrices['finalPrice'].total,
                        '$t': $t,
                        'currencyFormat': this.options.jsonConfig.currencyFormat,
                        'priceUtils': priceUtils
                    }
                );
                $('.product_price_totals').html(productPriceTotalHtml);
            },

            /**
             * Get prices
             *
             * @param {Object} $this
             * @param {Object} newPrices
             * @param {Object} displayPrices
             * @param {Object} options
             * @returns {*}
             * @private
             */
            _getPricesCustomize: function ($this, newPrices, displayPrices, options) {
                var $widget = this, attributeId, $newPrices;
                attributeId = $this.closest('div.swatch-attribute').attr('attribute-id');
                if (_.isEmpty(newPrices)) {
                    newPrices = $widget.options.jsonConfig.prices;
                }

                _.each(displayPrices, function (price, code) {
                    if (newPrices[code]) {
                        var amount = 0;
                        $('.swatch-attribute input.input-text').each(function(){
                            options[attributeId] = $(this).attr('option-id');
                            var qty = $(this).val();
                            if(qty > 0){
                                $newPrices = $widget.options.jsonConfig.optionPrices[_.findKey($widget.options.jsonConfig.index, options)];
                                if(typeof $newPrices !== 'undefined'){
                                    if($newPrices.tierPrices.length){
                                        var a = $newPrices.tierPrices, _amount, isTierPrice = false;
                                        for (var i = 0; i < a.length; i++) {
                                            if(a.length == 1){
                                                if(parseInt(a[i].qty) <= parseInt(qty)){
                                                    _amount = qty*a[i].price;
                                                    isTierPrice = true;
                                                }
                                            }else{
                                                if(i == a.length - 1 && parseInt(qty) >= parseInt(a[i].qty)){
                                                    _amount = qty*a[i].price;
                                                    isTierPrice = true;
                                                }else{
                                                    if(parseInt(a[i].qty) <= parseInt(qty) &&  parseInt(qty) < parseInt(a[i+1].qty)){
                                                        _amount = qty*a[i].price;
                                                        isTierPrice = true;
                                                    }
                                                }
                                                
                                            }
                                        }
                                        if(!isTierPrice){
                                            _amount = qty*$newPrices[code].amount;
                                        }
                                        amount += _amount;
                                    }else{
                                        amount += qty*$newPrices[code].amount;
                                    }
                                }
                            }
                            
                        })
                        if(amount == 0){
                            displayPrices[code].amount = amount;
                        }else{
                            displayPrices[code].amount = amount - displayPrices[code].amount;
                        }
                        displayPrices[code].total = amount;
                    }
                });
                return displayPrices;
            },

            /**
             * Rewind options for controls
             *
             * @private
             */
            _Rewind: function (controls) {
                if(parseInt(window.swatchConfig.isEnabled) === 1){
                    controls.find('input[option-id]').removeClass('disabled').removeAttr('disabled');
                    controls.find('input[option-empty]').attr('disabled', true).addClass('disabled');
                }
                return this._super(controls);
            },

            /**
             * Rebuild container
             *
             * @private
             */
            _Rebuild: function () {
                if(parseInt(window.swatchConfig.isEnabled) === 1 && parseInt(window.swatchConfig.allowShowQuantity) === 1){
                    var $widget = this,
                        controls = $widget.element.find('.' + $widget.options.classes.attributeClass + '[attribute-id]'),
                        selected = controls.filter('[option-selected]');

                    // done if nothing selected
                    if (selected.size() <= 0) {
                        controls.each(function () {
                            var $this = $(this);
                            $this.find('[option-id]').each(function () {
                                var $element = $(this);
                                $element.parent().find('.available').html('');
                            })
                        })
                        return;
                    }
                    // Disable not available options
                    controls.each(function () {
                        var $this = $(this),
                            id = $this.attr('attribute-id'),
                            products = $widget._CalcProducts(id);
                        $this.find('[option-id]').each(function () {
                            var $element = $(this),
                                option = $element.attr('option-id'), prod, qty, html = '';
                            if (!$widget.optionsMap.hasOwnProperty(id) || !$widget.optionsMap[id].hasOwnProperty(option) ||
                                $element.hasClass('selected') ||
                                $element.is(':selected')) {
                                return;
                            }
                            prod = _.intersection(products, $widget.optionsMap[id][option].products);
                            if (prod.length > 0) {
                                qty = $widget.options.jsonConfig.index[prod[0]].qty;
                                html = '<span>' + $t('In stock (%1)').replace('%1', qty) + '</span>';
                            }else{
                                if($this.filter('[option-selected]').size() <= 0){
                                    html = '<span>' + $t('Out of stock') + '</span>';
                                }
                            }
                            $element.parent().find('.available').html(html);
                        });
                    });
                }
                return this._super(controls);
            },
        });
        return $.mage.SwatchRenderer;
    };
});

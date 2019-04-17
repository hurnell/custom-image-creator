import $ from "jquery";

import vars from '../../json/custom-image-vars.json';

class UserInterfaceHelper {

    constructor($wrapper) {

        this.$wrapper = $wrapper;

        this.$image = this.$wrapper.find('.js-scalable-image');
        this.$imageHolder = this.$wrapper.find('.js-image-holder');

        this.initialiseParams();

        this.$imageHolder.draggable({
            drag: this.dragImage.bind(this)
        });
        this.verticalSlider = $('.js-vertical-slider');
        this.verticalSlider.slider({
            orientation: "vertical",
            range: "min",
            min: 0,
            max: 400,
            value: 50,
            slide: this.setSlide.bind(this)
        });

        this.$wrapper.on('click',
            '.js-toggle-mask-button',
            this.toggleMask.bind(this)
        );

        this.$wrapper.on(
            'click',
            '.js-rotate-image-button',
            this.rotateImage.bind(this)
        );

        this.$wrapper.on(
            'click',
            '.js-center-image-button',
            this.centerImage.bind(this)
        );

    }

    getImageParams() {
        return this.imageParams;
    }

    setImageDimensions(width, height) {
        this.imageParams.width = width;
        this.imageParams.height = height;
    }


    setSlide(event, ui) {
        let scale = ui.value/100;
        // for readability use object destructuring
        let {width, height, top, left, offsetLeft, offsetTop} = this.imageParams;
        top = ((vars.containerHeight - height * scale) / 2 + offsetTop);
        left = ((vars.containerWidth - width * scale) / 2 + offsetLeft);
        this.$image.css({
            height: height * scale + 'px',
            width: width * scale + 'px'
        });
        this.$imageHolder.css({
            top: top + 'px',
            left: left + 'px'
        });
        this.imageParams = {width, height, top, left, offsetLeft, offsetTop};
        this.formParams.scale = scale;
    }

    setSliderValue() {
        this.verticalSlider.slider('value', 100 * this.formParams.scale);
    }

    initialiseParams() {
        this.imageParams = {
            width: 0,
            height: 0,
            left: 0,
            top: 0,
            offsetLeft: 0,
            offsetTop: 0
        };

        this.formParams = {
            angle: 0,
            size_w: vars.imageWidth,
            size_h: vars.imageHeight,
            scale: 0,
            start_x: 0,
            start_y: 0
        }
    }

    dragImage() {
        let pos = this.$imageHolder.position();
        this.imageParams.offsetLeft = pos.left + this.$imageHolder.width() / 2 - vars.containerWidth / 2;
        this.imageParams.offsetTop = pos.top + this.$imageHolder.height() / 2 - vars.containerHeight / 2;
    }

    rotateImage() {
        let angle = (this.formParams.angle + 90) % 360;
        this.$image.css({
            '-ms-transform': 'rotate(' + angle + 'deg)',
            '-webkit-transform': 'rotate(' + angle + 'deg)',
            'transform': 'rotate(' + angle + 'deg)',
            backgroundColor: 'white'
        });
        this.formParams.angle = angle;
    }

    centerImage() {
        // for readability use object destructuring
        let {width, height, top, left, offsetLeft, offsetTop} = this.imageParams;
        let scale = 0;
        top = left = offsetLeft = offsetTop = 0;
        this.$image.removeAttr("style");
        this.formParams.angle = 0;
        this.$imageHolder.removeAttr("style");
        if (width > height) {
            scale = vars.containerWidth/width;
            top =(vars.containerHeight - height * scale) / 2;
            this.$image.css({width: vars.containerWidth + 'px', backgroundColor: 'white'});
            this.$imageHolder.css({top: top + 'px', left: 0});
        } else {
            scale = vars.containerHeight/height;
            left = (vars.containerWidth - width * scale) / 2;
            this.$imageHolder.css({top: 0, left: left + 'px'});
            this.$image.css({height: vars.containerWidth + 'px', backgroundColor: 'white'});
        }
        this.imageParams = {width, height, top, left, offsetLeft, offsetTop};
        this.formParams.scale = scale;
        this.setSliderValue();
    }

    toggleMask(event = null) {
        let $imageContainer = $('.js-image-container');
        let isMasked = (null === event) ? true : $imageContainer.hasClass('clipped');
        $imageContainer.toggleClass('clipped', !isMasked);
        $('.js-preview-mask').toggleClass('hidden-mask', isMasked);
        let currentTarget = $('.js-toggle-mask-button');
        let buttonText = isMasked ? currentTarget.data('text-hidden') : currentTarget.data('text-shown');
        currentTarget.html(buttonText);
    }

    getFormParams() {

        let holderPosition = this.$imageHolder.position();

        let start_x = (vars.containerWidth - vars.imageWidth) / 2 - holderPosition.left;
        let start_y =  (vars.containerHeight - vars.imageHeight) / 2 - holderPosition.top;

        if (this.formParams.angle % 180 === 90) {
            let w = this.imageParams.width * this.formParams.scale;
            let h = this.imageParams.height * this.formParams.scale;
            start_x += (h - w)/2;
            start_y -= (h - w)/2;
        }
        this.formParams.start_x = start_x;
        this.formParams.start_y = start_y;
        return this.formParams;
    }
}

export default UserInterfaceHelper;
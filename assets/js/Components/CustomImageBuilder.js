import Routing from './Routing';

import swal from 'sweetalert2';

import 'font-awesome/css/font-awesome.css';

import 'jquery-ui/ui/widgets/draggable';

import 'jquery-ui/ui/widgets/slider';

import '../../css/custom_image.scss';

import $ from "jquery";

import UserInterfaceHelper from "./UserInterfaceHelper";
//import 'core-js';
class CustomImageBuilder {
    constructor($modal, $wrapper) {
        this.$wrapper = $wrapper;

        this.$modal = $modal;

        if (!CustomImageBuilder.advancedUploadIsSupported()) {
            this.showSweetAlertError('Problem!', 'Your Browser is too old!');
            return;
        }

        this.loadViewIntoWrapper().then(() => {
            this.$imageHolder = this.$wrapper.find('.js-image-holder');
            this.$image = this.$wrapper.find('.js-scalable-image');
            this.$initialView = $('.js-container');
            this.$innerHolder = $('.js-main-drop-target');
            this.helper = new UserInterfaceHelper(this.$wrapper);
            this.$form = this.$wrapper.find('.js-image-form');
            this.$fileInput = $('.js-file-input');
            this.$fileInput.on('click', function (e) {
                e.stopPropagation()
            });
            $('html').on(
                'drag dragstart dragend dragover dragenter dragleave drop',
                CustomImageBuilder.checkPreventPropagation
            ).on(
                'dragover dragenter',
                '.js-drop-target',
                this.checkDragEnterOver.bind(this)
            ).on(
                'dragleave dragend',
                '.js-drop-target',
                this.checkEndLeaveDrop.bind(this)
            ).on(
                'drop',
                '.js-drop-target',
                this.fileDropped.bind(this)
            );

            $modal.on('hidden.bs.modal', this.toggleBetweenPreviewAndDropView.bind(this, false));

            this.$wrapper.on(
                'click',
                '.js-show-file-upload-dialog',
                this.showFileUploadDialog.bind(this)
            );
            this.$wrapper.on('change',
                '.js-file-input',
                this.fileInputFileReceived.bind(this)
            );
            this.$wrapper.on('click',
                '.js-create-image-button',
                this.submitFormDataToServer.bind(this)
            );
        });
    }


    static advancedUploadIsSupported() {
        const div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div))
            && 'FormData' in window && 'FileReader' in window;
    }

    loadViewIntoWrapper() {
        return $.ajax({
            url: Routing.generate('get_custom_image_form'),
        }).then(data => {
            this.$wrapper.html(data);
        }).catch(() => {
            this.showSweetAlertError('Problem!', 'Error loading basic view!');
        });
    }

    static checkPreventPropagation(e) {
        if (!$(e.target).hasClass('js-image-holder')) {
            e.preventDefault();
            if ($(e.target).hasClass('js-drop-target')) {
                e.stopPropagation();
            }
        }
    }

    checkDragEnterOver() {
        this.toggleMainDropTarget(true);
        if (!this.$innerHolder.hasClass('is-dragover')) {
            this.$innerHolder.addClass('is-dragover');
        }
    }

    checkEndLeaveDrop() {
        if (this.$innerHolder.hasClass('is-dragover')) {
            this.$innerHolder.removeClass('is-dragover');
        }
    }

    fileDropped(e) {
        if (this.$innerHolder.hasClass('is-dragover')) {
            this.$innerHolder.removeClass('is-dragover');
            $('#image-container-div').removeClass('hidden-image-container-div');
            this.droppedFile = e.originalEvent.dataTransfer.files[0];
            this.renderImage()
        }
    }

    showFileUploadDialog() {
        this.$fileInput.trigger('click');
    }

    submitFormDataToServer() {

        let formData = new FormData();
        formData.append('imageFile', this.droppedFile);
        let params = this.helper.getFormParams();
        for (let param in params) {
            if (params.hasOwnProperty(param)) {
                formData.append(param, params[param]);
            }
        }

        $.ajax({
            url: this.$form.attr('action'),
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            cache: false
        }).then((data) => {
            if (data.url) {
                $('.js-page-image').attr('src', data.url);
            }
            this.hideModal();
        }).catch((jqXHR) => {
            const errorData = JSON.parse(jqXHR.responseText);
            console.log(errorData);
            this.showSweetAlertError('error', errorData.message);
        });//*/
    }


    toggleMainDropTarget(show) {
        let hideClass = 'hidden-main-drop-target';
        if (show && this.$innerHolder.hasClass(hideClass)) {
            this.$innerHolder.removeClass(hideClass);
        } else if (!show && !this.$innerHolder.hasClass(hideClass)) {
            this.$innerHolder.addClass(hideClass);
        }
    }

    toggleBetweenPreviewAndDropView(hide) {
        if (hide) {
            this.$innerHolder.addClass('hidden-main-drop-target');
            $('.js-image-container').removeClass('hidden-image-container-div');
        } else {
            this.$innerHolder.removeClass('hidden-main-drop-target');
            this.helper.toggleMask();
            $('.js-image-container').addClass('hidden-image-container-div');
            this.$fileInput.val('');
            this.helper.initialiseParams();
            this.$image.removeAttr("style");
            this.$imageHolder.removeAttr("style");
        }
    }

    showSweetAlertError(title, text) {
        swal({
            title: title,
            text: text
        });
        this.hideModal();
    }

    hideModal() {
        this.$modal.modal('hide');
    }

    fileInputFileReceived(e) {
        this.droppedFile = $(e.currentTarget)[0].files[0];
        this.renderImage();
    }

    renderImage() {
        this.readImageFile(this.droppedFile).then((fileContent) => {
            this.helper.toggleMask();
            return this.previewImage(fileContent);
        }).catch(
            (errorMessage) => {
                if (errorMessage !== 'no file chosen') {
                    this.showSweetAlertError('Error', errorMessage);
                }
            }
        );
    }

    readImageFile(file) {
        const fileReader = new FileReader();
        return new Promise((resolve, reject) => {
            fileReader.onerror = () => {
                fileReader.abort();
                reject('error loading file-reader');
            };
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onabort = () => {
                reject('file-reader aborted');
            };

            if (typeof file === 'undefined') {
                reject('no file chosen');

            } else if ('image/svg+xml' === file.type) {
                console.log(file.name);
               /* fs.readFile(file.name)
                    .then(svg2png)
                    .then(buffer => fs.writeFile("dest.png", buffer))
                    .catch(e => console.error(e));*/
                reject('File type svg is not supported');
            } else {
                fileReader.readAsDataURL(file);
            }
        });
    }

    previewImage(fileContent) {
        const image = new Image();
        return new Promise((resolve, reject) => {
            image.onerror = () => {
                reject('error loading image was it an image file?');
            };
            image.onabort = () => {
                reject('error image aborted');
            };
            image.onload = () => {
                this.toggleBetweenPreviewAndDropView(true);
                this.$image.attr('src', fileContent);
                this.helper.setImageDimensions(image.width, image.height);
                this.helper.centerImage();
                this.helper.setSliderValue();
            };
            image.src = fileContent;
        });
    }
}

//export default CustomImageBuilder;

export default function ($wrapper, $modal) {
    new CustomImageBuilder($wrapper, $modal);
};//*/


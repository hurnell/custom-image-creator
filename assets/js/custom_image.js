'use strict';
import $ from 'jquery' ;

//import CustomImageBuilder from './Components/CustomImageBuilder';

$(document).ready(function () {
    let $modal = $('#custom-image-modal');
    let imageBuilder = false;

    $modal.on('shown.bs.modal', function (event) {

        let $modalContentWrapper = $('#custom-image-modal .modal-content');
        if (!imageBuilder) {
            import('./Components/CustomImageBuilder' ).then((image_builder)=>{
                image_builder.default($modal, $modalContentWrapper);
                imageBuilder = true;
            });
            //imageBuilder = new CustomImageBuilder($modal, $modalContentWrapper);
        }
    });
});
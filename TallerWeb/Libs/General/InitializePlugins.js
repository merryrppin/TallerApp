$(document).ready(function () {
    //Initialize jquery.validate
    $.validator.setDefaults({
        highlight: function (element) {
            $(element).closest('.form-control').removeClass('is-valid');
            $(element).closest('.form-control').addClass('is-invalid');
        },
        unhighlight: function (element) {
            $(element).closest('.form-control').removeClass('is-invalid');
            $(element).closest('.form-control').addClass('is-valid');
        },
        errorElement: 'span',
        errorClass: 'invalid-feedback',
        errorPlacement: function (error, element) {
            error.removeClass("help-block");
            error.addClass("invalid-feedback");
            if (element.parent('.input-group').length > 0 || element.parent('.form-group.validated').length > 0) {
                if (element.parent('.form-group.validated').children(".invalid-feedback").length == 0) {
                    error.insertAfter(element);
                }
            }
        }
    });
});
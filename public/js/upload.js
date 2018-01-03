$(document).ready(function () {
  $('.upload-btn').on('click', () => {
    $('#upload-input').click();
  });
  $('#upload-input').on('change', () => {
    var uploadInput = $('#upload-input');

    if (uploadInput.val()!='') {
      var formData = new FormData();

      formData.append('upload',uploadInput[0].files[0]);

      $.ajax({
        url:'/uploadFile',
        type:'POST',
        data: formData,
        processData: false,
        contentType: false,
        success:function () {
          uploadInput.val('');
        }
      })
    }
  });
});

$(document).ready(function () {
  $('.add-btn').on('click', function() {
    $('#add-input').click();
  });
  $('#add-input').on('change', function() {
    var addInput = $('#add-input');

    if (addInput.val()!='') {
      var formData = new FormData();

      formData.append('upload',addInput[0].files[0]);
      $('#completed').html('File Uploaded Successfully!');

      $.ajax({
        url:'/userupload',
        type:'POST',
        data: formData,
        processData: false,
        contentType: false,
        success:function () {
          addInput.val('');
        }
      });
    }
    ShowImage(this);
  });

  $('#profile').on('click', function () {
    var username = $('#username').val();
    var fullname = $('#fullname').val();
    var city = $('#city').val();
    var gender = $('#gender').val();
    var mantra = $('#mantra').val();
    var userImage = $('#add-input').val();
    var image = $('#user-image').val();

    var valid = true;

    if (upload === '') {
      $('#add-input').val(image);
    }

    if (username == '' || fullname == '' || city == '' || gender == '' || mantra == '') {
      valid = false;
      $('#error').html('<div class="alert alert-danger">You can not submit an emty field!</div>');
    } else {
      userImage = $('#add-input').val();
      $('#error').html('');
    }

    if (valid === true) {
        $.ajax({
          url: '/settings/profile',
          type: 'POST',
          data: {
            username: username,
            fullname: fullname,
            gender: gender,
            city: city,
            mantra: mantra,
            upload: userImage
          },
          success: function () {
            setTimeout(function() {
              window.location.reload();
            }, 200);
          }
        });
    } else{
      return false;
    }
  });
});

function ShowImage(input) {
  if (input.files && input.files[0]) {
    console.log('baal');
    var reader = new FileReader();
    reader.onload = function (e) {
      $('#show_img').attr('src', e.target.result);

    }
    reader.readAsDataURL(input.files[0]);
  }
}

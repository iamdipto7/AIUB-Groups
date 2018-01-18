$(document).ready(function () {
  $('#favGroupBtn').on('click', function(){
    var favGroup = $('#favGroup').val();

    var valid = true;

    if (favGroup === '') {
      valid = false;
      $('#error').html('<div class="alert alert-danger">You can not submit an emty field!</div>');
    } else {
      $('#error').html('');
    }

    if (valid === true) {
      $.ajax({
        url: '/settings/interests',
        type: 'POST',
        data: {
          favGroup: favGroup
        },
        success: function () {
          setTimeout(function () {
            window.location.reload();
          }, 200);
        }
      });
    } else {
      return false;
    }
  });
});

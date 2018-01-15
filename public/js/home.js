$(document).ready(function() {
  $('#favorite').on('submit', (e) => {
    e.preventDefault();

    var id = $('#id').val();
    var groupName = $('#groupName').val();

    console.log(id);
    console.log(groupName);

    $.ajax({
      url: '/home',
      type: 'POST',
      data: {
        id: id,
        groupName: groupName
      },
      success: function () {
        console.log(groupName);
      }
    })
  });
});

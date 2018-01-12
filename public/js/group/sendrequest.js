$(document).ready(function(){
  var socket = io();

  var room = $('#groupName').val();
  var sender = $('#sender').val();

  socket.on('connect', () => {
    var params = {
      sender:sender
    }

    socket.emit('joinRequest', params, function () {
      console.log('Joined');
    });
  });

  socket.on('newFriendRequest', function (friend) {


    $(document).on('click', '#accept_friend', function () {
      //e.preventDefault();

      var senderId = $('#senderId').val();
      var senderName = $('#senderName').val();

      console.log(senderName);

      $.ajax({
        url: '/group/'+room,
        type: 'POST',
        data: {
          senderId: senderId,
          senderName: senderName
        },
        success: function () {
          $(this).parent().eq(1).remove();
        }

      });
      $('#reload').load(location.href + ' #reload');
    });

    $(document).on('click', '#cancel_friend', function () {
      //e.preventDefault();

      var user_Id = $('#user_Id').val();

      $.ajax({
        url: '/group/'+room,
        type: 'POST',
        data: {
          user_Id: user_Id
        },
        success: function () {
          $(this).parent().eq(1).remove();
        }

      });
      $('#reload').load(location.href + ' #reload');
    });

    $('#reload').load(location.href + ' #reload');

  });

  $('#add_friend').on('submit', function (e) {
    e.preventDefault();

    var receiverName = $('#receiverName').val();

    $.ajax({
      url: '/group/'+room,
      type: 'POST',
      data: {
        receiverName: receiverName
      },
      success: function () {
        socket.emit('friendRequest', {
          receiver: receiverName,
          sender: sender
        }, function () {
          console.log('Request Sent');
        });
      }
    });
  });

  $('#accept_friend').on('click', function () {
    //e.preventDefault();

    var senderId = $('#senderId').val();
    var senderName = $('#senderName').val();

    console.log(senderName);

    $.ajax({
      url: '/group/'+room,
      type: 'POST',
      data: {
        senderId: senderId,
        senderName: senderName
      },
      success: function () {
        $(this).parent().eq(1).remove();
      }

    });
    $('#reload').load(location.href + ' #reload');
  });

  $('#cancel_friend').on('click', function () {
    //e.preventDefault();

    var user_Id = $('#user_Id').val();

    $.ajax({
      url: '/group/'+room,
      type: 'POST',
      data: {
        user_Id: user_Id
      },
      success: function () {
        $(this).parent().eq(1).remove();
      }

    });
    $('#reload').load(location.href + ' #reload');
  });
});

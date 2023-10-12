$(document).ready(() => {
    // initializing socket.io on the client side
    const socket = io();

    $('#chatForm').submit(() => {
        let text = $('#chatInput').val();
        let userId = $('#chatUserId').val();
        let userName = $('#chatUserName').val();
        socket.emit("message", {
          content: text,
          userId: userId,
          userName: userName
        });

        $('#chatInput').val('');
        return false;
    });

    socket.on('message', (message) => {
      displayMessage(message);

      for (let i = 0; i <=2; i++) {
        $('.chat-icon').fadeOut(200).fadeIn(200);
      }
    });

    socket.on('load all messages', data => {
      data.forEach(message => {
        displayMessage(message);
      });
    });

    socket.on('user connected', () => {
        let userName = $('#chatUserName').val();
        displayMessage({
            userName: 'Notice',
            content: `${userName} has joined the chat`
        });
    });

    socket.on('user disconnected', () => {
        displayMessage({
            userName: 'Notice',
            content: 'User left the chat'
        });
    });

    let displayMessage = (message) => {
        $('#chat').prepend($("<li>").html(`
        <strong class="message ${getCurrentUserClass(message.user)}">
            ${message.userName}
        </strong>: ${message.content}
        `));
    };

    let getCurrentUserClass = (id) => {
        let userId = $('#chatUserId').val();
        return userId === id ? "current-user" : "";
    }

    $("#course-modal-button").click(() => {
        $('.modal-body').html("");
        $.get(`/api/courses?apiToken=lDK398qWC2SkGUuT`, (results = {}) => {
            let data = results.data;
            if (!data || !data.courses) return;
            data.courses.forEach((course) => {
                $(".modal-body").append(
                    `<div class="card w-auto course-modal-card" style="margin-top: 10px;">
                        <div class="card-body">
                            <span><i class="fa-solid fa-bowl-food food-bowl"></i></span>
                            <h5 class="card-title course-modal-title">${course.title}</h5>
                            <p class="card-text">${course.description}</p>
                            <button class="btn btn-primary ${course.joined ? "joined-button" : "join-btn"}" data-id="${course._id}">
                                ${course.joined ? "Joined" : "Join"}
                            </button>
                        </div>
                    </div>`
                );
            });
        }).then(() => {
            // add an event listener on join buttons
            addJoinButtonListener();
        });
    });
});

let addJoinButtonListener = () => {
    $(".join-btn").click((event) => {
      let $button = $(event.target);
      let courseId = $button.data("id");

      $.get(`/api/courses/${courseId}/join`, (results = {}) => {
        let data = results.data;
        if (data && data.success) {
            $button.text("Joined").addClass("joined-button").removeClass("join-btn");
        } else {
            $button.text("Try again");
        }
      });
    });
}


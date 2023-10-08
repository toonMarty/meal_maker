$(document).ready(() => {
    $("#course-modal-button").click(() => {
        $('.modal-body').html("");
        $.get("/api/courses", (results = {}) => {
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
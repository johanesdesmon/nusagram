
function post() {
    let comment = $("#textarea-post").val()
    let today = new Date().toISOString()
    let file = $("#image").prop("files")[0];
    let form_data = new FormData();

    form_data.append('file_give', file);
    form_data.append('comment_give', comment);
    form_data.append('date_give', today);

    
    $.ajax({
        type: "POST",
        url: "/posting",
        data: form_data,
        contentType : false,
        processData : false,
        success: function (response) {
            $("#modal-post").removeClass("is-active")
            alert(response['msg']);
            window.location.reload()
        }
    })
}

function get_posts(username) {
    // code untuk menapilkan post by user
    if (username === undefined){
        username = '';
    }

    $("#post-box").empty();
    $.ajax({
        type: "GET",
        url: `/get_posts?username_give=${username}`,
        // url:"/get_posts",
        data: {},
        success: function (response) {
            if (response["result"] === "success") {
                let posts = response["posts"];
                for (let i = 0; i < posts.length; i++) {
                    let post = posts[i];
                    let class_heart = post['heart_by_me'] ? "fa-heart" : "fa-heart-o"
                    let class_star = post['star_by_me'] ? "fa-star" : "fa-star-o"
                    let class_thumbsup = post['thumbsup_by_me'] ? "fa-thumbsup" : "fa-thumbs-o-up"
                    let time_post = new Date(post["date"]);
                    let time_before = time2str(time_post);
                    let html_temp = `<div class="box" id="${post["_id"]}">
                                          <article class="media">
                                              <div class="media-left">
                                                  <a class="image is-64x64" href="/user/${post["username"]}">
                                                      <img class="is-rounded" src="/static/${post["profile_pic_real"]}"
                                                           alt="Image">
                                                  </a>
                                              </div>
                                              <div class="media-content">
                                                  <div class="content">
                                                      <p>
                                                          <strong>${post["profile_name"]}</strong> <small>${time_before}</small>
                                                          <br>
                                                          <img class="is-rounded" src="../${post["foto"]}"
                                                          alt="Image">
                                                          <small>@${post["username"]}</small>
                                                          <br>
                                                          ${post["comment"]}
                                                      </p>
                                                  </div>
                                                  <nav class="level is-mobile">
                                                      <div class="level-left">

                                                          <a class="level-item is-sparta" aria-label="heart" onclick="toggle_like('${post["_id"]}', 'heart')">
                                                            <span class="icon is-small"><i class="fa ${class_heart}" aria-hidden="true"></i></span>
                                                            &nbsp;
                                                            <span class="like-num">${num2str(post["count_heart"])}</span>
                                                          </a>

                                                          <a class="level-item is-sparta" aria-label="star" onclick="toggle_star('${post["_id"]}', 'star')">
                                                          <span class="icon is-small"><i class="fa ${class_star}" aria-hidden="true"></i></span>
                                                          &nbsp;
                                                          <span class="like-num">${num2str(post["count_star"])}</span>
                                                        </a>

                                                      </div>
  
                                                  </nav>
                                              </div>
                                          </article>
                                      </div>`;
                    let html_temp2 = 
                    `
                                    <div class="post_user_detail">
                                    <div class="user_detail">
                                    <div class="profile_pic pending">
                                    <a class="image is-64x64" href="/user/${post["username"]}">
                                    <img class="is-rounded" src="/static/${post["profile_pic_real"]}"
                                         alt="Image">
                                </a>
                                    </div>
                                    <p class="status_username">${post["username"]}</p>
                                    </div>
                                    <a href="#" class="menuIcon">
                                    <img src="../static/svg/three_dots.svg" alt="menu" />
                                    </a>
                                </div>
                        
                                <div class="post_content">
                                    <img src="${post["foto"]}" alt="post1" />
                                </div>
                        
                                <div class="post_description">
                                    <!-- POST INTERACTIONS -->
                                    <div class="post_interactions">
                                    <div class="interactions">

                                    <nav class="level is-mobile">
                                        <div class="level-left">

                                            <a class="level-item is-sparta" aria-label="heart" onclick="toggle_like('${post["_id"]}', 'heart')">
                                            <span class="icon is-small"><i class="fa ${class_heart}" aria-hidden="true"></i></span>
                                            &nbsp;
                                            <span class="like-num">${num2str(post["count_heart"])}</span>
                                            </a>
                                            &nbsp;
                                            &nbsp;
                                            <a class="level-item is-sparta" aria-label="star" onclick="toggle_star('${post["_id"]}', 'star')">
                                            <span class="icon is-small"><i class="fa ${class_star}" aria-hidden="true"></i></span>
                                            &nbsp;
                                            <span class="like-num">${num2str(post["count_star"])}</span>
                                        </a>

                                        </div>

                                    </nav>
                                </div>
                                    <div class="interaction_icons saveIcon">
                                        <img src="../static/svg/saved.svg" alt="save" />
                                    </div>
                                    </div>
                                </div>
                        
                                <!-- POST DESCRIPTION -->
                                <div class="description">
                                    <p class="likes">${num2str(post["count_heart"])} likes</p>
                                    <div>
                                    <a class="textusername" href="/user/${post["username"]}">${post["username"]}</a>
                                    <p>
                                    ${post["comment"]}
                                    </p>
                                    </div>
                                    <a href="#" class="view_all_comments">View all 27 comments</a>
                                    <div class="time">${time_before}</div>
                                </div>
                                </div>
                                    `;
                    $("#post-box").append(html_temp);
                }
            }
        },
    });
}

function time2str(date) {
    let today = new Date();
    let time = (today - date) / 1000 / 60;  // minutes

    if (time < 60) {
        return parseInt(time) + " minutes ago";
    }
    time = time / 60;  // hours
    if (time < 24) {
        return parseInt(time) + " hours ago";
    }
    time = time / 24; // days
    if (time < 7) {
        return parseInt(time) + " days ago";
    }
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
}

function num2str(count) {
    if (count > 10000) {
        return parseInt(count / 1000) + "k"
    }
    if (count > 500) {
        return parseInt(count / 100) / 10 + "k"
    }
    if (count == 0) {
        return ""
    }
    return count
}


function toggle_like(post_id, type) {
    console.log(post_id, type);
    let $a_like = $(`#${post_id} a[aria-label='heart']`);
    let $i_like = $a_like.find("i");
    if ($i_like.hasClass("fa-heart")) {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "unlike",
            },
            success: function (response) {
                console.log("unlike");
                $i_like.addClass("fa-heart-o").removeClass("fa-heart");
                $a_like.find("span.like-num").text(num2str(response["count"]));
            },
        });
    } else {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "like",
            },
            success: function (response) {
                console.log("like");
                $i_like.addClass("fa-heart").removeClass("fa-heart-o");
                $a_like.find("span.like-num").text(response["count"]);
            },
        });
    }
}

function toggle_star(post_id, type) {
    console.log(post_id, type);
    let $a_like = $(`#${post_id} a[aria-label='star']`);
    let $i_like = $a_like.find("i");
    if ($i_like.hasClass("fa-star")) {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "unlike",
            },
            success: function (response) {
                console.log("unlike");
                $i_like.addClass("fa-star-o").removeClass("fa-star");
                $a_like.find("span.like-num").text(num2str(response["count"]));
            },
        });
    } else {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "like",
            },
            success: function (response) {
                console.log("like");
                $i_like.addClass("fa-star").removeClass("fa-star-o");
                $a_like.find("span.like-num").text(response["count"]);
            },
        });
    }
}

function toggle_thumbsup(post_id, type) {
    console.log(post_id, type);
    let $a_like = $(`#${post_id} a[aria-label='thumbsup']`);
    let $i_like = $a_like.find("i");
    if ($i_like.hasClass("fa-thumbs-up")) {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "unlike",
            },
            success: function (response) {
                console.log("unlike");
                $i_like.addClass("fa-thumbs-o-up").removeClass("fa-thumbs-up");
                $a_like.find("span.like-num").text(num2str(response["count"]));
            },
        });
    } else {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "like",
            },
            success: function (response) {
                console.log("like");
                $i_like.addClass("fa-thumbs-up").removeClass("fa-thumbs-o-up");
                $a_like.find("span.like-num").text(response["count"]);
            },
        });
    }
}


function sign_out() {
    $.removeCookie('mytoken', { path: '/' });
    alert('Signed out!');
    window.location.href = "/login";
}

function update_profile() {
  let name = $("#input-name").val();
  let file = $("#input-pic")[0].files[0];
  let about = $("#textarea-about").val();
  let form_data = new FormData();
  form_data.append("file_give", file);
  form_data.append("name_give", name);
  form_data.append("about_give", about);
  console.log(name, file, about, form_data);

  $.ajax({
    type: "POST",
    url: "/update_profile",
    data: form_data,
    cache: false,
    contentType: false,
    processData: false,
    success: function (response) {
      if (response["result"] === "success") {
        alert(response["msg"]);
        window.location.reload();
      }
    },
  });
}
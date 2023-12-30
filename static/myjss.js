
function displayComments(postId) {
    console.log(postId);
    $.ajax({
        type: "GET",
        url: `/get_comments?post_id_give=${postId}`,
        success: function (response) {
            if (response["result"] === "success") {
                let comments = response["comments"];
                console.log(comments);

                // Clear existing comments

                // Display new comments
                for (let i = 0; i < comments.length; i++) {
                    let comment = comments[i];
                    let time_post = new Date(comment["date"]);
                    let time_before = time2str(time_post);
                    

                    let html = `
                    <div class="comment">
                        &nbsp;
                        <p>
                        <small>${time_before}</small>
                        <br>
                        ${comment["comment"]}
                        </>
                    </div>
                `;
        
                $(`#${postId}`).append(html);
                }
            } else {
                alert(response.msg);
            }
        },
    });
}


function addComment(post_Id, commentText) {
    console.log(post_Id);
    console.log(commentText);

    let today = new Date().toISOString()
    let form_data = new FormData();

    form_data.append('post_id_give', post_Id);
    form_data.append('comment_give', commentText);
    form_data.append('date_give', today);

    $.ajax({
        type: "POST",
        url: "/add_comment",
        data: form_data,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.result === "success") {
                alert(response.msg);
                window.location.reload() // Refresh comments after adding one
            } else {
                alert(response.msg);
            }
        },
    });
}

function submitComment(post_id,comment_text) {
    let postId = post_id;
    let commentText = comment_text;
    console.log(postId);
    console.log(commentText);

    // Periksa apakah postId dan commentText kosong
    if (!commentText) {
        alert("comment text cannot be empty.");
        return;
    }

    addComment(postId, commentText);
}


function displayComments_post(postId) {
    console.log(postId);
    $.ajax({
        type: "GET",
        url: `/get_comments_post?post_id_give=${postId}`,
        success: function (response) {
            if (response["result"] === "success") {
                let comments = response["comments"];
                console.log(comments);

                // Clear existing comments

                // Display new comments
                for (let i = 0; i < comments.length; i++) {
                    let comment = comments[i];
                    let time_post = new Date(comment["date"]);
                    let time_before = time2str(time_post);
                    

                    let html = `
                    <div class="comment">
                        &nbsp;
                        <p>
                        <small>${time_before}</small>
                        <br>
                        ${comment["username"]} >>>
                        ${comment["comment"]}
                        </>
                    </div>
                `;
        
                $(`#${postId}`).append(html);
                }
            } else {
                alert(response.msg);
            }
        },
    });
}


function addCommentpost(post_Id, commentText, usernamepostt) {
    console.log(post_Id);
    console.log(commentText);
    console.log(usernamepostt);

    let today = new Date().toISOString()
    let form_data = new FormData();

    form_data.append('post_id_give', post_Id);
    form_data.append('username_give', usernamepostt);
    form_data.append('comment_give', commentText);
    form_data.append('date_give', today);

    $.ajax({
        type: "POST",
        url: "/add_comment_post",
        data: form_data,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.result === "success") {
                alert(response.msg);

                window.location.reload() // Refresh comments after adding one
            } else {
                alert(response.msg);
            }
        },
    });
}


function submitCommentpost(post_id,comment_text, usernamepost) {
    let postId = post_id;
    let commentText = comment_text;
    let usernamepostloh = usernamepost;
    console.log(postId);
    console.log(commentText);
    console.log(usernamepost);

    // Periksa apakah postId dan commentText kosong
    if (!commentText) {
        alert("comment text cannot be empty.");
        return;
    }

    addCommentpost(postId, commentText, usernamepostloh);
}

function displaySelectedFile() {
    const fileInput = document.getElementById('fileInput');
    const selectedImage = document.getElementById('selectedImage');
    const selectedFileName = document.getElementById('selectedFileName');

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            selectedImage.src = e.target.result;
            selectedImage.style.display = 'block';
        };

        reader.readAsDataURL(fileInput.files[0]);

        // Menampilkan nama file
        selectedFileName.textContent = `Selected File: ${fileInput.files[0].name}`;
    }
}

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
        contentType: false,
        processData: false,
        success: function (response) {
            alert(response['msg']);
            $("#add_post").hide();
            window.location.reload()

        }
    })
}

function anonmsg() {
    var userProfileElement = document.getElementById('user-profile');
    var userProfile = userProfileElement.getAttribute('data-profile');
    console.log(userProfile);

    let comment = $("#textarea-post").val()
    let today = new Date().toISOString()
    let form_data = new FormData();


    form_data.append('comment_give', comment);
    form_data.append('date_give', today);
    form_data.append('username_give', userProfile);


    $.ajax({
        type: "POST",
        url: "/anonmsg",
        data: form_data,
        contentType: false,
        processData: false,
        success: function (response) {
            alert(response['msg']);
            $("#add_post").hide();
            window.location.reload()

        }
    })
}

function get_anonmsg(username) {
    $("#post-box").empty();
    $.ajax({
        type: "GET",
        url: `/get_anonmsg?username_give=${username}`,
        data: {},
        success: function (response) {
            if (response["result"] === "success") {
                let anonmsg = response["anonmsg"];
                for (let i = 0; i < anonmsg.length; i++) {
                    let msg = anonmsg[i];
                    let class_heart = post['heart_by_me'] ? "fa-heart" : "fa-heart-o"
                    let time_post = new Date(msg["date"]);
                    let time_before = time2str(time_post);
                    let html_temp1 = `
                    <div class="box">
                    <article class="media">
 
                        <div class="media-content">
                            <div class="content">
                                <p>
                                    <small>${time_before}</small>
                                    <br />
                                    ${msg["comment"] }
                                </p>
                            </div>
        
                            <!-- Comments section -->
                            <div id=${msg["_id"]}>
                                <!-- Comments will be dynamically added here -->
                            </div>
                            
                            <!-- Input area for adding comments -->
                            <div class="inicomment">
                            <textarea class="input" id="comment_text_${msg["_id"]}" cols="30" rows="10" placeholder="Add a comment"></textarea>
                            <button class="buttoncomment" onclick="submitComment('${msg["_id"]}', $('#comment_text_${msg["_id"]}').val())">Submit</button>                            
                            </div>
                        </div>
                    </article>
                </div>
                    `
                    $("#post-box").append(html_temp1);
                    displayComments(`${msg["_id"]}`);

                }
            }
        },
    });
}


function get_profile() {
    $("#status").empty();
    $("#other_people").empty();
    $.ajax({
        type: "GET",
        url: "/get_profile",
        data: {},
        success: function (response) {
            if (response["result"] === "success") {
                let usersprofile = response["usersprofile"];
                for (let i = 0; i < usersprofile.length; i++) {
                    let profile = usersprofile[i];
                    let html_temp1 = `
                    <div class="other_people">        
                    <div class="profile_details">
                    <div class="profile_pic_suggested">
                        <a href="/user/${profile["username"]}">
                      <img src="/static/${profile["profile_pic_real"]}" />
                        </a>
                    </div>
                    <div class="more_details">
                      <p class="username">${profile["username"]}</p>
                      <p class="name">New to minigram</p>
                    </div>
                    <div class="switch_link">
                    <a href="#">Follow</a>
                  </div>
                  </div>
                  </div>`
                    let html_temp2 = `
                    <div class="status_card">
                        <div class="profile_pic pending">
                        <a href="/user/${profile["username"]}">
                        <img src="/static/${profile["profile_pic_real"]}" />
                        </a>
                        </div>
                        <p class="status_username">${profile["profile_name"]}</p>
                    </div>
                    `

                    $("#status").append(html_temp2);
                    $("#right-side").append(html_temp1);

                }
            }
        },
    });
}


function get_posts(username) {
    var userProfileElement = document.getElementById('user-profile');
    var userProfile = userProfileElement.getAttribute('data-profile');
    // code untuk menapilkan post by user
    if (username === undefined) {
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
                    let time_post = new Date(post["date"]);
                    let time_before = time2str(time_post);
                    let html_temp = `
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
                                    <p>${num2str(post["count_heart"])} likes</p> &nbsp; <p> ${num2str(post["count_star"])} star</p>
                                    </div>
                                    <div class="interaction_icons saveIcon">
                                        <img src="../static/svg/saved.svg" alt="save" />
                                    </div>
                                    </div>
                                </div>
                        
                                <!-- POST DESCRIPTION -->
                                <div class="description">
                                    <div>
                                    <a class="textusername" href="/user/${post["username"]}">${post["username"]}</a>
                                    <p>
                                    ${post["comment"]}
                                    </p>
                                    </div>

                                    <!-- Comments section -->
                                    <div id=${post["_id"]}>
                                        <!-- Comments will be dynamically added here -->
                                    </div>


                                    <!--<a href="#" class="view_all_comments">View all 27 comments</a>-->

                                    <div class="inicomment">
                                    <textarea class="input" id="comment_text_${post["_id"]}" cols="30" rows="10" placeholder="Add a comment"></textarea>
                                    <button class="buttoncomment" onclick="submitCommentpost('${post["_id"]}', $('#comment_text_${post["_id"]}').val(), '${userProfile}') ">Submit</button>                                                   
                                    </div>
                                    <div class="time">${time_before}</div>
                                </div>
                                </div>
                                    `;

                    $("#post-box").append(html_temp);
                    displayComments_post(`${post["_id"]}`);

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
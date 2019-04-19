$(document).on('ready', function () {
    checkIfAlreadyConnected();
    getUser();
    openPanel();
    closePanel();
    addSkill();
    getSkills();
    addStudies();
    getStudies();
});

function addUserView(user) {
    $("#sidebar-user-name").text(capitalize(user.firstname) + " " + capitalize(user.lastname));
    $("#home-welcome-user").text("Bonjour " + capitalize(user.firstname) + " " + capitalize(user.lastname));
    $("#header-user-name").html('<img src="http://placehold.it/50x50" alt="" /><i class="la la-bars"></i>' + capitalize(user.firstname) + " " + capitalize(user.lastname));
    $("#header-user-name-responsive").html('<img src="http://placehold.it/50x50" alt="" /><i class="la la-bars"></i>' + capitalize(user.firstname) + " " + capitalize(user.lastname));

}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function getUser() {
    $.ajax({
        type: 'POST',
        url: 'http://jurisgo.petitesaffiches.fr/user',
        data: { datas: { "user_token": getCookie("user_token") } },
        dataType: 'json',
        success: function (result) {
            addUserView(result.user);
        }
    });
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getStudies() {
    $.ajax({
        type: 'POST',
        url: 'http://jurisgo.petitesaffiches.fr/candidate/studies',
        data: { datas: { "user_token": getCookie("user_token") } },
        dataType: 'json',
        success: function (result) {
            $("#candidate-resume-studies").html("");
            console.log(result);

            for (elem in result.datas) {
                $("#candidate-resume-studies").append('<div id="studie-element-' + result.datas[elem].id + '" class="edu-history">\
                <i class="la la-graduation-cap"></i>\
                <div class="edu-hisinfo">\
                    <h3 id="resume-studies-diploma-value-' + result.datas[elem].id + '">' + result.datas[elem].diploma + '</h3>\
                    <i id="resume-studies-date-value-' + result.datas[elem].id + '">' + result.datas[elem].date_start + ' - ' + result.datas[elem].date_end + '</i>\
                    <span id="resume-studies-school-value-' + result.datas[elem].id + '">' + result.datas[elem].school + '<i id="resume-studies-branch-value-' + result.datas[elem].id + '">' + result.datas[elem].branch + '</i></span>\
                    <p id="resume-studies-comment-value-' + result.datas[elem].id + '">' + result.datas[elem].comment + '</p>\
                </div>\
                <ul class="action_job">\
                    <li><span>Edit</span><a><i class="la la-pencil" onclick="updateStudies(this.id)" id="' + result.datas[elem].id + '"></i></a>\
                    </li>\
                    <li><span>Delete</span><a><i\
                                class="la la-trash-o" onclick="removeStudies(this.id)" id="' + result.datas[elem].id + '"></i></a></li>\
                </ul>\
                </div>');
            }
        }
    });
}

function addStudies() {
    $("#popup-add-studies").on("click", (e) => {
        var data = {
            user_token: getCookie("user_token"),
            date_end: $("#popup-input-dateend-studies").val(),
            date_start: $("#popup-input-datestart-studies").val(),
            comment: $("#popup-input-comment-studies").val(),
            school: $("#popup-input-school-studies").val(),
            diploma: $("#popup-input-diploma-studies").val(),
            branch: $("#popup-input-branch-studies").val(),
        };
        $.ajax({
            type: 'POST',
            url: 'http://jurisgo.petitesaffiches.fr/candidate/studie/add',
            data: { datas: data },
            dataType: 'json',
            success: function (result) {
                console.log(result);
                getStudies();
            }
        });
    });
}

function removeStudies(elem_id) {
    console.log("test");

    var data = {
        user_token: getCookie("user_token"),
        id: elem_id
    };
    $.ajax({
        type: 'POST',
        url: 'http://jurisgo.petitesaffiches.fr/candidate/studie/delete',
        data: { datas: data },
        dataType: 'json',
        success: function (result) {
            $("#studie-element-" + elem_id).remove();
            console.log(result);
        }
    });
}

function updateStudies(elem_id) {
    $("#popup-update-studies").css("visibility", "visible");
    $("#popup-add-studies").css("visibility", "hidden");
    $("#overlay-add-education").css("visibility", "visible");
    $("#popup-input-diploma-studies").val($("#resume-studies-diploma-value-" + elem_id).text());
    $("#popup-input-datestart-studies").val($("#resume-studies-date-value-" + elem_id).text().split("-").reverse().join("/")); // TODO FIX
    $("#popup-input-dateend-studies").val($("#resume-studies-date-value-" + elem_id).text().split("-").reverse().join("/"));
    $("#popup-input-school-studies").val($("#resume-studies-school-value-" + elem_id).text());
    $("#popup-input-branch-studies").val($("#resume-studies-branch-value-" + elem_id).text());
    $("#popup-input-comment-studies").val($("#resume-studies-comment-value-" + elem_id).text());
    $("#popup-update-studies").unbind().on("click", (e) => {
        var data = {
            user_token: getCookie("user_token"),
            date_end: $("#popup-input-dateend-studies").val(),
            date_start: $("#popup-input-datestart-studies").val(),
            comment: $("#popup-input-comment-studies").val(),
            school: $("#popup-input-school-studies").val(),
            diploma: $("#popup-input-diploma-studies").val(),
            branch: $("#popup-input-branch-studies").val(),
            id: elem_id
        };
        console.log(data);
             $.ajax({
                 type: 'POST',
                 url: 'http://jurisgo.petitesaffiches.fr/candidate/studie/update',
                 data: { datas: data },
                 dataType: 'json',
                 success: function (result) {
                     console.log(result);
                     $("#resume-studies-diploma-value-" + elem_id).text(data.diploma);
                     $("#resume-studies-branch-value-" + elem_id).text(data.branch);
                     $("#resume-studies-school-value-" + elem_id).text(data.school);
                     $("#resume-studies-comment-value-" + elem_id).text(data.comment);
                     $("#resume-studies-date-value-" + elem_id).text(data.date_start + " - " + data.date_end);
                 }
             });
    });
}

function getSkills() {
    $.ajax({
        type: 'POST',
        url: 'http://jurisgo.petitesaffiches.fr/candidate/skills',
        data: { datas: { "user_token": getCookie("user_token") } },
        dataType: 'json',
        success: function (result) {
            $("#candidate-resume-percentage").html("");
            for (elem in result.datas) {
                $("#candidate-resume-percentage").append('<div id="percentage-element-' + result.datas[elem].id + '" class="progress-sec with-edit">\
										<span id="resume-competencies-name-value-' + result.datas[elem].id + '">' + result.datas[elem].name + '</span>\
										<div class="progressbar">\
											<div class="progress" style="width:' + result.datas[elem].percentage + '%;"><span id="resume-competencies-percentage-value-' + result.datas[elem].id + '">' + result.datas[elem].percentage + '%</span></div>\
										</div>\
										<ul class="action_job">\
											<li><span>Edit</span><a><i class="la la-pencil" onclick="updateSkills(this.id)" id="' + result.datas[elem].id + '" ></i></a>\
											</li>\
											<li><span>Delete</span><a><i\
														class="la la-trash-o" onclick="removeSkills(this.id)" id="' + result.datas[elem].id + '" ></i></a></li>\
										</ul>\
									</div>');
            }
        }
    });
}

function updateSkills(elem_id) {
    $("#popup-update-competencies").css("visibility", "visible");
    $("#popup-add-competencies").css("visibility", "hidden");
    $("#overlay-add-competencies").css("visibility", "visible");
    $("#popup-input-name-competencies").val($("#resume-competencies-name-value-" + elem_id).text());
    $("#popup-input-percentage-competencies").val($("#resume-competencies-percentage-value-" + elem_id).text().slice(0, -1));
    $("#popup-update-competencies").unbind().on("click", (e) => {
        var data = {
            user_token: getCookie("user_token"),
            percentage: $("#popup-input-percentage-competencies").val(),
            name: $("#popup-input-name-competencies").val(),
            id: elem_id
        };
        console.log(data);
        $.ajax({
            type: 'POST',
            url: 'http://jurisgo.petitesaffiches.fr/candidate/skill/update',
            data: { datas: data },
            dataType: 'json',
            success: function (result) {
                console.log(result);
                $("#resume-competencies-name-value-" + elem_id).text(data.name);
                $("#resume-competencies-percentage-value-" + elem_id).text(data.percentage);
            }
        });
    });
}

function removeSkills(elem_id) {
    var data = {
        user_token: getCookie("user_token"),
        id: elem_id
    };
    $.ajax({
        type: 'POST',
        url: 'http://jurisgo.petitesaffiches.fr/candidate/skill/delete',
        data: { datas: data },
        dataType: 'json',
        success: function (result) {
            $("#percentage-element-" + elem_id).remove();
            console.log(result);
        }
    });
}

function addSkill() {
    $("#popup-add-competencies").on("click", (e) => {
        var data = {
            user_token: getCookie("user_token"),
            percentage: $("#popup-input-percentage-competencies").val(),
            name: $("#popup-input-name-competencies").val()
        };
        console.log(data);
        $.ajax({
            type: 'POST',
            url: 'http://jurisgo.petitesaffiches.fr/candidate/skill/add',
            data: { datas: data },
            dataType: 'json',
            success: function (result) {
                getSkills();
            }
        });
    });
}

function checkIfAlreadyConnected() {
    if (getCookie("user_token") === "")
        window.location.pathname = '/login';
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function openPanel() {
    $(".candidate_resume_open_panel").on("click", (e) => {

        switch (e.target.id) {
            case "candidate_resume_add_education":
                $("#overlay-add-education").css("visibility", "visible");
                break;
            case "candidate_resume_add_experiences":
                $("#overlay-add-experiences").css("visibility", "visible");
                break;
            case "candidate_resume_add_competencies":
                $("#popup-update-competencies").css("visibility", "hidden");
                $("#popup-add-competencies").css("visibility", "visible");
                $("#overlay-add-competencies").css("visibility", "visible");
                break;
        }
    });
}

function closePanel() {
    $(".candidate_resume_close_panel").on("click", (e) => {
        $("#overlay-dark-screen").css("visibility", "hidden");
        $("#popup-update-competencies").css("visibility", "hidden");
        $("#popup-add-competencies").css("visibility", "hidden");
        switch (e.target.id) {
            case "candidate_resume_close_education":
                $("#overlay-add-education").css("visibility", "hidden");
                break;
            case "candidate_resume_close_experiences":
                $("#overlay-add-experiences").css("visibility", "hidden");
                break;
            case "candidate_resume_close_competencies":
                $("#overlay-add-competencies").css("visibility", "hidden");
                break;
        }
    });
}
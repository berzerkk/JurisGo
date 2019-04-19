$(document).on('ready', function () {
    checkIfAlreadyConnected();
    getUser();
    openPanel();
    closePanel();
    addSkill();
    getSkills();
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

function getSkills() {
    $.ajax({
        type: 'POST',
        url: 'http://jurisgo.petitesaffiches.fr/candidate/skills',
        data: { datas: { "user_token": getCookie("user_token") } },
        dataType: 'json',
        success: function (result) {
            $("#candidate-resume-percentage").html("");
            for (elem in result.datas) {                
                $("#candidate-resume-percentage").append('<div class="progress-sec with-edit">\
										<span>' + result.datas[elem].name + '</span>\
										<div class="progressbar">\
											<div class="progress" style="width:' + result.datas[elem].percentage + '%;"><span>' + result.datas[elem].percentage + '</span></div>\
										</div>\
										<ul class="action_job">\
											<li><span>Edit</span><a href="#" title=""><i class="la la-pencil"></i></a>\
											</li>\
											<li><span>Delete</span><a class="resume-delete-competencies" id="' + result.datas[elem].id + '" ><i\
														class="la la-trash-o"></i></a></li>\
										</ul>\
									</div>');
            }
        }
    });
}

function remvoeSkills() {
    $(".resume-delete-competencies").on("click", (e) => {
        e.preventDefault();
        var data = {
            user_token: getCookie("user_token"),
            id: e.target.id
        };
        $.ajax({
            type: 'POST',
            url: 'http://jurisgo.petitesaffiches.fr/candidate/skill/add',
            data: { datas: data },
            dataType: 'json',
            success: function (result) {
                console.log(result);
                
                getSkills();
            }
        });
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
        console.log("abc");

        switch (e.target.id) {
            case "candidate_resume_add_education":
                $("#overlay-add-education").css("visibility", "visible");
                break;
            case "candidate_resume_add_experiences":
                $("#overlay-add-experiences").css("visibility", "visible");
                break;
            case "candidate_resume_add_competencies":
                $("#overlay-add-competencies").css("visibility", "visible");
                break;
        }
    });
}

function closePanel() {
    $(".candidate_resume_close_panel").on("click", (e) => {
        $("#overlay-dark-screen").css("visibility", "hidden");
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

// function DownloadPicture() {
//     $('#candidate_profile_image_download').change((e) => {
//         e.preventDefault();

//         var oFReader = new FileReader();
//         oFReader.readAsDataURL(document.getElementById("candidate_profile_image_download").files[0]);
//         oFReader.onload = function (oFREvent) {
//             $("#candidate_profile_picture").attr('src', oFREvent.target.result);
//         };
//     });
// }

// function submitCandidateProfile() {
//     $("#candidate_profile_button").on("click", (e) => {
//         e.preventDefault();
//         var data = {
//             firstname: $("#candidate_profile_firstname").val(),
//             lastname: $("#candidate_profile_lastname").val(),
//             email: $("#candidate_profile_email").val(),
//             phone: $("#candidate_profile_phone").val(),
//             freedom: $("#candidate_profile_freedom").val(),
//             birthdate: $("#candidate_profile_birthdate").val(),
//             location: $("#candidate_profile_location").val() // ADD tags
//         };
//         console.log(data);
//         if (data.firstname === "")
//             $("#error_candidate_profile_firstname").css("visibility", "visible");
//         if (data.lastname === "")
//             $("#error_candidate_profile_lastname").css("visibility", "visible");
//         if (data.email === "")
//             $("#error_candidate_profile_email").css("visibility", "visible");
//         if (data.phone === "")
//             $("#error_candidate_profile_phone").css("visibility", "visible");
//         if (data.freedom === "")
//             $("#error_candidate_profile_freedom").css("visibility", "visible");
//         if (data.birthdate === "")
//             $("#error_candidate_profile_birthdate").css("visibility", "visible");
//         if (data.location === "")
//             $("#error_candidate_profile_location").css("visibility", "visible");
//         // if (data.tags === "")
//         //         $("#error_candidate_profile_tags").css("visibility", "visible");


//     });
// }
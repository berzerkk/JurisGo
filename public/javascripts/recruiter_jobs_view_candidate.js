$(document).on('ready', function () {
        checkIfAlreadyConnected();
        getTypeUser();
        logOut();
        getCandidate();
        getSkills();
        getStudies();
        getExperiences();
        contact();
        addFavorite();
        checkFavorite();
});

function getCandidate() {
        $.ajax({
                type: 'POST',
                url: 'http://jurisgo.petitesaffiches.fr/user/id',
                data: { datas: { "user_token": getCookie("user_token"), id: new URL(window.location).searchParams.get("id") } },
                dataType: 'json',
                success: function (result) {
                        $.ajax({
                                type: 'POST',
                                url: 'http://jurisgo.petitesaffiches.fr/candidate/id',
                                data: { datas: { "user_token": getCookie("user_token"), id: new URL(window.location).searchParams.get("id") } },
                                dataType: 'json',
                                success: function (result2) {
                                        appendData(result.user, result2.data);

                                }
                        });
                }
        });
}

function getStudies() {
        $.ajax({
                type: 'POST',
                url: 'http://jurisgo.petitesaffiches.fr/candidate/studies/id',
                data: { datas: { "user_token": getCookie("user_token"), id: new URL(window.location).searchParams.get("id") } },
                dataType: 'json',
                success: function (result) {
                        $("#education-menu").text("Education (" + result.count + ")")
                        $("#education").html('<h2>Education</h2>');
                        for (elem in result.datas) {
                                $("#education").append('<div class="edu-history">\
                                <i class="la la-graduation-cap"></i>\
                                <div class="edu-hisinfo">\
                                        <h3>'+ result.datas[elem].diploma + '</h3>\
                                        <i>'+ result.datas[elem].date_start + ' - ' + result.datas[elem].date_end + '</i>\
                                        <span>'+ result.datas[elem].school + ' <i>' + result.datas[elem].branch + '</i></span>\
                                        <p></p>\
                                </div>\
                        </div>');
                        }
                }
        });
}

function getSkills() {
        $.ajax({
                type: 'POST',
                url: 'http://jurisgo.petitesaffiches.fr/candidate/skills/id',
                data: { datas: { "user_token": getCookie("user_token"), id: new URL(window.location).searchParams.get("id") } },
                dataType: 'json',
                success: function (result) {
                        $("#skills-menu").text("Skills (" + result.count + ")")
                        $("#skills").html('<h2>Professional Skills</h2>');
                        for (elem in result.datas) {
                                $("#skills").append('<div class="progress-sec">\
                        <span>'+ result.datas[elem].name + '</span>\
                        <div class="progressbar"> <div class="progress" style="width: '+ result.datas[elem].percentage + '%;"><span>' + result.datas[elem].percentage + '%</span></div> </div>\
                </div>');
                        }
                }
        });
}

function getExperiences() {
        $.ajax({
                type: 'POST',
                url: 'http://jurisgo.petitesaffiches.fr/candidate/experiences/id',
                data: { datas: { "user_token": getCookie("user_token"), id: new URL(window.location).searchParams.get("id") } },
                dataType: 'json',
                success: function (result) {
                        $("#experience-menu").text("Experience (" + result.count + ")")
                        $("#experience").html('<h2>Experience</h2>');
                        for (elem in result.datas) {
                                $("#experience").append('<div class="edu-history style2">\
                                <i></i>\
                                <div class="edu-hisinfo">\
                                        <h3>'+ result.datas[elem].function + '<span>' + result.datas[elem].company + '</span></h3>\
                                        <i>'+ result.datas[elem].date_start + ' - ' + result.datas[elem].date_end + '</i>\
                                        <p>'+ result.datas[elem].comment + '</p>\
                                </div>\
                        </div>');
                        }
                }
        });
}

function appendData(user, candidate) {
        $('#jobs-view-candidate-profil').html('<div class="cst"><img src="' + candidate.photo + '" alt="" /></div>\
        <h3>'+ user.firstname + ' ' + user.lastname + '</h3>\
        <span><i>'+ candidate.status + '</i> ' + candidate.disponibility + '</span>\
        <p>'+ candidate.email_alias + '</p>\
        <p>Member Since, 2017</p>\
        <p><i class="la la-map-marker"></i>'+ candidate.city + ' / ' + candidate.departement + '</p>');
}


function detailsCandidate(id) {
        window.location.href = '/recruiter_jobs_view_candidate?id=' + id;
}

function logOut() {
        $("#sidebar-logout").on("click", (e) => {
                e.preventDefault();
                setCookie("user_token", "", 0)
                document.location.reload(true);
        });
}

function checkFavorite() {
        $.ajax({
                type: 'POST',
                url: 'http://jurisgo.petitesaffiches.fr/favorite/is',
                data: {
                        datas: {
                                "user_token": getCookie("user_token"),
                                candidate: new URL(window.location).searchParams.get("id"),
                                job: new URL(window.location).searchParams.get("job")
                        }
                },
                dataType: 'json',
                success: function (result) {
                        if (!result.status) {
                                $("#job-view-candidate-favorite").css("color", "#008000").css("border", "2px solid #008000").addClass("add")
                                $("#job-view-candidate-favorite")
                                        .mouseover(() => { $('#job-view-candidate-favorite').css("background-color", "#008000").css("color", "#FFF") })
                                        .mouseout(() => { $('#job-view-candidate-favorite').css("background-color", "#FFF").css("color", "#008000") })
                        } else {
                                $("#job-view-candidate-favorite").css("color", "#FF0000").css("border", "2px solid #FF0000")
                                $("#job-view-candidate-favorite")
                                        .mouseover(() => { $('#job-view-candidate-favorite').css("background-color", "#FF0000").css("color", "#FFF") })
                                        .mouseout(() => { $('#job-view-candidate-favorite').css("background-color", "#FFF").css("color", "#FF0000") })
                        }
                }
        });
}

function addFavorite() {
        $("#job-view-candidate-favorite").on("click", (e) => {
                e.preventDefault();
                if ($("#job-view-candidate-favorite").hasClass("add")) {
                        $.ajax({
                                type: 'POST',
                                url: 'http://jurisgo.petitesaffiches.fr/favorite/add',
                                data: {
                                        datas: {
                                                "user_token": getCookie("user_token"),
                                                candidate: new URL(window.location).searchParams.get("id"),
                                                job: new URL(window.location).searchParams.get("job")
                                        }
                                },
                                dataType: 'json',
                                success: function (result) {
                                        $("#job-view-candidate-favorite").css("color", "#FF0000").css("border", "2px solid #FF0000").removeClass("add");
                                        $("#job-view-candidate-favorite")
                                                .mouseover(() => { $('#job-view-candidate-favorite').css("background-color", "#FF0000").css("color", "#FFF") })
                                                .mouseout(() => { $('#job-view-candidate-favorite').css("background-color", "#FFF").css("color", "#FF0000") })
                                }
                        });
                } else {
                        $.ajax({
                                type: 'POST',
                                url: 'http://jurisgo.petitesaffiches.fr/favorite/delete',
                                data: {
                                        datas: {
                                                "user_token": getCookie("user_token"),
                                                candidate: new URL(window.location).searchParams.get("id"),
                                                job: new URL(window.location).searchParams.get("job")
                                        }
                                },
                                dataType: 'json',
                                success: function (result) {
                                        $("#job-view-candidate-favorite").css("color", "#008000").css("border", "2px solid #008000").addClass("add")
                                        $("#job-view-candidate-favorite")
                                                .mouseover(() => { $('#job-view-candidate-favorite').css("background-color", "#008000").css("color", "#FFF") })
                                                .mouseout(() => { $('#job-view-candidate-favorite').css("background-color", "#FFF").css("color", "#008000") })
                                }
                        });
                }
        });
}

function addUserView(user, recruiter) {
        $("#sidebar-user-name").text(capitalize(user.firstname) + " " + capitalize(user.lastname));
        if (recruiter.photo)
                $("#image-user-sidebar").attr('src', recruiter.photo);
        $("#welcome-user").text("Bonjour " + capitalize(user.firstname) + " " + capitalize(user.lastname));
        $("#header-user-name").html('<img src="' + recruiter.photo + '" alt="" /><i class="la la-bars"></i>' + capitalize(user.firstname) + " " + capitalize(user.lastname));
        $("#header-user-name-responsive").html('<img src="' + recruiter.photo + '" alt="" /><i class="la la-bars"></i>' + capitalize(user.firstname) + " " + capitalize(user.lastname));
        $("#sidebar-button-resume").remove();
}

function contact() {
        $("#job-candidate-send-message").on("click", (e) => {
                e.preventDefault();
                $.ajax({
                        type: 'POST',
                        url: 'http://jurisgo.petitesaffiches.fr/user/id',
                        data: { datas: { "user_token": getCookie("user_token"), id: new URL(window.location).searchParams.get("id") } },
                        dataType: 'json',
                        success: function (result) {

                                $.ajax({
                                        type: 'POST',
                                        url: 'http://jurisgo.petitesaffiches.fr/recruiter',
                                        data: { datas: { "user_token": getCookie("user_token") } },
                                        dataType: 'json',
                                        success: function (result2) {
                                                $.ajax({
                                                        type: 'POST',
                                                        url: 'http://jurisgo.petitesaffiches.fr/candidate/id',
                                                        data: { datas: { "user_token": getCookie("user_token"), id: new URL(window.location).searchParams.get("id") } },
                                                        dataType: 'json',
                                                        success: function (result3) {
                                                                var dataMail = {
                                                                        text: $("#job-candidate-message").val(),
                                                                        subject: result2.data.company + " messaged you!",
                                                                        to: result3.data.email_alias
                                                                };
                                                                $.ajax({
                                                                        type: 'POST',
                                                                        url: '/contact',
                                                                        data: JSON.stringify(dataMail),
                                                                        contentType: 'application/json',
                                                                        success: function (res) {
                                                                                console.log(res);
                                                                        }
                                                                });
                                                        }
                                                });
                                        }
                                });
                        }
                });

        });
}

function getTypeUser() {
        $.ajax({
                type: 'POST',
                url: 'http://jurisgo.petitesaffiches.fr/user/type',
                data: { datas: { "user_token": getCookie("user_token") } },
                dataType: 'json',
                success: function (result) {
                        if (result.type === "candidate")
                                window.location.pathname = '/home';
                        else if (result.type === "recruiter")
                                getRecruiter();
                }
        });
}

function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function getRecruiter() {
        $.ajax({
                type: 'POST',
                url: 'http://jurisgo.petitesaffiches.fr/user',
                data: { datas: { "user_token": getCookie("user_token") } },
                dataType: 'json',
                success: function (result) {
                        $.ajax({
                                type: 'POST',
                                url: 'http://jurisgo.petitesaffiches.fr/recruiter',
                                data: { datas: { "user_token": getCookie("user_token") } },
                                dataType: 'json',
                                success: function (result2) {
                                        addUserView(result.user, result2.data);
                                }
                        });
                }
        });
}

function formatDate(date) {
        var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
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
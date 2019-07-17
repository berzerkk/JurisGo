$(document).on('ready', function () {
    checkIfAlreadyConnected();
    getTypeUser();
    logOut();
    getFavorite();
    getCurrentPoints();
});

function getCurrentPoints() {
    $.ajax({
            type: 'POST',
            url: 'https://api.jurisgo.fr/recruiter',
            data: { datas: { "user_token": getCookie("user_token") } },
            dataType: 'json',
            success: function (result) {
                    $('#pricing-recruiter').append(result.data.profile_point >= 10000 ? ' (illimités)' : ' (' + result.data.profile_point + ')');
            }
    });
}

function logOut() {
    $("#sidebar-logout").on("click", (e) => {
        e.preventDefault();
        setCookie("user_token", "", 0)
        document.location.reload(true);
    });
}

function getFavorite() {
    $.ajax({
        type: 'POST',
        url: 'https://api.jurisgo.fr/recruiter/favorite',
        data: { datas: { "user_token": getCookie("user_token") } },
        dataType: 'json',
        success: function (favorite) {
            if (favorite.count === 0) {
                $('.manage-favorite-sec').append('<h3 style="padding-bottom:200px;padding-top:150px;width:50%;margin:0 auto;float:none;">Aucun candidat n\'est enregistré en favori.</h3>');
            } else {
                favorite.datas.forEach((elem) => {
                    $.ajax({
                        type: 'POST',
                        url: 'https://api.jurisgo.fr/candidate/id',
                        data: { datas: { "user_token": getCookie("user_token"), id: elem.candidate } },
                        dataType: 'json',
                        success: function (candidate) {
                            $.ajax({
                                type: 'POST',
                                url: 'https://api.jurisgo.fr/user/id',
                                data: { datas: { "user_token": getCookie("user_token"), id: candidate.data.user } },
                                dataType: 'json',
                                success: function (user) {
                                    $.ajax({
                                        type: 'POST',
                                        url: 'https://api.jurisgo.fr/job',
                                        data: { datas: { "user_token": getCookie("user_token"), id: elem.job } },
                                        dataType: 'json',
                                        success: function (job) {
                                            $("#recruiter-favorite-list").append('<div class="emply-resume-list">\
                <div class="emply-resume-thumb">\
                    <img src="'+ candidate.data.photo + '" alt="" />\
                </div>\
                <div class="emply-resume-info">\
                    <h3><a>'+ user.user.firstname + ' ' + user.user.lastname + '</a></h3>\
                    <p>'+ job.datas.title + '</p>\
                    <p><i class="la la-map-marker"></i>'+ candidate.data.city + ' / ' + candidate.data.departement + '</p>\
                </div>\
                <div class="shortlists">\
                    <a onclick="goDetail('+ elem.candidate + ', ' + elem.job + ')">Détails<i class="la la-plus"></i></a>\
                </div>\
            </div>');
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
            }
        }
    });
}

function goDetail(id, job) {
    window.location.href = '/recruiter_jobs_view_candidate?id=' + id + '&' + 'job=' + job;

}

function addUserView(user, recruiter) {
    $("#sidebar-user-name").text(capitalize(user.firstname) + " " + capitalize(user.lastname));
    if (recruiter.photo !== "")
        $("#image-user-sidebar").attr('src', recruiter.photo);
    $("#welcome-user").text("Bonjour " + capitalize(user.firstname) + " " + capitalize(user.lastname));
    $("#header-user-name").html('<img src="' + (recruiter.photo === "" ? "images/default_avatar.png" : recruiter.photo) + '" alt="" /><i class="la la-bars"></i>' + capitalize(user.firstname) + " " + capitalize(user.lastname));
    $("#header-user-name-responsive").html('<img src="' + (recruiter.photo === "" ? "images/default_avatar.png" : recruiter.photo) + '" alt="" /><i class="la la-bars"></i>' + capitalize(user.firstname) + " " + capitalize(user.lastname));
    $("#sidebar-button-resume").remove();
    $("#sidebar-button-interview-candidate").remove();
}
function getTypeUser() {
    $.ajax({
        type: 'POST',
        url: 'https://api.jurisgo.fr/user/type',
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
        url: 'https://api.jurisgo.fr/user',
        data: { datas: { "user_token": getCookie("user_token") } },
        dataType: 'json',
        success: function (result) {
            $.ajax({
                type: 'POST',
                url: 'https://api.jurisgo.fr/recruiter',
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
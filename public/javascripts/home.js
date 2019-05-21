$(document).on('ready', function () {
        checkIfAlreadyConnected();
        getTypeUser();
        logOut();
});

function logOut() {
        $("#sidebar-logout").on("click", (e) => {
                e.preventDefault();
                setCookie("user_token", "", 0)
                document.location.reload(true);
        });
}


function addUserViewCandidate(user, candidate) {
        $("#sidebar-user-name").text(capitalize(user.firstname) + " " + capitalize(user.lastname));
        if (candidate.photo)
                $("#image-user-sidebar").attr('src', candidate.photo);
        $("#welcome-user").text("Bonjour " + capitalize(user.firstname) + " " + capitalize(user.lastname));
        $("#header-user-name").html('<img src="' + candidate.photo + '" alt="" /><i class="la la-bars"></i>' + capitalize(user.firstname) + " " + capitalize(user.lastname));
        $("#header-user-name-responsive").html('<img src="' + candidate.photo + '" alt="" /><i class="la la-bars"></i>' + capitalize(user.firstname) + " " + capitalize(user.lastname));
        $("#sidebar-button-jobs").remove();
        $("#sidebar-button-jobs-add").remove();
        $("#sidebar-button-favorite").remove();
        $("#sidebar-button-jobs-pricing").remove();
        $("#sidebar-email-alias").text(candidate.email_alias);
        $("#sidebar-location").text(candidate.city + ' / ' + candidate.departement);
        $("#sidebar-button-interview-recruiter").remove();
}

function addUserViewRecruiter(user, recruiter) {
        $("#sidebar-user-name").text(capitalize(user.firstname) + " " + capitalize(user.lastname));
        if (recruiter.photo)
                $("#image-user-sidebar").attr('src', recruiter.photo);
        $("#welcome-user").text("Bonjour " + capitalize(user.firstname) + " " + capitalize(user.lastname));
        $("#header-user-name").html('<img src="' + recruiter.photo + '" alt="" /><i class="la la-bars"></i>' + capitalize(user.firstname) + " " + capitalize(user.lastname));
        $("#header-user-name-responsive").html('<img src="' + recruiter.photo + '" alt="" /><i class="la la-bars"></i>' + capitalize(user.firstname) + " " + capitalize(user.lastname));
        $("#sidebar-button-resume").remove();
}

function getTypeUser() {
        $.ajax({
                type: 'POST',
                url: 'http://jurisgo.petitesaffiches.fr/user/type',
                data: { datas: { "user_token": getCookie("user_token") } },
                dataType: 'json',
                success: function (result) {
                        if (result.type === "candidate")
                                getCandidate();
                        else if (result.type === "recruiter")
                                getRecruiter();
                }
        });
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
                                        addUserViewRecruiter(result.user, result2.data);
                                }
                        });
                }
        });
}

function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function getCandidate() {
        $.ajax({
                type: 'POST',
                url: 'http://jurisgo.petitesaffiches.fr/user',
                data: { datas: { "user_token": getCookie("user_token") } },
                dataType: 'json',
                success: function (result) {
                        $.ajax({
                                type: 'POST',
                                url: 'http://jurisgo.petitesaffiches.fr/candidate',
                                data: { datas: { "user_token": getCookie("user_token") } },
                                dataType: 'json',
                                success: function (result2) {
                                        addUserViewCandidate(result.user, result2.data);
                                }
                        });
                }
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
$(document).on('ready', function () {
        checkIfAlreadyConnected();
        getTypeUser();
        logOut();
        getInterview();
});


function logOut() {
        $("#sidebar-logout").on("click", (e) => {
                e.preventDefault();
                setCookie("user_token", "", 0)
                document.location.reload(true);
        });
}

function transformDate(elem) {
        let date = elem.split(' ')[0].split('-').reverse().join('/');
        let hour = elem.split(' ')[1].split(':');
        hour.splice(2, 1);
        return date + ' ' + hour.join(':');
}

function getInterview() {
        $.ajax({
                type: 'POST',
                url: 'http://jurisgo.petitesaffiches.fr/recruiter/interview',
                data: { datas: { "user_token": getCookie("user_token") } },
                dataType: 'json',
                success: function (interview) {
                        interview.datas.forEach((elem) => {
                                $.ajax({
                                        type: 'POST',
                                        url: 'http://jurisgo.petitesaffiches.fr/candidate/id',
                                        data: { datas: { "user_token": getCookie("user_token"), id: elem.candidate } },
                                        dataType: 'json',
                                        success: function (candidate) {
                                                $.ajax({
                                                        type: 'POST',
                                                        url: 'http://jurisgo.petitesaffiches.fr/user/id',
                                                        data: { datas: { "user_token": getCookie("user_token"), id: candidate.data.user } },
                                                        dataType: 'json',
                                                        success: function (user) {
                                                                $.ajax({
                                                                        type: 'POST',
                                                                        url: 'http://jurisgo.petitesaffiches.fr/job',
                                                                        data: { datas: { "user_token": getCookie("user_token"), id: elem.job } },
                                                                        dataType: 'json',
                                                                        success: function (job) {
                                                                                $("#interview-list").append('<tr id="interview-' + elem.id + '">\
                                                                                <td>\
                                                                                   <div class="table-list-title">\
                                                                                         <h3><a href="recruiter_jobs_view_candidate?id=' + candidate.data.user + '&job=' + job.datas.id.toString() + '" title="">' + user.user.firstname + ' ' + user.user.lastname + '</a></h3>\
                                                                                   </div>\
                                                                                   </td>\
                                                                                <td>\
                                                                                        <div class="table-list-title">\
                                                                                                <h3><a href="recruiter_jobs_view?id='+ job.datas.id.toString() + '" title="">' + job.datas.title + '</a></h3>\
                                                                                        </div>\
                                                                                </td>\
                                                                                <td>\
                                                                                        <div>' + transformDate(elem.date) + '</div>\
                                                                                </td>\
                                                                                <td>\
                                                                                <a href="http://maps.google.com/?q=' + elem.address + '"><span>' + elem.address + '</span></a>\
                                                                                </td>\
                                                                                <td>\
                                                                                        <div>' + elem.status + '</div>\
                                                                                </td>\
                                                                                <td><a><i onclick="removeInterview(this.id)" id="' + elem.id + '"class="la la-trash-o" style="color:#951B3F"></i></a>\
                                                                                </td>\
                                                                        </tr>')
                                                                        }
                                                                });
                                                        }
                                                });
                                        }
                                });
                        });
                }
        });
}

function removeInterview(id) {
        $("#popup-purchase").html('<h3 style="line-height:40px;">Voulez vous supprimer ce rendez-vous ?</h3>\
        <div class="resumeconfirm-form" style="width: 100%">\
            <div class="row align-items-end">\
                <div class="row">\
                    <div class="col-lg-6">\
                        <button id="popup-confirm-delete" type="submit">Confirmer</button>\
                    </div>\
                    <div class="col-lg-6">\
                        <button id="popup-cancel-delete" type="submit">Annuler</button>\
                    </div>\
                </div>\
            </div>\
        </div>');
        $("#overlay-confirm-purchase").css("visibility", "visible");
        $("#popup-confirm-delete").unbind().on("click", (e) => {
                e.preventDefault();
                $.ajax({
                        type: 'POST',
                        url: 'http://jurisgo.petitesaffiches.fr/interview/delete',
                        data: { datas: { "user_token": getCookie("user_token"), id: id } },
                        dataType: 'json',
                        success: function (result) {
                                $("#interview-" + id).remove();
                                $("#overlay-confirm-purchase").css("visibility", "hidden");
                        }
                });
        });
        $("#popup-cancel-delete").unbind().on("click", (e) => {
                e.preventDefault();
                $("#overlay-confirm-purchase").css("visibility", "hidden");
        })

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
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
                url: 'http://jurisgo.petitesaffiches.fr/candidate/interview',
                data: { datas: { "user_token": getCookie("user_token") } },
                dataType: 'json',
                success: function (interview) {
                        interview.datas.forEach((elem) => {
                                $.ajax({
                                        type: 'POST',
                                        url: 'http://jurisgo.petitesaffiches.fr/recruiter/id',
                                        data: { datas: { "user_token": getCookie("user_token"), id: elem.recruiter } },
                                        dataType: 'json',
                                        success: function (recruiter) {
                                                $.ajax({
                                                        type: 'POST',
                                                        url: 'http://jurisgo.petitesaffiches.fr/job/id',
                                                        data: { datas: { "user_token": getCookie("user_token"), id: elem.job } },
                                                        dataType: 'json',
                                                        success: function (job) {
                                                                transformDate(elem.date);
                                                                $("#interview-list").append('<tr id="interview-' + elem.id + '">\
                                                                                <td>\
                                                                                    <div class="table-list-title">\
                                                                                          <h3>' + recruiter.data.company + '</h3>\
                                                                                    </div>\
                                                                                    </td>\
                                                                                 <td>\
                                                                                         <div class="table-list-title">\
                                                                                                 <h3>' + job.datas.title + '</h3>\
                                                                                         </div>\
                                                                                 </td>\
                                                                                 <td>\
                                                                                         <div>' + transformDate(elem.date) + '</div>\
                                                                                 </td>\
                                                                                 <td>\
                                                                                         <a href="http://maps.google.com/?q=' + elem.address + '"><span>' + elem.address + '</span></a>\
                                                                                 </td>\
                                                                                 <td>\
                                                                                         <div id="status-' + elem.id + '">' + translateStatus(elem.status) + '</div>\
                                                                                 </td>\
                                                                                  <td><a><i onclick="statusInterview(this.id)" id="' + elem.id + '"class="la la-pencil" style="color:#951B3F"></i></a>\
                                                                                  </td>\
                                                                         </tr>')
                                                        }
                                                });
                                        }
                                });
                        });
                }
        });
}

function translateStatus(status) {
        switch(status) {
                case 'waiting':
                return 'En Attente';
                case 'confirmed':
                return 'Accepté';
                case 'canceled':
                return 'Refusé';
        }
}

function statusInterview(id) {
        $("#popup-purchase").html('<h3 style="line-height:40px;">Que voulez vous faire avec ce rendez-vous ?</h3>\
        <div class="resumeconfirm-form">\
            <div class="row align-items-end">\
                <div class="row">\
                    <div class="col-lg-4">\
                        <button id="popup-confirm-status" type="submit">Confirmer</button>\
                    </div>\
                    <div class="col-lg-4">\
                        <button id="popup-cancel-status" type="submit">Refuser</button>\
                    </div>\
                    <div class="col-lg-4">\
                        <button id="popup-nothing-status" type="submit">Attendre</button>\
                    </div>\
                </div>\
            </div>\
        </div>');
        $("#overlay-confirm-purchase").css("visibility", "visible");
        $("#popup-confirm-status").unbind().on("click", (e) => {
                e.preventDefault();
                $.ajax({
                        type: 'POST',
                        url: 'http://jurisgo.petitesaffiches.fr/interview/update/status',
                        data: { datas: { "user_token": getCookie("user_token"), id: id, status: 'confirmed' } },
                        dataType: 'json',
                        success: function (result) {
                                $("#status-" + id).text('Accepté');
                                $("#overlay-confirm-purchase").css("visibility", "hidden");
                        }
                });
                $("#overlay-confirm-purchase").css("visibility", "hidden");
        });
        $("#popup-cancel-status").unbind().on("click", (e) => {
                e.preventDefault();
                $.ajax({
                        type: 'POST',
                        url: 'http://jurisgo.petitesaffiches.fr/interview/update/status',
                        data: { datas: { "user_token": getCookie("user_token"), id: id, status: 'canceled' } },
                        dataType: 'json',
                        success: function (result) {
                                $("#status-" + id).text('Refusé');
                                $("#overlay-confirm-purchase").css("visibility", "hidden");
                        }
                });
                $("#overlay-confirm-purchase").css("visibility", "hidden");
        });
        $("#popup-nothing-status").unbind().on("click", (e) => {
                e.preventDefault();
                $("#overlay-confirm-purchase").css("visibility", "hidden");
        });

}

function goDetail(id, job) {
        window.location.href = '/recruiter_jobs_view_candidate?id=' + id + '&' + 'job=' + job;

}

function addUserView(user, candidate) {
        $("#sidebar-user-name").text(capitalize(user.firstname) + " " + capitalize(user.lastname));        
        if (candidate.photo !== "") {
                $("#image-user-sidebar").attr('src', candidate.photo);
        }
        $("#welcome-user").text("Bonjour " + capitalize(user.firstname) + " " + capitalize(user.lastname));
        $("#header-user-name").html('<img src="' + (candidate.photo === "" ? "images/default_avatar.png" : candidate.photo) + '" alt="" /><i class="la la-bars"></i>' + capitalize(user.firstname) + " " + capitalize(user.lastname));
        $("#header-user-name-responsive").html('<img src="' + (candidate.photo === "" ? "images/default_avatar.png" : candidate.photo) + '" alt="" /><i class="la la-bars"></i>' + capitalize(user.firstname) + " " + capitalize(user.lastname));
        $("#sidebar-button-jobs").remove();
        $("#sidebar-button-jobs-add").remove();
        $("#sidebar-button-favorite").remove();
        $("#sidebar-button-jobs-pricing").remove();
        $("#sidebar-email-alias").text(candidate.email_alias);
        $("#sidebar-location").text(candidate.city + ' / ' + candidate.departement);
        $("#sidebar-button-interview-recruiter").remove();
}


function getTypeUser() {
        $.ajax({
                type: 'POST',
                url: 'http://jurisgo.petitesaffiches.fr/user/type',
                data: { datas: { "user_token": getCookie("user_token") } },
                dataType: 'json',
                success: function (result) {
                        if (result.type === "candidate")
                                getUser();
                        else if (result.type === "recruiter")
                                window.location.pathname = '/home';

                }
        });
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
                        $.ajax({
                                type: 'POST',
                                url: 'http://jurisgo.petitesaffiches.fr/candidate',
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
$(document).on('ready', function () {
        checkIfAlreadyConnected();
        getTypeUser();
        logOut();
        autocomplete();
        postJob();
});

function logOut() {
        $("#sidebar-logout").on("click", (e) => {
                e.preventDefault();
                setCookie("user_token", "", 0)
                document.location.reload(true);
        });
}

function autocomplete() {
        $("#job-add-adress").autocomplete({
                source: function (request, response) {
                        $.ajax({
                                type: 'GET',
                                url: "https://api-adresse.data.gouv.fr/search/?q=" + request.term,
                                success: function (result) {
                                        var data = [];
                                        for (var i = 0; i < result.features.length; i++)
                                                data.push(result.features[i].properties.label)
                                        response(data)
                                }
                        });
                },
                minLength: 5
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

function postJob() {
        $(".job-add-button").on("click", (e) => {
                e.preventDefault();
                var data = {
                        user_token: getCookie("user_token"),
                        title: $("#job-add-title").val(),
                        description: $("#job-add-comment").val(),
                        date_created: formatDate(new Date()),
                        date_start: $("#job-add-date-start").val().split("/").reverse().join("-"),
                        contract: $("#job-add-contract").val(),
                        sector: $("#job-add-sector").val(),
                        status: e.target.id,
                        latitude: "",
                        longitude: "",
                        experience: $("#job-add-experience").val(),
                        skills: "",
                        salary: $("#job-add-salary").val(),
                        address: $("#job-add-adress").val(),
                        city: "",
                        departement: "",
                };
                if ($("#job-add-adress").val() === "")
                        return;
                var i = 0
                var stringSkills = ""
                $(".addedTag").each((e) => {
                        stringSkills += (stringSkills === "" ? $("#skill-add-input-" + i).val() : "///" + $("#skill-add-input-" + i).val());
                        i++;
                });
                data.skills = stringSkills;
                $.ajax({
                        type: 'GET',
                        url: "https://api-adresse.data.gouv.fr/search/?q=" + $("#job-add-adress").val(),
                        success: function (result) {
                                data.longitude = result.features[0].geometry.coordinates[0];
                                data.latitude = result.features[0].geometry.coordinates[1];
                                data.city = result.features[0].properties.city;
                                data.departement = result.features[0].properties.postcode
                                console.log(data);
                                $.ajax({
                                        type: 'POST',
                                        url: 'http://jurisgo.petitesaffiches.fr/job/add',
                                        data: { datas: data },
                                        dataType: 'json',
                                        success: function (res) {
                                                window.location.pathname = '/recruiter_jobs';
                                        },
                                        error: function(err) {
                                                console.log(err); 
                                        }
                                    });
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
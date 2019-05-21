$(document).on('ready', function () {
        getJob((skillNumber) => {
                var numberSkillInput = parseInt(skillNumber) + 1;
                $('#addTagBtn').on('click', function () {
                        $('#tags option:selected').each(function () {
                                $(this).appendTo($('#selectedTags'));
                        });
                });
                $('#removeTagBtn').on('click', function () {
                        $('#selectedTags option:selected').each(function (el) {
                                $(this).appendTo($('#tags'));
                        });
                });
                $('.tagRemove').on('click', function (event) {
                        event.preventDefault();
                        numberSkillInput--;
                        $(this).parent().remove();
                });
                $('ul.tags').on('click', function () {
                        $('#search-field').focus();
                });
                $('#search-field').keypress(function (event) {
                        if (event.which == '13') {
                                if (($(this).val() != '') && ($(".tags .addedTag:contains('" + $(this).val() + "') ").length == 0)) {
                                        $('<li class="addedTag">' + $(this).val() + '<span class="tagRemove">x</span><input type="hidden" value="' + $(this).val() + '" name="tags[]" id="skill-add-input-' + numberSkillInput + '"></li>').insertBefore('.tags .tagAdd');
                                        $(this).val('');
                                        $('.tagRemove').unbind().on('click', function (event) {
                                                event.preventDefault();
                                                numberSkillInput--;
                                                $(this).parent().remove();
                                        });
                                        numberSkillInput++;

                                } else {
                                        $(this).val('');

                                }
                        }
                });
        });
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

function getJob(next) {
        $.ajax({
                type: 'POST',
                url: 'http://jurisgo.petitesaffiches.fr/job',
                data: { datas: { "user_token": getCookie("user_token"), id: new URL(window.location).searchParams.get("id") } },
                dataType: 'json',
                success: function (result) {
                        $("#job-add-title").val(result.datas.title).trigger("chosen:updated");
                        $("#job-add-comment").val(result.datas.description);
                        $("#job-add-date-start").val(result.datas.date_start);
                        $("#job-add-contract").val(result.datas.contract);
                        $("#job-add-sector").val(result.datas.sector);
                        $("#job-add-experience").val(result.datas.experience);
                        $("#job-add-adress").val(result.datas.address);
                        var skills = result.datas.skills.split("///");
                        for (i in skills) {
                                $("#job-add-skills").append('<li class="addedTag">' + skills[i] + '<span class="tagRemove">x</span><input\
                                type="hidden" name="tags[]" id="skill-add-input-'+ i + '" value="' + skills[i] + '"></li>');
                        }
                        $("#job-add-skills").append('<li class="tagAdd taglist">\
                        <input type="text" id="search-field">\
                </li>');
                        $("#job-add-salary").val(result.datas.salary);
                        next(i);
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
                        id: new URL(window.location).searchParams.get("id"),
                        user_token: getCookie("user_token"),
                        title: $("#job-add-title").val(),
                        description: $("#job-add-comment").val(),
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
                        console.log(i, $("#skill-add-input-" + i).val());
                        stringSkills += (stringSkills === "" ? $("#skill-add-input-" + i).val() : "///" + $("#skill-add-input-" + i).val());
                        i++;

                });
                data.skills = stringSkills;
                console.log(stringSkills);

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
                                        url: 'http://jurisgo.petitesaffiches.fr/job/update',
                                        data: { datas: data },
                                        dataType: 'json',
                                        success: function (res) {
                                                window.location.pathname = '/recruiter_jobs';
                                        },
                                        error: function (err) {
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
$(document).on('ready', function () {
        checkIfAlreadyConnected();
        getTypeUser();
        submitCandidateProfile();
        DownloadPicture();
        getLocation();
        getUser();
        getCandidate();
        logOut();
});

function logOut() {
        $("#sidebar-logout").on("click", (e) => {
                e.preventDefault();
                setCookie("user_token", "", 0)
                document.location.reload(true);
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
                                return;
                        else if (result.type === "recruiter")
                                window.location.pathname = '/recruiter_profile';

                }
        });
}


function addUserView(user, candidate) {
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

function getCandidate() {
        $.ajax({
                type: 'POST',
                url: 'http://jurisgo.petitesaffiches.fr/candidate',
                data: { datas: { "user_token": getCookie("user_token") } },
                dataType: 'json',
                success: function (result) {
                        $.ajax({
                                type: 'POST',
                                url: 'http://jurisgo.petitesaffiches.fr/user',
                                data: { datas: { "user_token": getCookie("user_token") } },
                                dataType: 'json',
                                success: function (resultUser) {
                                        $("#candidate_profile_phone").val(resultUser.user.phone);
                                        $("#candidate_profile_firstname").val(resultUser.user.firstname);
                                        $("#candidate_profile_lastname").val(resultUser.user.lastname);
                                        $("#candidate_profile_picture").attr('src', result.data.photo);
                                        $("#candidate_profile_email").val(result.data.email_alias);
                                        $("#candidate_profile_location").val(result.data.address);
                                        $("#candidate_profile_birthdate").val(result.data.birthday);
                                        $("#candidate_profile_freedom").val(translateDisponibility(result.data.disponibility, false)).trigger("chosen:updated");
                                        $("#candidate_profile_contract").val(result.data.contrat).trigger("chosen:updated");

                                }
                        });
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

function getLocation() {
        $("#candidate_profile_button_location").on("click", (e) => {
                e.preventDefault();
                $("#candidate_profile_button_location").addClass("fa-spin");
                navigator.geolocation.getCurrentPosition((position) => {
                        $("#longitude").text(position.coords.longitude);
                        $("#latitude").text(position.coords.latitude);

                        $.ajax({
                                type: 'GET',
                                url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`,
                                success: function (result) {
                                        $("#candidate_profile_location").val(result.address.house_number + " " + result.address.road + " " + result.address.suburb + " " + result.address.city + " " + result.address.postcode);
                                        $("#candidate_profile_button_location").removeClass("fa-spin");
                                }
                        });
                }, () => { $("#candidate_profile_button_location").removeClass("fa-spin"); });
        });
}

function DownloadPicture() {
        $('#candidate_profile_image_download').change((e) => {
                e.preventDefault();

                var oFReader = new FileReader();
                oFReader.readAsDataURL(document.getElementById("candidate_profile_image_download").files[0]);
                oFReader.onload = function (oFREvent) {
                        $("#candidate_profile_picture").attr('src', oFREvent.target.result);
                };
        });
}

function translateDisponibility(str, french) {
        if (french) {
                switch (str) {
                        case "Immédiatement":
                                return "immediately";
                        case "1 mois":
                                return "one_month";
                        case "2 mois":
                                return "two_months";
                        case "3 mois":
                                return "three_months";
                        case "Ne sais pas":
                                return "unknown";
                }
        } else {
                switch (str) {
                        case "immediately":
                                return "Immédiatement";
                        case "one_month":
                                return "1 mois";
                        case "two_months":
                                return "2 mois";
                        case "three_months":
                                return "3 mois";
                        case "unknown":
                                return "Ne sais pas";
                }
        }
}

function submitCandidateProfile() {
        $("#candidate_profile_button").on("click", (e) => {
                e.preventDefault();
                var data = {
                        user_token: getCookie("user_token"),
                        photo: $("#candidate_profile_picture").attr('src'),
                        firstname: $("#candidate_profile_firstname").val(),
                        lastname: $("#candidate_profile_lastname").val(),
                        email: $("#candidate_profile_email").val(),
                        phone: $("#candidate_profile_phone").val(),
                        disponibility: translateDisponibility($("#candidate_profile_freedom").val(), true),
                        contrat: $("#candidate_profile_contract").val(),
                        birthday: $("#candidate_profile_birthdate").val(),
                        address: $("#candidate_profile_location").val(),
                        city: "",
                        departement: "",
                        status: "active",
                        longitude: $("#longitude").text(),
                        latitude: $("#latitude").text(),
                };
                if (data.firstname === "") {
                        $("#error_candidate_profile_firstname").css("visibility", "visible");
                        return;
                }
                if (data.lastname === "") {
                        $("#error_candidate_profile_lastname").css("visibility", "visible");
                        return;
                }
                if (data.email === "") {
                        $("#error_candidate_profile_email").css("visibility", "visible");
                        return;
                }
                if (data.phone === "") {
                        $("#error_candidate_profile_phone").css("visibility", "visible");
                        return;
                }
                if (data.disponibility === "") {
                        $("#error_candidate_profile_freedom").css("visibility", "visible");
                        return;
                }
                if (data.birthday === "") {
                        $("#error_candidate_profile_birthdate").css("visibility", "visible");
                        return;
                }
                if (data.address === "") {
                        $("#error_candidate_profile_location").css("visibility", "visible");
                        return;
                }
                $.ajax({
                        type: 'GET',
                        url: "https://api-adresse.data.gouv.fr/search/?q=" + $("#candidate_profile_location").val(),
                        success: function (result) {
                                data.longitude = result.features[0].geometry.coordinates[0];
                                data.latitude = result.features[0].geometry.coordinates[1];
                                data.city = result.features[0].properties.city;
                                data.departement = result.features[0].properties.postcode.slice(0, -3);
                                console.log(data);
                                                              
                                $.ajax({
                                        type: 'POST',
                                        url: 'http://jurisgo.petitesaffiches.fr/candidate/edit',
                                        data: { datas: data },
                                        dataType: 'json',
                                        success: function (result) {
                                                console.log(result);
                                        }
                                });
                        }
                });

        });
}
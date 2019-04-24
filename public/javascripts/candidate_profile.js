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
        $("#image-user-sidebar").attr('src', candidate.photo);
        $("#welcome-user").text("Bonjour " + capitalize(user.firstname) + " " + capitalize(user.lastname));
        $("#header-user-name").html('<img src="' + candidate.photo + '" alt="" /><i class="la la-bars"></i>' + capitalize(user.firstname) + " " + capitalize(user.lastname));
        $("#header-user-name-responsive").html('<img src="' + candidate.photo + '" alt="" /><i class="la la-bars"></i>' + capitalize(user.firstname) + " " + capitalize(user.lastname));

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

function submitCandidateProfile() {
        $("#candidate_profile_button").on("click", (e) => {
                e.preventDefault();
                var data = {
                        user_token: getCookie("user_token"),
                        photo: $("#candidate_profile_picture").attr('src'),
                        firstname: $("#candidate_profile_firstname").val(), // TODO ADD CHAMP ON USER DB
                        lastname: $("#candidate_profile_lastname").val(),
                        email: $("#candidate_profile_email").val(),
                        phone: $("#candidate_profile_phone").val(),
                        disponibility: $("#candidate_profile_freedom").val(),
                        birthdate: $("#candidate_profile_birthdate").val().split("-").reverse().join("/"),
                        address: $("#candidate_profile_location").val(), // ADD tags
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
                if (data.birthdate === "") {
                        $("#error_candidate_profile_birthdate").css("visibility", "visible");
                        return;
                }
                if (data.address === "") {
                        $("#error_candidate_profile_location").css("visibility", "visible");
                        return;
                }
                $.ajax({
                        type: 'POST',
                        url: 'http://jurisgo.petitesaffiches.fr/candidate/edit',
                        data: { datas: data },
                        dataType: 'json',
                        success: function (result) {
                                console.log(result);
                        }
                });
        });
}
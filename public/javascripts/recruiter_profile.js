$(document).on('ready', function () {
        checkIfAlreadyConnected();
        getTypeUser();
        submitRecruiterProfile();
        DownloadPicture();
        getLocation();
        getRecruiter();
        getUser();
        logOut();
        removePicture();
});

function checkIfAlreadyConnected() {
        if (getCookie("user_token") === "")
                window.location.pathname = '/login';
}

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
                url: 'https://api.jurisgo.fr/user/type',
                data: { datas: { "user_token": getCookie("user_token") } },
                dataType: 'json',
                success: function (result) {
                        if (result.type === "candidate")
                                window.location.pathname = '/candidate_profile';
                        else if (result.type === "recruiter")
                                return;
                }
        });
}



function addUserView(user, recruiter) {
        $("#sidebar-user-name").text(capitalize(user.firstname) + " " + capitalize(user.lastname));
        if (recruiter.photo !== "") {
                $("#image-user-sidebar").attr('src', recruiter.photo);
                $("#datas_download").hide();
        }
        $("#welcome-user").text("Bonjour " + capitalize(user.firstname) + " " + capitalize(user.lastname));
        $("#header-user-name").html('<img src="' + (recruiter.photo === "" ? "images/default_avatar.png" : recruiter.photo) + '" alt="" /><i class="la la-bars"></i>' + capitalize(user.firstname) + " " + capitalize(user.lastname));
        $("#header-user-name-responsive").html('<img src="' + (recruiter.photo === "" ? "images/default_avatar.png" : recruiter.photo) + '" alt="" /><i class="la la-bars"></i>' + capitalize(user.firstname) + " " + capitalize(user.lastname));
        $("#sidebar-button-resume").remove();
        $("#sidebar-button-interview-candidate").remove();
}

function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function getUser() {
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

function removePicture() {
        $('.upload-img-bar > span i').on('click', function () {
                $('#recruiter_profile_picture').attr('src', 'images/default_avatar.png')
        });
}


function getRecruiter() {
        $.ajax({
                type: 'POST',
                url: 'https://api.jurisgo.fr/recruiter',
                data: { datas: { "user_token": getCookie("user_token") } },
                dataType: 'json',
                success: function (result) {
                        $.ajax({
                                type: 'POST',
                                url: 'https://api.jurisgo.fr/user',
                                data: { datas: { "user_token": getCookie("user_token") } },
                                dataType: 'json',
                                success: function (resultUser) {
                                        $("#recruiter_profile_picture").attr('src', result.data.photo);
                                        $("#recruiter_profile_company").val(result.data.company);
                                        $("#recruiter_profile_fax").val(result.data.fax);
                                        $("#recruiter_profile_size").val(result.data.size);
                                        $("#recruiter_profile_comment").val(result.data.comment);
                                        $("#recruiter_profile_facebook").val(result.data.facebook);
                                        $("#recruiter_profile_linkedin").val(result.data.linkedin);
                                        $("#recruiter_profile_twitter").val(result.data.twitter);
                                        $("#recruiter_profile_phone").val(result.data.phone);
                                        $("#recruiter_profile_mail").val(result.data.email);
                                        $("#recruiter_profile_website").val(result.data.website);
                                        $("#recruiter_profile_location").val(result.data.address);
                                        $("#longitude").text(result.data.longitude);
                                        $("#latitude").text(result.data.latitude);
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
        $("#recruiter_profile_button_location").on("click", (e) => {
                e.preventDefault();
                $("#recruiter_profile_button_location").addClass("fa-spin");
                navigator.geolocation.getCurrentPosition((position) => {
                        $("#longitude").text(position.coords.longitude);
                        $("#latitude").text(position.coords.latitude);

                        $.ajax({
                                type: 'GET',
                                url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`,
                                success: function (result) {
                                        $("#recruiter_profile_location").val(result.address.house_number + " " + result.address.road + " " + result.address.suburb + " " + result.address.city + " " + result.address.postcode);
                                        $("#recruiter_profile_button_location").removeClass("fa-spin");
                                }
                        });
                }, () => { $("#recruiter_profile_button_location").removeClass("fa-spin"); });
        });
}

function DownloadPicture() {
        $('#recruiter_profile_image_download').change((e) => {
                e.preventDefault();

                var oFReader = new FileReader();
                oFReader.readAsDataURL(document.getElementById("recruiter_profile_image_download").files[0]);
                oFReader.onload = function (oFREvent) {
                        $("#recruiter_profile_picture").attr('src', oFREvent.target.result);
                };
        });
}

function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
}

function submitRecruiterProfile() {
        $("#recruiter_profile_button").on("click", (e) => {
                e.preventDefault();
                var data = {
                        user_token: getCookie("user_token"),
                        photo: $("#recruiter_profile_picture").attr('src'),
                        company: $("#recruiter_profile_company").val(),
                        fax: $("#recruiter_profile_fax").val(),
                        size: $("#recruiter_profile_size").val(),
                        comment: $("#recruiter_profile_comment").val(),
                        facebook: $("#recruiter_profile_facebook").val(),
                        linkedin: $("#recruiter_profile_linkedin").val(),
                        twitter: $("#recruiter_profile_twitter").val(),
                        phone: $("#recruiter_profile_phone").val(),
                        email: $("#recruiter_profile_mail").val(),
                        website: $("#recruiter_profile_website").val(),
                        address: $("#recruiter_profile_location").val(),
                        sector: $("#recruiter_profile_sector").val(),
                        status: "active",
                        longitude: $("#longitude").text(),
                        latitude: $("#latitude").text(),
                };

                if (data.company === "") {
                        $("#recruiter_profile_company").css("border", "2px solid #951B3F");
                        return;
                }
                if (!validateEmail(data.email)) {
                        $("#recruiter_profile_mail").css("border", "2px solid #951B3F");
                        return;
                }
                
                Object.keys(data).map(elem => {
                        data[elem] = data[elem].replace(/'/g, "\\'");
                }); 
                $.ajax({
                        type: 'POST',
                        url: 'https://api.jurisgo.fr/recruiter/edit',
                        data: { datas: data },
                        dataType: 'json',
                        success: function (result) {
                                $("#recruiter_profile_button").css("border", "2px solid #5cc417").css("color", "#fff").css("background", "#5cc417");
                        }
                });
        });
}
$(document).on('ready', function () {
        // checkIfAlreadyConnected();
        submitCandidateProfile();
        DownloadPicture();
        getLocation();

});

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
        if (getCookie("user_token") !== "")
                window.location.pathname = '/home';
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
                navigator.geolocation.getCurrentPosition( (position)=> {
                        $.ajax({
                                type: 'GET',
                                url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`,
                                success: function (result) {
                                        console.log(result.display_name)
                                        $("#candidate_profile_location").val(result.display_name);
                                        $("#candidate_profile_button_location").removeClass("fa-spin");
                                }
                        });
                }, () => {$("#candidate_profile_button_location").removeClass("fa-spin");});
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
                        firstname: $("#candidate_profile_firstname").val(),
                        lastname: $("#candidate_profile_lastname").val(),
                        email: $("#candidate_profile_email").val(),
                        phone: $("#candidate_profile_phone").val(),
                        freedom: $("#candidate_profile_freedom").val(),
                        birthdate: $("#candidate_profile_birthdate").val(),
                        location: $("#candidate_profile_location").val() // ADD tags
                };
                console.log(data);
                if (data.firstname === "")
                        $("#error_candidate_profile_firstname").css("visibility", "visible");
                if (data.lastname === "")
                        $("#error_candidate_profile_lastname").css("visibility", "visible");
                if (data.email === "")
                        $("#error_candidate_profile_email").css("visibility", "visible");
                if (data.phone === "")
                        $("#error_candidate_profile_phone").css("visibility", "visible");
                if (data.freedom === "")
                        $("#error_candidate_profile_freedom").css("visibility", "visible");
                if (data.birthdate === "")
                        $("#error_candidate_profile_birthdate").css("visibility", "visible");
                if (data.location === "")
                        $("#error_candidate_profile_location").css("visibility", "visible");
                // if (data.tags === "")
                //         $("#error_candidate_profile_tags").css("visibility", "visible");


        });
}
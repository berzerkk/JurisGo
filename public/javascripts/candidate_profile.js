$(document).on('ready', function () {
        submitCandidateProfile();
        DownloadPicture();

});

function DownloadPicture() {
        $('#candidate_profile_image_download').change((e) => {
                e.preventDefault();
                console.log("abc");

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
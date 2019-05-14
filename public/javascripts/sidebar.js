$("#candidate_profile_button").on("click", (e) => {
    e.preventDefault();
    setCookie("user_token", "", 0)    
    document.location.reload(true);
});

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

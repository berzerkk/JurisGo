$(document).on('ready', function () {
        checkIfAlreadyConnected();
        $('#error_connexion').hide();
        submitButtonRegister();
        sumbitButtonConnexion();
        $("#button_connexion_to_register").on("click", (e) => {
                e.preventDefault();
                window.location.pathname = '/register';
        });
        $("#button_register_to_connexion").on("click", (e) => {
                e.preventDefault();
                window.location.pathname = '/login';
        });
});

function submitButtonRegister() {
        $("#button_create_account").on("click", (e) => {
                e.preventDefault();
                var data = {
                        firstname: $("#firstname_create_account").val(),
                        lastname: $("#lastname_create_account").val(),
                        phone: $("#phone_create_account").val(),
                        email: $("#mail_create_account").val(),
                        password: $("#password_create_account").val(),
                        genre: $("#genre_create_account").val(),
                        type: $("#candidates_create_account").hasClass("active") ? "candidate"
                                : $("#employer_create_account").hasClass("active") ? "employer" : ""
                }
                if (data.type === "") {
                        $("#error_connexion").show();
                        return;
                }
                $.ajax({
                        type: 'POST',
                        url: 'http://jurisgo.petitesaffiches.fr/user/add',
                        data: { datas: data },
                        dataType: 'json',
                        success: function (result) {
                                if (res.status) {
                                        window.location.pathname = '/login'
                                } else {
                                        $('#error_connexion').show();
                                }
                        }
                });
        });
}

function sumbitButtonConnexion() {
        $("#button_connexion").on("click", (e) => {
                e.preventDefault();
                var data = {
                        email: $("#mail_connexion").val(),
                        password: $("#password_connexion").val(),
                        player_id: "123456789"
                }
                // todo parse
                $.ajax({
                        type: 'POST',
                        url: 'http://jurisgo.petitesaffiches.fr/user/authentification',
                        data: { datas: data },
                        dataType: 'json',
                        success: function (res) {
                                if (res.status) {
                                        setCookie("user_token", res.token, 250);
                                        window.location.pathname = '/home'
                                } else {
                                        $('#error_connexion').show();
                                }
                        }
                });
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
        if (getCookie("user_token") !== "")
                window.location.pathname = '/home';
}

function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

$(document).on('ready', function () {
        checkIfAlreadyConnected();
        $('#account-popup-area').css('visibility', 'visible');
        $('#error_connexion').hide();
        seePassword();
        sumbitButtonConnexion();
        var exist = checkExistOauth();
        submitButtonRegister(exist);
        linkedin();
        facebook();
        $("#button_connexion_to_register").on("click", (e) => {
                e.preventDefault();
                window.location.pathname = '/register';
        });
        $("#button_register_to_connexion").on("click", (e) => {
                e.preventDefault();
                window.location.pathname = '/login';
        });
});

function facebook() {
        $("#facebook-login").on('click', (e) => {
                e.preventDefault();
                popup = window.open('https://www.facebook.com/v3.3/dialog/oauth?client_id=657425804702385&redirect_uri=http://localhost:3000/callback_facebook&state=DCEeFWf45A53sdfKef424', 'Jursigo - Facebook', 'height=800,width=1200');
                popup.onunload = () => { window.location.pathname = '/register'; };
        });
}

function seePassword() {
        $("#see-password").on("click", (e) => {
                e.preventDefault();          
                $("#password_connexion").attr('type') === "text" ? $("#see-password").removeClass("la-eye").addClass("la-eye-slash") : $("#see-password").removeClass("la-eye-slash").addClass("la-eye");
                $("#password_connexion").attr('type') === "text" ? $("#password_connexion").attr("type", "password") : $("#password_connexion").attr("type", "text");
        });
}

function checkExistOauth() {
        if (window.location.pathname === '/register' && getCookie('exist') !== "") {
                $('#button_register_to_connexion').hide();
                setCookie('exist', '', 1);
                if (getCookie('firstname') != "")
                        $('#firstname_create_account').val(getCookie('firstname'));
                if (getCookie('lastname') != "")
                        $('#lastname_create_account').val(getCookie('lastname'));
                if (getCookie('email') != "undefined")
                        $('#mail_create_account').val(getCookie('email'));
                if (getCookie('gender') != "undefined")
                        console.log('gender');
                if (getCookie('birthday') != "undefined")
                        console.log('birthday')
                return true;
        }
        return false;
}

function linkedin() {
        $('#linkedin-login').on('click', (e) => {

                e.preventDefault();
                popup = window.open('https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86nhbra0gwjcrb&redirect_uri=http://localhost:3000/callback_linkedin&state=DCEeFWf45A53sdfKef424&scope=r_liteprofile%20r_emailaddress', 'Jursigo - Linkedin', 'height=800,width=1200');
                popup.onunload = () => { window.location.pathname = '/register'; };

        });
}

function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
}

function submitButtonRegister(exist) {
        let error = false;
        $("#button_create_account").on("click", (e) => {
                e.preventDefault();
                var data = {
                        firstname: $("#firstname_create_account").val(),
                        lastname: $("#lastname_create_account").val(),
                        phone: $("#phone_create_account").val(),
                        email: $("#mail_create_account").val(),
                        password: $("#password_create_account").val(),
                        genre: $("#genre_create_account").val(),
                        type: $("#candidate_create_account").hasClass("active") ? "candidate"
                                : $("#employer_create_account").hasClass("active") ? "recruiter" : ""
                }
                if (data.firstname === "") {
                        $("#firstname_create_account").parent().css("border", "2px solid #951B3F");
                        error = true;
                }
                if (data.lastname === "") {
                        $("#lastname_create_account").parent().css("border", "2px solid #951B3F");
                        error = true;
                }
                if (data.phone === "") {
                        $("#phone_create_account").parent().css("border", "2px solid #951B3F");
                        error = true;
                }
                if (data.email === "" || !validateEmail(data.email)) {
                        $("#mail_create_account").parent().css("border", "2px solid #951B3F");
                        error = true;
                }
                if (data.password === "") {
                        $("#password_create_account").parent().css("border", "2px solid #951B3F");
                        error = true;
                }
                if ($("#password_create_account").val() === "" || $("#password_create_account").val() != data.password) {
                        $("#password_create_account").parent().css("border", "2px solid #951B3F");
                        error = true;
                }
                if (data.type === "") {
                        $("#candidate_create_account").css("border", "2px solid #951B3F");
                        $("#employer_create_account").css("border", "2px solid #951B3F");
                        error = true;
                }
                if (error)
                        return;
                if (exist && getCookie('type') == 'linkedin') {
                        data.photo = getCookie('picture');
                        data.linkedin_id = getCookie('linkedin_id');
                        console.log(data);
                        $.ajax({
                                type: 'POST',
                                url: 'http://jurisgo.petitesaffiches.fr/user/add/linkedin',
                                data: { datas: data },
                                dataType: 'json',
                                success: function (result) {
                                        console.log(result);
                                        if (result.status) {
                                                setCookie("user_token", result.token, 250);
                                                window.location.pathname = '/candidate_profile'
                                        } else {
                                                $('#error_connexion').show();
                                        }
                                }
                        });
                } else if (exist && getCookie('type') == 'facebook') {
                        data.photo = getCookie('picture');
                        data.facebook_id = getCookie('facebook_id');
                        $.ajax({
                                type: 'POST',
                                url: 'http://jurisgo.petitesaffiches.fr/user/add/facebook',
                                data: { datas: data },
                                dataType: 'json',
                                success: function (result) {
                                        console.log(result);
                                        if (result.status) {
                                                setCookie("user_token", result.token, 250);
                                                window.location.pathname = '/candidate_profile'
                                        } else {
                                                $('#error_connexion').show();
                                        }
                                }
                        });
                } else {
                        $.ajax({
                                type: 'POST',
                                url: 'http://jurisgo.petitesaffiches.fr/user/add',
                                data: { datas: data },
                                dataType: 'json',
                                success: function (result) {
                                        console.log(result);
                                        if (result.status) {
                                                window.location.pathname = '/login'
                                        } else {
                                                $('#error_connexion').show();
                                        }
                                }
                        });
                }
        });
}



function sumbitButtonConnexion() {
        $("#button_connexion").on("click", (e) => {
                let error = false;
                e.preventDefault();
                var data = {
                        email: $("#mail_connexion").val(),
                        password: $("#password_connexion").val(),
                        player_id: "123456789"
                }
                if (data.email === "") {
                        $("#mail_connexion").parent().css("border", "2px solid #951B3F");
                        error = true;
                }
                if (data.password === "") {
                        $("#password_connexion").parent().css("border", "2px solid #951B3F");
                        error = true;
                }
                if (error)
                        return;
                $.ajax({
                        type: 'POST',
                        url: 'http://jurisgo.petitesaffiches.fr/user/authentification',
                        data: { datas: data },
                        dataType: 'json',
                        success: function (res) {
                                if (res.status) {
                                        setCookie("user_token", res.token, 250);
                                        window.location.pathname = '/candidate_profile'
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

function getCookieWindows(cname, win) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(win.document.cookie);
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
                window.location.pathname = '/candidate_profile';
}

function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

$(document).on('ready', function () {
    checkIfAlreadyConnected();
    getTypeUser();
    logOut();
    confirmPurchase();
});


function saveToken(token, next) {
    $.ajax({
        type: 'POST',
        url: 'http://jurisgo.petitesaffiches.fr/recruiter/stripe/add',
        data: { datas: { "user_token": getCookie("user_token"), token: token } },
        dataType: 'json',
        success: function (res) {
            next(res);
        }
    });
}

function getStripe(next) {
    $.ajax({
        type: 'POST',
        url: 'http://jurisgo.petitesaffiches.fr/recruiter/stripe',
        data: { datas: { "user_token": getCookie("user_token") } },
        dataType: 'json',
        success: function (res) {
            next(res)
        }
    });
}

function stripeOne() {
    var checkoutHandler = StripeCheckout.configure({
        key: "pk_test_rr8V8bmaiRdC5hniaw7Dtw6V00WRZTq1F1",
        locale: "auto"
    });
    getStripe((recruiterStripe) => {
        if (recruiterStripe.count >= 1) {
            let token = {
                customer: recruiterStripe.data.token,
                amount: 999,
                description: "01 profil"
            }
            $.ajax({
                type: 'POST',
                url: '/charge',
                data: token,
                dataType: 'json',
                success: function (res) {
                    if (res.status === "succeeded") {
                        saveToken(res.customer, (result) => {
                            // VIEW DE BRAVO 
                        });
                    }
                }
            });
        } else {
            checkoutHandler.open({
                name: "01 profils",
                description: "Example",
                token: (token) => {
                    token.amount = 999;
                    token.description = "01 profil";
                    $.ajax({
                        type: 'POST',
                        url: '/charge_new',
                        data: token,
                        dataType: 'json',
                        success: function (res) {
                            console.log(res);
                            if (res.status === "succeeded") {
                                saveToken(res.customer, (result) => {
                                    console.log(result);
                                });
                            }
                        }
                    });
                }
            });
        }
    });
}

function stripeFive() {
    var checkoutHandler = StripeCheckout.configure({
        key: "pk_test_rr8V8bmaiRdC5hniaw7Dtw6V00WRZTq1F1",
        locale: "auto"
    });
    getStripe((recruiterStripe) => {
        if (recruiterStripe.count >= 1) {
            let token = {
                customer: recruiterStripe.data.token,
                amount: 5999,
                description: "5 profils"
            }
            $.ajax({
                type: 'POST',
                url: '/charge',
                data: token,
                dataType: 'json',
                success: function (res) {
                    if (res.status === "succeeded") {
                        saveToken(res.customer, (result) => {
                            // VIEW DE BRAVO 
                        });
                    }
                }
            });
        } else {
            checkoutHandler.open({
                name: "5 profils",
                description: "Example",
                token: (token) => {
                    token.amount = 5999;
                    token.description = "5 profils";
                    $.ajax({
                        type: 'POST',
                        url: '/charge_new',
                        data: token,
                        dataType: 'json',
                        success: function (res) {
                            console.log(res);
                            if (res.status === "succeeded") {
                                saveToken(res.customer, (result) => {
                                    console.log(result);
                                });
                            }
                        }
                    });
                }
            });
        }
    });
}

function stripeTen() {
    var checkoutHandler = StripeCheckout.configure({
        key: "pk_test_rr8V8bmaiRdC5hniaw7Dtw6V00WRZTq1F1",
        locale: "auto"
    });
    getStripe((recruiterStripe) => {
        if (recruiterStripe.count >= 1) {
            let token = {
                customer: recruiterStripe.data.token,
                amount: 9999,
                description: "10 profils"
            }
            $.ajax({
                type: 'POST',
                url: '/charge',
                data: token,
                dataType: 'json',
                success: function (res) {
                    if (res.status === "succeeded") {
                        saveToken(res.customer, (result) => {
                            // VIEW DE BRAVO 
                        });
                    }
                }
            });
        } else {
            checkoutHandler.open({
                name: "10 profils",
                description: "Example",
                token: (token) => {
                    token.amount = 9999;
                    token.description = "10 profils";
                    $.ajax({
                        type: 'POST',
                        url: '/charge_new',
                        data: token,
                        dataType: 'json',
                        success: function (res) {
                            console.log(res);
                            if (res.status === "succeeded") {
                                saveToken(res.customer, (result) => {
                                    console.log(result);
                                });
                            }
                        }
                    });
                }
            });
        }
    });
}

function logOut() {
    $("#sidebar-logout").on("click", (e) => {
        e.preventDefault();
        setCookie("user_token", "", 0)
        document.location.reload(true);
    });
}


function confirmPurchase() {
    $("#pricing-button-one-offer").on("click", (e) => {
        e.preventDefault();
        $("#popup-purchase").html('<h3 style="line-height:40px;">Voulez-vous acheter 01 profil pour 9.99€ ?</h3>\
        <div class="resumeadd-form">\
            <div class="row align-items-end">\
                <div class="row">\
                    <div class="col-lg-6">\
                        <button id="popup-confirm-purchase" type="submit">Confirmer</button>\
                    </div>\
                    <div class="col-lg-6">\
                        <button id="popup-cancel-purchase" type="submit">Annuler</button>\
                    </div>\
                </div>\
            </div>\
        </div>');
        $("#overlay-confirm-purchase").css("visibility", "visible");
        $("#popup-confirm-purchase").unbind().on("click", (e) => {
            e.preventDefault();
            stripeOne();
        });
        $("#popup-cancel-purchase").unbind().on("click", (e) => {
            e.preventDefault();
            $("#overlay-confirm-purchase").css("visibility", "hidden");
        })
    });
    $("#pricing-button-two-offer").on("click", (e) => {
        e.preventDefault();
        $("#popup-purchase").html('<h3 style="line-height:40px;">Voulez-vous acheter 05 profils pour 59.99€ ?</h3>\
        <div class="resumeadd-form">\
            <div class="row align-items-end">\
                <div class="row">\
                    <div class="col-lg-6">\
                        <button id="popup-confirm-purchase" type="submit">Confirmer</button>\
                    </div>\
                    <div class="col-lg-6">\
                        <button id="popup-cancel-purchase" type="submit">Annuler</button>\
                    </div>\
                </div>\
            </div>\
        </div>');
        $("#overlay-confirm-purchase").css("visibility", "visible");
        $("#popup-confirm-purchase").unbind().on("click", (e) => {
            e.preventDefault();
            stripeFive();
        });
        $("#popup-cancel-purchase").unbind().on("click", (e) => {
            e.preventDefault();
            $("#overlay-confirm-purchase").css("visibility", "hidden");
        })
    });
    $("#pricing-button-three-offer").on("click", (e) => {
        e.preventDefault();
        $("#popup-purchase").html('<h3 style="line-height:40px;">Voulez-vous acheter 10 profilS pour 99.99€ ?</h3>\
        <div class="resumeadd-form">\
            <div class="row align-items-end">\
                <div class="row">\
                    <div class="col-lg-6">\
                        <button id="popup-confirm-purchase" type="submit">Confirmer</button>\
                    </div>\
                    <div class="col-lg-6">\
                        <button id="popup-cancel-purchase" type="submit">Annuler</button>\
                    </div>\
                </div>\
            </div>\
        </div>');
        $("#overlay-confirm-purchase").css("visibility", "visible");
        $("#popup-confirm-purchase").unbind().on("click", (e) => {
            e.preventDefault();
            stripeTen();
        });
        $("#popup-cancel-purchase").unbind().on("click", (e) => {
            e.preventDefault();
            $("#overlay-confirm-purchase").css("visibility", "hidden");
        })
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
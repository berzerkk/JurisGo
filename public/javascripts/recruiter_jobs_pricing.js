$(document).on('ready', function () {
    checkIfAlreadyConnected();
    getTypeUser();
    logOut();
    confirmPurchase();
    window.addEventListener('popstate', function () {
        console.log('jej');
    });
    getPoints();
    getCurrentPoints();
});

function getCurrentPoints() {
    $.ajax({
        type: 'POST',
        url: 'https://api.jurisgo.fr/recruiter',
        data: { datas: { "user_token": getCookie("user_token") } },
        dataType: 'json',
        success: function (result) {
            $('#pricing-recruiter').append(result.data.profile_point >= 10000 ? ' (illimités)' : ' (' + result.data.profile_point + ')');
        }
    });
}

function getPoints() {
    $.ajax({
        type: 'POST',
        url: 'https://api.jurisgo.fr/recruiter',
        data: { datas: { "user_token": getCookie("user_token") } },
        dataType: 'json',
        success: function (result) {
            $('#heading-offers').append('<div style:padding-top:20px;> Vous avez actuellement un solde de ' +
                (result.data.profile_point >= 10000 ? 'crédits illimités.' : result.data.profile_point + 'crédits.') +
                '</div>');
        }
    });
}

function saveToken(token, next) {
    $.ajax({
        type: 'POST',
        url: 'https://api.jurisgo.fr/recruiter/stripe/add',
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
        url: 'https://api.jurisgo.fr/recruiter/stripe',
        data: { datas: { "user_token": getCookie("user_token") } },
        dataType: 'json',
        success: function (res) {
            next(res)
        }
    });
}


function stripeOne() {
    $("#purchase-load").css('display', 'block')
    var checkoutHandler = StripeCheckout.configure({
        key: "pk_test_rr8V8bmaiRdC5hniaw7Dtw6V00WRZTq1F1",
        locale: "auto"
    });
    getStripe((recruiterStripe) => {
        if (recruiterStripe.count >= 1) {
            let token = {
                customer: recruiterStripe.data.token,
                amount: 4999,
                description: "05 profils",
                user_token: getCookie("user_token")
            }
            $.ajax({
                type: 'POST',
                url: '/charge',
                data: token,
                dataType: 'json',
                success: function (res) {
                    if (res.status === "succeeded") {
                        $("#purchase-load").attr('src', 'images/curved-check.png');
                        setTimeout(() => { $("#overlay-confirm-purchase").css("visibility", "hidden"); }, 1000);
                    }
                }
            });
        } else {
            checkoutHandler.open({
                name: "Juris'Go",
                description: "05 profils",
                token: (token) => {
                    token.amount = 4999;
                    token.description = "05 profils";
                    token.user_token = getCookie("user_token");
                    $.ajax({
                        type: 'POST',
                        url: '/charge_new',
                        data: token,
                        dataType: 'json',
                        success: function (res) {
                            console.log(res);
                            if (res.status === "succeeded") {
                                saveToken(res.customer, (result) => {
                                    $("#purchase-load").attr('src', 'images/curved-check.png');
                                    setTimeout(() => { $("#overlay-confirm-purchase").css("visibility", "hidden"); }, 1000);
                                });
                            }
                        }
                    });
                }, closed: () => { $("#overlay-confirm-purchase").css("visibility", "hidden"); }
            });
        }
    });
}

function stripeFive() {
    $("#purchase-load").css('display', 'block')
    var checkoutHandler = StripeCheckout.configure({
        key: "pk_test_rr8V8bmaiRdC5hniaw7Dtw6V00WRZTq1F1",
        locale: "auto"
    });
    getStripe((recruiterStripe) => {
        if (recruiterStripe.count >= 1) {
            let token = {
                customer: recruiterStripe.data.token,
                amount: 9999,
                description: "10 profils",
                user_token: getCookie("user_token")
            }
            $.ajax({
                type: 'POST',
                url: '/charge',
                data: token,
                dataType: 'json',
                success: function (res) {
                    if (res.status === "succeeded") {
                        $("#purchase-load").attr('src', 'images/curved-check.png');
                        setTimeout(() => { $("#overlay-confirm-purchase").css("visibility", "hidden"); }, 1000);
                    }
                }
            });
        } else {
            checkoutHandler.open({
                name: "Juris'Go",
                description: "10 profils",
                token: (token) => {
                    token.amount = 9999;
                    token.description = "10 profils";
                    token.user_token = getCookie("user_token");
                    $.ajax({
                        type: 'POST',
                        url: '/charge_new',
                        data: token,
                        dataType: 'json',
                        success: function (res) {
                            console.log(res);
                            if (res.status === "succeeded") {
                                saveToken(res.customer, (result) => {
                                    $("#purchase-load").attr('src', 'images/curved-check.png');
                                    setTimeout(() => { $("#overlay-confirm-purchase").css("visibility", "hidden"); }, 1000);
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
    $("#purchase-load").css('display', 'block')
    var checkoutHandler = StripeCheckout.configure({
        key: "pk_test_rr8V8bmaiRdC5hniaw7Dtw6V00WRZTq1F1",
        locale: "auto"
    });
    getStripe((recruiterStripe) => {
        if (recruiterStripe.count >= 1) {
            let token = {
                customer: recruiterStripe.data.token,
                amount: 29999,
                description: "profils illimités",
                user_token: getCookie("user_token")
            }
            $.ajax({
                type: 'POST',
                url: '/charge',
                data: token,
                dataType: 'json',
                success: function (res) {
                    if (res.status === "succeeded") {
                        $("#purchase-load").attr('src', 'images/curved-check.png');
                        setTimeout(() => { $("#overlay-confirm-purchase").css("visibility", "hidden"); }, 1000);
                    }
                }
            });
        } else {
            checkoutHandler.open({
                name: "Juris'Go",
                description: "profils illimités",
                token: (token) => {
                    token.amount = 29999;
                    token.description = "profils illimités";
                    token.user_token = getCookie("user_token");
                    $.ajax({
                        type: 'POST',
                        url: '/charge_new',
                        data: token,
                        dataType: 'json',
                        success: function (res) {
                            console.log(res);
                            if (res.status === "succeeded") {
                                saveToken(res.customer, (result) => {
                                    $("#purchase-load").attr('src', 'images/curved-check.png');
                                    setTimeout(() => { $("#overlay-confirm-purchase").css("visibility", "hidden"); }, 1000);
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
        $("#popup-purchase").html('<h3 style="line-height:40px;">Voulez vous confirmer le paiement de 49.99€ euros ?</h3>\
        <img id="purchase-load" class="loading-purchase" src="images/ajax-loader.gif" alt="" />\
        <div class="resumeadd-form">\
            <div class="row align-items-end">\
                <div class="container">\
                    <div class="col-lg-12">\
                        <button style="float:left; padding:12px 21px;"id="popup-confirm-purchase" type="submit">Confirmer</button>\
                        <button style="float:right; padding:12px 21px;"id="popup-cancel-purchase" type="submit">Annuler</button>\
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
        $("#popup-purchase").html('<h3 style="line-height:40px;">Voulez vous confirmer le paiement de 99.99€ euros ?</h3>\
        <img id="purchase-load" class="loading-purchase" src="images/ajax-loader.gif" alt="" />\
        <div class="resumeadd-form">\
            <div class="row align-items-end">\
            <div class="container">\
            <div class="col-lg-12">\
                        <button style="float:left; padding:12px 21px;"id="popup-confirm-purchase" type="submit">Confirmer</button>\
                        <button style="float:right; padding:12px 21px;"id="popup-cancel-purchase" type="submit">Annuler</button>\
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
        $("#popup-purchase").html('<h3 style="line-height:40px;">Voulez vous confirmer le paiement de 299.99€ euros ?</h3>\
        <img class="loading-purchase" id="purchase-load" src="images/ajax-loader.gif" alt="" />\
        <div class="resumeadd-form">\
            <div class="row align-items-end">\
                <div class="container">\
                     <div class="col-lg-12">\
                        <button style="float:left; padding:12px 21px;"id="popup-confirm-purchase" type="submit">Confirmer</button>\
                        <button style="float:right; padding:12px 21px;"id="popup-cancel-purchase" type="submit">Annuler</button>\
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
    if (recruiter.photo !== "")
        $("#image-user-sidebar").attr('src', recruiter.photo);
    $("#welcome-user").text("Bonjour " + capitalize(user.firstname) + " " + capitalize(user.lastname));
    $("#header-user-name").html('<img src="' + (recruiter.photo === "" ? "images/default_avatar.png" : recruiter.photo) + '" alt="" /><i class="la la-bars"></i>' + capitalize(user.firstname) + " " + capitalize(user.lastname));
    $("#header-user-name-responsive").html('<img src="' + (recruiter.photo === "" ? "images/default_avatar.png" : recruiter.photo) + '" alt="" /><i class="la la-bars"></i>' + capitalize(user.firstname) + " " + capitalize(user.lastname));
    $("#sidebar-button-resume").remove();
    $("#sidebar-button-interview-candidate").remove();
}

function getTypeUser() {
    $.ajax({
        type: 'POST',
        url: 'https://api.jurisgo.fr/user/type',
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
$(document).on('ready', function () {
    checkIfAlreadyConnected();
    getTypeUser();
    logOut();
    stripe();
});


// function checkIfStripeToken(next) {
//     $.ajax({
//         type: 'POST',
//         url: 'http://jurisgo.petitesaffiches.fr/user/type',
//         data: { datas: { "user_token": getCookie("user_token") } },
//         dataType: 'json',
//         success: function (result) {
//         }
//     });
// }

function stripe() {
    var checkoutHandler = StripeCheckout.configure({
        key: "pk_test_TYooMQauvdEDq54NiTphI7jx",
        locale: "auto"
    });
    $("#pricing-button-one-offer").on("click", function (e) {
        checkoutHandler.open({
            name: "05 profils",
            description: "Example",
            token: handleToken
        });
    });
    $("#pricing-button-two-offer").on("click", function (e) {
        checkoutHandler.open({
            name: "10 profils",
            description: "Example",
            token: handleToken
        });
    });
    $("#pricing-button-three-offer").on("click", function (e) {
        checkoutHandler.open({
            name: "20 profils",
            description: "Example",
            token: handleToken
        });
    });
    $("#pricing-button-four-offer").on("click", function (e) {
        checkoutHandler.open({
            name: "Profils illimités",
            description: "Example",
            token: handleToken
        });
    });
}

function handleToken(token) {
    fetch("/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(token)
    })
        .then(output => {
            if (output.status === "succeeded")
                document.getElementById("shop").innerHTML = "<p>Purchase complete!</p>";
        })
}

function logOut() {
    $("#sidebar-logout").on("click", (e) => {
        e.preventDefault();
        setCookie("user_token", "", 0)
        document.location.reload(true);
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
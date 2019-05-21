$(document).on('ready', function () {
        checkIfAlreadyConnected();
        getTypeUser();
        logOut();
        getMatching();
});

var map;

function detailsCandidate(id) {
        window.location.href = '/recruiter_jobs_view_candidate?id=' + id + "&" + "job=" + new URL(window.location).searchParams.get("id");
}

function getMatching() {
        navigator.geolocation.getCurrentPosition((position) => {
                map = new ol.Map({
                        target: 'mapdiv',
                        layers: [
                                new ol.layer.Tile({
                                        source: new ol.source.OSM(),
                                        crossOrigin: 'anonymous'
                                })
                        ],
                        view: new ol.View({
                                projection: "EPSG:4326",
                                center: [position.coords.longitude, position.coords.latitude],
                                zoom: 15
                        })
                });
                $.ajax({
                        type: 'POST',
                        url: 'http://jurisgo.petitesaffiches.fr/job/candidate/matching',
                        data: { datas: { "user_token": getCookie("user_token"), id: new URL(window.location).searchParams.get("id") } },
                        dataType: 'json',
                        success: function (result) {
                                var data = result.datas;                                
                                for (i in result.datas) {
                                        var container = document.createElement('div');
                                        $("#jobs-view-list").append('<div class="emply-resume-list round">\
                        <div class="emply-resume-thumb">\
                                <img src="'+ data[i].photo + '" alt="" />\
                        </div>\
                        <div class="emply-resume-info">\
                                <h3><a onclick="focusOnMap(' + data[i].longitude + ',' + data[i].latitude + ',\'' + data[i].firstname + '\',\'' + data[i].lastname + '\')">' + data[i].firstname + ' ' + data[i].lastname + '</a></h3>\
                                <p><i class="la la-map-marker"></i>' + data[i].city + ' / ' + data[i].departement + '</p>\
                        </div>\
                        <div class="shortlists">\
                                <a id="' + data[i].user + '" onclick="detailsCandidate(this.id)">Details <i class="la la-plus"></i></a>\
                        </div>\
                </div>');
                                        var popup = new ol.Overlay({
                                                element: container,
                                                autoPan: true,
                                                autoPanAnimation: {
                                                        duration: 250
                                                }
                                        });
                                        var element = document.createElement('div');
                                        element.innerHTML = '<img src="https://cdn.mapmarker.io/api/v1/fa/stack?size=50&color=DC4C3F&icon=fa-microchip&hoffset=1" />'
                                        var marker = new ol.Overlay({
                                                position: [data[i].longitude, data[i].latitude],
                                                positioning: 'top',
                                                element: element,
                                                stopEvent: false,
                                        });
                                        $(element).on('click', function (evt) {
                                                $(container).append('<p style="background-color: white;">' + data[i].firstname + ' ' + data[i].lastname + '</p>');
                                                popup.setPosition([data[i].longitude, data[i].latitude]);
                                                map.addOverlay(popup);
                                        });
                                        map.addOverlay(marker);
                                }
                                $("#jobs-view-list").append('<div class="pagination">\
                        <ul>\
                                <li class="prev"><a href=""><i class="la la-long-arrow-left"></i> Prev</a>\
                                </li>\
                                <li><a href="">1</a></li>\
                                <li class="active"><a href="">2</a></li>\
                                <li><a href="">3</a></li>\
                                <li><span class="delimeter">...</span></li>\
                                <li><a href="">14</a></li>\
                                <li class="next"><a href="">Next <i class="la la-long-arrow-right"></i></a>\
                                </li>\
                        </ul>\
                </div>')
                        },
                        error: function (err) {
                                console.log(err);
                        }
                });
        });
}

function focusOnMap(lon, lat, firstname, lastname) {
        map.setView(new ol.View({
                projection: "EPSG:4326",
                center: [lon, lat],
                zoom: 15
        }));
        var container = document.createElement('div');
        var popup = new ol.Overlay({
                element: container,
                autoPan: true,
                autoPanAnimation: {
                        duration: 250
                }
        });
        $(container).append('<p style="background-color: white;">' + firstname + ' ' + lastname + '</p>');
        popup.setPosition([lon, lat]);
        map.addOverlay(popup);
        window.scrollTo(0, 0);
}


function getJobs() {
        $.ajax({
                type: 'POST',
                url: 'http://jurisgo.petitesaffiches.fr/jobs',
                data: { datas: { "user_token": getCookie("user_token") } },
                dataType: 'json',
                success: function (result) {
                        data = result.datas
                        for (i in result.datas) {
                                $("#recruiters-jobs-list").append('<tr id="recruiter-job-' + data[i].id + '">\
                        <td>\
                                <div class="table-list-title">\
                                        <h3><a>'+ data[i].title + '</a></h3>\
                                        <span><i class="la la-map-marker"></i>'+ data[i].city + ', ' + data[i].departement + '</span>\
                                </div>\
                        </td>\
                        <td>\
                                <span>'+ data[i].date_created + '</span><br />\
                                <span>'+ data[i].date_start + '</span>\
                        </td>\
                        <td>\
                                <span class="status active">'+ data[i].status + '</span>\
                        </td>\
                        <td>\
                                <ul class="action_job">\
                                        <li><span>View Job</span><a><i class="la la-eye" onclick="viewJob(this.id)" id="'+ data[i].id + '"></i></a></li>\
                                        <li><span>Edit</span><a><i class="la la-pencil" onclick="updateJob(this.id)" id="'+ data[i].id + '"></i></a></li>\
                                        <li><span>Delete</span><a><i class="la la-trash-o" onclick="removeJob(this.id)" id="'+ data[i].id + '"></i></a></li>\
                                </ul>\
                        </td>\
                </tr>\
                        ');
                        }
                }
        });
}

function viewJob(job_id) {
        window.location.href = '/recruiter_jobs_view?id=' + job_id;
}

function updateJob(job_id) {
        window.location.href = '/recruiter_jobs_update?id=' + job_id;
}

function removeJob(job_id) {
        $.ajax({
                type: 'POST',
                url: 'http://jurisgo.petitesaffiches.fr/job/delete',
                data: { datas: { "user_token": getCookie("user_token"), id: job_id } },
                dataType: 'json',
                success: function (result) {
                        if (result.status)
                                $("#recruiter-job-" + job_id).remove();
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

function autocomplete() {
        $("#job-add-adress").autocomplete({
                source: function (request, response) {
                        $.ajax({
                                type: 'GET',
                                url: "https://api-adresse.data.gouv.fr/search/?q=" + request.term,
                                success: function (result) {
                                        var data = [];
                                        for (var i = 0; i < result.features.length; i++)
                                                data.push(result.features[i].properties.label)
                                        response(data)
                                }
                        });
                },
                minLength: 5
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
        $("#sidebar-button-interview-candidate").remove();
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

function postJob() {
        $(".job-add-button").on("click", (e) => {
                e.preventDefault();
                var data = {
                        user_token: getCookie("user_token"),
                        title: $("#job-add-title").val(),
                        description: $("#job-add-comment").val(),
                        date_created: formatDate(new Date()),
                        date_start: $("#job-add-date-start").val().split("/").reverse().join("-"),
                        contract: $("#job-add-contract").val(),
                        sector: $("#job-add-sector").val(),
                        status: e.target.id,
                        latitude: "",
                        longitude: "",
                        experience: $("#job-add-experience").val(),
                        skills: "",
                        salary: $("#job-add-salary").val(),
                        city: "",
                        department: "",
                };
                if ($("#job-add-adress").val() === "")
                        return;
                var i = 0
                var stringSkills = ""
                $(".addedTag").each((e) => {
                        stringSkills += (stringSkills === "" ? $("#skill-add-input-" + i).val() : "///" + $("#skill-add-input-" + i).val());
                        i++;
                });
                data.skills = stringSkills;
                $.ajax({
                        type: 'GET',
                        url: "https://api-adresse.data.gouv.fr/search/?q=" + $("#job-add-adress").val(),
                        success: function (result) {
                                data.longitude = result.features[0].geometry.coordinates[0];
                                data.latitude = result.features[0].geometry.coordinates[1];
                                data.city = result.features[0].properties.city;
                                data.department = result.features[0].properties.postcode
                                console.log(data);
                                $.ajax({
                                        type: 'POST',
                                        url: 'http://jurisgo.petitesaffiches.fr/job/add',
                                        data: { datas: data },
                                        dataType: 'json',
                                        success: function (res) {
                                                console.log(res);
                                        },
                                        error: function (err) {
                                                console.log(err);

                                        }
                                });
                        }
                });
        });
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
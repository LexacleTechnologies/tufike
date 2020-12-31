const aid = $('.aid').val();
const admin = 'Tufike Admin';
const freelance = '5f47f9e62dc7b16cb6f33c40';
logOut();
auth();
Waves.init();
$.fn.enterKey = function(fnc) {
    return this.each(function() {
        $(this).keypress(function(ev) {
            var keycode = (ev.keyCode ? ev.keyCode : ev.which);
            if (keycode == '13') {
                fnc.call(this, ev);
            }
        })
    })
}
var $el = $('.sidebar-wrapper');
var item = $('.sidebar-wrapper .nav .active')[0];
if (item) {
    var activeItemOffsetTop = item.offsetTop;
    if (activeItemOffsetTop > 200) $el.animate({
        scrollTop: activeItemOffsetTop
    }, 500);
}
$('.dcronfs, .dcrondb, .dcronpn').bootstrapMaterialDatePicker({
    format: 'HH:mm',
    clearButton: false,
    date: false,
    autoclose: true,
});
socket.on('connected users', function(count) {
    if (count < 2) {
        $('.count-connect').html('<b class="text-warning">' + count + '</b> Online User');
    } else {
        $('.count-connect').html('<b class="text-warning">' + count + '</b> Online Users');
    }
})
socket.emit('tufike pamoja', aid);
socket.emit('check disk space', admin);
socket.on('check disk space', function(response) {
    socket.off('check disk space')
    var totalGB = (response.size / (1e+9)).toFixed(1);
    var freeGB = (response.free / (1e+9)).toFixed(1);
    var usedGB = totalGB - freeGB;
    $('.free-gb').html('<b class="text-success">' + freeGB + 'GB</b> free of <b class="text-warning">' + totalGB + 'GB</b>');
})
socket.on('initiate distress alert', function(response) {
    var sound = 'distress';
    var superSound = setInterval(function() {
        playNotificationSound(sound);
    }, 3000)
    Swal.fire({
        title: '<h4 class="lexacle-bold">Distress Alert Initiated</h4>',
        icon: 'warning',
        html: `Distress Alert has been initiated by Tufike ${response.initiator}`,
        scrollbarPadding: false,
        confirmButtonText: 'Intercept',
        cancelButtonText: 'False Alert',
        reverseButtons: true,
        showCancelButton: false,
        customClass: {
            confirmButton: 'btn btn-success waves-effect',
            cancelButton: 'btn btn-danger pull-left-swal waves-effect'
        },
        buttonsStyling: false
    }).then((result) => {
        if (result.value) {
            ////// Block Account Reload Data
            clearInterval(superSound);
            setTimeout(function() {
                window.location.href = '/distress';
            }, 1000)
        }

    })
})
socket.on('notify admin', function(response) {
    var message = JSON.parse(response);
    var from = 'top';
    var align = 'right';
    var type = message.color;
    var icon = message.icon;
    var content = message.content;
    var sound = message.sound;
    var time = 3000;
    playNotificationSound(sound);
    md.showNotification(from, align, type, icon, content, time);
    support();
})

socket.on('new vehicle registered', function(response) {
    var message = JSON.parse(response);
    var from = 'top';
    var align = 'right';
    var type = message.color;
    var icon = message.icon;
    var content = message.content;
    var sound = message.sound;
    var time = 10000;
    playNotificationSound(sound);
    md.showNotification(from, align, type, icon, content, time);
    vehicle();
})
socket.on('new rider registered', function(response) {
    var message = JSON.parse(response);
    var from = 'top';
    var align = 'right';
    var type = message.color;
    var icon = message.icon;
    var content = message.content;
    var sound = message.sound;
    var time = 10000;
    playNotificationSound(sound);
    md.showNotification(from, align, type, icon, content, time);
    riders();
})
socket.on('driver payment received', function(response) {
    recentPayments();
})
socket.on('sms balance', function(res) {
  if(res.istat === 'success'){
    var balance = res.response.UserData.balance;
    $('.sms-balance').html('SMS Balance <b class="text-primary">' + balance + '</b>')
  }else {
    $('.sms-balance').html('SMS API Disconnected')
  }
    })
    ////////////// RIDE STATUS LIVE UPDATES ///////////////
socket.on('relaunch admin rides', function(response) {
        //rides();
    })
    ////////////// RIDE STATUS LIVE UPDATES ///////////////
function dashboard() {
    countRecords();
    fetchCms();
    recentPayments();
    priceChart();
    ridersChart();
    driversChart();
    preferenceChart();

}

function preferenceChart()
{
  var nChart = document.getElementById('preference-canvas').getContext('2d');
  var iChart = new Chart(nChart, {
      type: 'pie',
      data: {
          labels: ['Basic Rides', 'Comfy Rides', 'Lux Rides'],
          datasets: [{
              label: 'Ride Preferences',
              backgroundColor: ['#EF2DBF','#03A622','#E71025'],
              borderColor: 'rgba(255, 255, 255, 0.2)',
              data: [0, 0, 0]
          }]
      }
  });
  socket.on('all cron preferences', function(response) {
    console.log(response)
      var iChartData = [response.basic, response.comfy, response.lux]
      updateChart(iChart, iChartData)
  })
}

function ridersChart()
{
  var nChart = document.getElementById('rider-canvas').getContext('2d');
  var iChart = new Chart(nChart, {
      type: 'bar',
      data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
              label: 'Registered Riders',
              backgroundColor: 'rgba(203, 28, 234, 0.6)',
              borderColor: 'rgba(76, 175, 80, 0.4)',
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }]
      }
  });
  socket.on('all cron riders', function(response) {
    //console.log(response)
      var iChartData = [44, 80, 50, 50, 75, 70, 65, 67, 74, 50, 60, 80]
      updateChart(iChart, iChartData)
  })
}
function driversChart()
{
  var nChart = document.getElementById('driver-canvas').getContext('2d');
  var iChart = new Chart(nChart, {
      type: 'bar',
      data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
              label: 'Registered Drivers',
              backgroundColor: 'rgba(34, 221, 223, 0.6)',
              borderColor: 'rgba(76, 175, 80, 0.4)',
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }]
      }
  });
  socket.on('all cron drivers', function(response) {
    //console.log(response)
      var iChartData = [44, 80, 50, 50, 75, 70, 65, 67, 74, 50, 60, 80]
      updateChart(iChart, iChartData)
  })
}

function priceChart() {
    var priceChart = document.getElementById('price-canvas').getContext('2d');
    var chartPrice = new Chart(priceChart, {
        type: 'line',
        data: {
            labels: ['Min', 'Current', 'Max'],
            datasets: [{
                label: 'Basic Package Price',
                backgroundColor: 'rgba(76, 175, 80, 0.6)',
                borderColor: 'rgba(76, 175, 80, 0.4)',
                data: [34, 36, 50]
            }]
        },
        options: {
            responsive: true,
            title: {
                display: false,
                text: 'Grid Line Settings'
            },
        }
    });
    socket.on('all cron rides', function(response) {
        var priceChartData = [34, 40, 50];
        updateChart(chartPrice, priceChartData)
    })
}

function updateChart(chart, data) {
    chart.config.data.datasets[0].data = data;
    chart.options.title.text = 'new title';
    chart.update();
}

function recentPayments() {
    socket.emit('fetch recent payments', admin);
    socket.on('fetch recent payments', function(response) {
        $('.recent-payments').html('');
        socket.off('fetch recent payments');
        for (var key in response) {
            var tid = response[key]._id;
            var pphoto = `<img width="30" src="${appUrl}/assets/drivers/avatars/${response[key].pdriver.photo}"/>`;
            var pname = response[key].pdriver.firstname + ' ' + response[key].pdriver.lastname;
            var pphone = response[key].pdriver.phone;
            var pplate = response[key].pvehicle.plate;
            var pamount = response[key].amount;
            var pcode = response[key].code;
            var created = timeConverterDate(response[key].created) + ' ' + timeConverterTime(response[key].created);
            var rep = `
                <tr>
                <td>${truncateString(pname,15)}</td>
                <td>${pplate}</td>
                <td>KES. ${pamount}</td>
                <td>${created}</td>
                </tr>`;
            $('.recent-payments').append(rep);
        }
    })
}

function fetchCms() {
    var status = 1;
    socket.emit('fetch cms', status);
    socket.on('fetch cms', function(response) {
        socket.off('fetch cms');
        $('.about-content').html(response.about);
        $('.terms-content').html(response.terms);
        $('.privacy-content').html(response.privacy);
        $('.edit-about').unbind().bind('click', function(e) {
            e.preventDefault();
            $('.cms-title').html('Update About Info');
            $('.cms-editor').val(response.about);
            $('#cms-edit-modal').modal('show');
            $('#cms-edit-modal').on('shown.bs.modal', function(e) {
                $('.cms-editor').focus();
            })
            $('.update-cms').unbind().bind('click', function(e) {
                e.preventDefault();
                var content = $('.cms-editor').val();
                if (content === '') {
                    var from = 'top';
                    var align = 'right';
                    var type = 'danger';
                    var icon = 'edit';
                    var content = 'Please enter the about info content to proceed.';
                    var sound = 'support';
                    var time = 3000;
                    playNotificationSound(sound);
                    md.showNotification(from, align, type, icon, content, time);
                } else {
                    $('.login-preloader').fadeIn();
                    var cms = {
                        id: response._id,
                        content: content,
                        time: Date.now()
                    };
                    socket.emit('update cms about', cms);
                    socket.on('update cms about', function(response) {
                        socket.off('update cms about');
                        fetchCms();
                        $('.login-preloader').fadeOut('slow', function() {
                            $('#cms-edit-modal').modal('hide');
                            var from = 'top';
                            var align = 'right';
                            var type = 'info';
                            var icon = 'check';
                            var content = 'Privacy policy content has been successfully updated.';
                            var sound = 'support';
                            var time = 3000;
                            playNotificationSound('cheerful');
                            md.showNotification(from, align, type, icon, content, time);
                        });
                    })
                }

            })
        })
        $('.edit-terms').unbind().bind('click', function(e) {
            e.preventDefault();
            $('.cms-title').html('Update Terms of use Info');
            $('.cms-editor').val(response.terms);
            $('#cms-edit-modal').modal('show');
            $('#cms-edit-modal').on('shown.bs.modal', function(e) {
                $('.cms-editor').focus();
            })
            $('.update-cms').unbind().bind('click', function(e) {
                e.preventDefault();
                var content = $('.cms-editor').val();
                if (content === '') {
                    var from = 'top';
                    var align = 'right';
                    var type = 'danger';
                    var icon = 'edit';
                    var content = 'Please enter the terms of use info content to proceed.';
                    var sound = 'support';
                    var time = 3000;
                    playNotificationSound(sound);
                    md.showNotification(from, align, type, icon, content, time);
                } else {
                    $('.login-preloader').fadeIn();
                    var cms = {
                        id: response._id,
                        content: content,
                        time: Date.now()
                    };
                    socket.emit('update cms terms', cms);
                    socket.on('update cms terms', function(response) {
                        socket.off('update cms terms');
                        fetchCms();
                        $('.login-preloader').fadeOut('slow', function() {
                            $('#cms-edit-modal').modal('hide');
                            var from = 'top';
                            var align = 'right';
                            var type = 'info';
                            var icon = 'check';
                            var content = 'Privacy policy content has been successfully updated.';
                            var sound = 'support';
                            var time = 3000;
                            playNotificationSound('cheerful');
                            md.showNotification(from, align, type, icon, content, time);
                        });
                    })
                }

            })
        })
        $('.edit-privacy').unbind().bind('click', function(e) {
            e.preventDefault();
            $('.cms-title').html('Update Privacy Policy Info');
            $('.cms-editor').val(response.privacy);
            $('#cms-edit-modal').modal('show');
            $('#cms-edit-modal').on('shown.bs.modal', function(e) {
                $('.cms-editor').focus();
            })
            $('.update-cms').unbind().bind('click', function(e) {
                e.preventDefault();
                var content = $('.cms-editor').val();
                if (content === '') {
                    var from = 'top';
                    var align = 'right';
                    var type = 'danger';
                    var icon = 'edit';
                    var content = 'Please enter the privacy policy content to proceed.';
                    var sound = 'support';
                    var time = 3000;
                    playNotificationSound(sound);
                    md.showNotification(from, align, type, icon, content, time);
                } else {
                    $('.login-preloader').fadeIn();
                    var cms = {
                        id: response._id,
                        content: content,
                        time: Date.now()
                    };
                    socket.emit('update cms privacy', cms);
                    socket.on('update cms privacy', function(response) {
                        socket.off('update cms privacy');
                        fetchCms();
                        $('.login-preloader').fadeOut('slow', function() {
                            $('#cms-edit-modal').modal('hide');
                            var from = 'top';
                            var align = 'right';
                            var type = 'info';
                            var icon = 'check';
                            var content = 'Privacy policy content has been successfully updated.';
                            var sound = 'support';
                            var time = 3000;
                            playNotificationSound('cheerful');
                            md.showNotification(from, align, type, icon, content, time);
                        });
                    })
                }

            })
        })
    })
}

function countRecords() {
    socket.emit('count records', admin);
    socket.on('count records', function(response) {
        socket.off('count records');
        $('.count-rides').html(response.rides)
        $('.count-riders').html(response.riders);
        $('.count-drivers').html(response.drivers);
        $('.count-owners').html(response.owners);
    })
    socket.emit('count other records', admin);
    socket.on('count other records', function(response) {
        socket.off('count other records');
        $('.count-other-rides').html(response.rides);
        $('.count-other-riders').html(response.riders);
        $('.count-other-drivers').html(response.drivers);
        $('.count-other-owners').html(response.owners);
    })

}

function auth() {
    $('.admin-login-button').unbind().bind('click', function(e) {
        e.preventDefault();
        var email = $('.lemail').val();
        var password = $('.lpassword').val();
        if (email === '') {
            $('.lemail').focus();
            var from = 'bottom';
            var align = 'right';
            var type = 'danger';
            var icon = 'report';
            var message = 'Please enter your admin account email address to login.';
            var time = 3000;
            md.showNotification(from, align, type, icon, message, time);
        } else if (password === '') {
            $('.lpassword').focus();
        } else {
            $('.admin-login-button').prop('disabled', true);
            $('.login-preloader').fadeIn();
            var user = {
                email: email,
                password: password
            };
            $.ajax({
                type: 'post',
                url: appUrl + '/auth',
                data: user,
                success: function(response) {
                    var response = JSON.parse(response);
                    $('.admin-login-button').prop('disabled', false);
                    $('.login-preloader').fadeOut();
                    console.log(response)
                    if (response.status === 1) {
                        var from = 'bottom';
                        var align = 'right';
                        var type = 'success';
                        var icon = 'check';
                        var message = 'Successfull logged in. Please hold on. Initializing session...';
                        var time = 3000;
                        md.showNotification(from, align, type, icon, message, time);
                        setTimeout(function() {
                            location.reload(true);
                        }, 3000)
                    } else {
                        var from = 'bottom';
                        var align = 'right';
                        var type = 'danger';
                        var icon = 'report';
                        var message = 'Invalid Email and/ or Password. Please try again.';
                        var time = 3000;
                        md.showNotification(from, align, type, icon, message, time);
                    }
                }
            })
        }
    })
}


function logOut() {
    $('.logout-admin').unbind().bind('click', function(e) {
        e.preventDefault();
        var from = 'top';
        var align = 'right';
        var type = 'success';
        var icon = 'lock';
        var message = 'Securing you account for security purposes. Please hold on.';
        var time = 3000;
        md.showNotification(from, align, type, icon, message, time);
        $.ajax({
            type: 'post',
            url: appUrl + '/logout',
            success: function(response) {
                setTimeout(function() {
                    location.reload(true)
                }, 3000)
            }
        })
    })
}

function riders() {
    NProgress.start();
    $('.refresh-data').css('display', 'none');
    destroyDataTable();
    $('.notify-all-riders').addClass('hidden');
    socket.emit('fetch all riders', admin);
    socket.on('fetch all riders', function(response) {
        socket.off('fetch all riders');
        NProgress.done();
        setTimeout(function() {
            $('.notify-all-riders').removeClass('hidden');
        }, 500)
        $('.refresh-data').css('display', 'block');
        $('.all-riders').html('');
        var i = 1;
        for (var key in response) {
            var id = i++;
            if (response[key].status === 1) {
                var badge = '<span class="badge pink lighten-5 pink-text text-accent-2">Pending</span>';
            } else {
                var badge = '<span class="badge green lighten-5 green-text text-accent-2">Active</span>';
            }
            var name = truncateString(response[key].firstname + ' ' + response[key].lastname, 20);
            var rname = response[key].firstname + ' ' + response[key].lastname;
            var rides = response[key].rides.length;
            var favorites = response[key].favorites.length;
            var actcode = response[key].activationcode;
            var riders = `<tr class="animate__animated animate__fadeIn">
            <td>${id}</td>
            <td><img class="table-icon" src="${cloudUrl}/assets/riders/avatars/${response[key].photo}"></td>
            <td>${name}</td>
            <td>${response[key].phone}</td>
            <td>${truncateString(response[key].email, 20)}</td>\
            <td>${timeConverterDate(response[key].created)}</td>
            <td>${badge}</td>
            <td>${rides}</td>
            <td>${favorites}</td>
            <td>${actcode}</td>
            <td class="text-center">
            <a href="javascript:void(0)" class="locate-rider" data-name="${rname}" data-id="${response[key]._id}"><i class="material-icons col-blue-grey size-20">my_location</i></a>
            <a href="javascript:void(0)" class="notify-rider" data-name="${rname}" data-id="${response[key]._id}"><i class="material-icons col-blue-grey size-20">notifications</i></a>
            </td>
            <td class="td-actions text-right">
            <a href="javascript:void(0)" class="view-rider" data-fav="${favorites}" data-rides="${rides}" data-name="${name}" data-id="${response[key]._id}"><i class="material-icons col-blue-grey">more_vert</i></a>
            </td>
            </tr>`;
            $('.all-riders').append(riders);
        }
        initDataTable();
        $('[rel="tooltip"]').tooltip();
        $('#dtable tbody').on('click', 'tr td .locate-rider', function(e) {
            e.preventDefault();
            NProgress.start();
            var riderid = $(this).data('id');
            socket.emit('fetch single rider', riderid);
            socket.on('fetch single rider', function(response) {
                socket.off('fetch single rider');
                NProgress.done();
                console.log(response)
                $('.rider-name-title').html(response.firstname + ' ' + response.lastname + '\'s Current Location');
                var position = {
                    lat: response.location.coordinates[1],
                    lng: response.location.coordinates[0]
                };
                var map = new google.maps.Map(document.getElementById('map-client-location'), {
                    mapTypeControl: false,
                    center: position,
                    disableDefaultUI: true,
                    zoom: 13,
                    zoomControl: true,
                    scaleControl: true,
                    streetViewControl: true,
                    fullScreenControl: false
                });
                var styles = mapstyles;
                map.setOptions({
                    styles: styles['hide']
                });
                infoWindow = new google.maps.InfoWindow();
                var marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    icon: '/assets/admin/img/icons/street-view.png'
                });

                map.setCenter(position);
                $('#view-client-location-modal').modal('show');
            })
        })
        $('#dtable tbody').on('click', 'tr td .view-rider', function(e) {
            e.preventDefault();
            NProgress.start();
            var riderid = $(this).data('id');
            var favs = $(this).data('fav');
            var rides = $(this).data('rides');
            socket.emit('fetch single rider', riderid);
            socket.on('fetch single rider', function(response) {
                socket.off('fetch single rider');
                NProgress.done();
                $('.user-profile-name').html(response.firstname + ' ' + response.lastname);
                $('.user-profile-email').html(response.email);
                $('.user-profile-phone').html(response.phone);
                $('.user-profile-photo').prop('src', cloudUrl+'/assets/riders/avatars/' + response.photo);
                $('.ride-count').html(rides);
                $('.fav-count').html(favs);
                $('#view-client-details-modal').modal('show');
            })
        })
        $('#dtable tbody').on('click', 'tr td .notify-rider', function(e) {
            e.preventDefault();
            var riderid = $(this).data('id');
            var ridername = $(this).data('name');
            $('#notify-rider-modal').modal('show');
            $('.rider-name-title').html('<i class="material-icons align-middle text-warning">notifications_active</i>  Send Push Notification to ' + ridername);
            $('.send-notification').unbind().bind('click', function(e) {
                e.preventDefault();
                var header = $('.not-header').val();
                var message = $('.not-content').val();
                if (header === '') {
                    $('.not-header').focus();
                    var from = 'top';
                    var align = 'right';
                    var type = 'warning';
                    var icon = 'error';
                    var message = 'Please enter the push notification header in order to proceed';
                    var time = 3000;
                    md.showNotification(from, align, type, icon, message, time);
                } else if (message === '') {
                    $('.not-content').focus();
                    var from = 'top';
                    var align = 'right';
                    var type = 'warning';
                    var icon = 'error';
                    var message = 'Please enter the push notification message in order to proceed';
                    var time = 3000;
                    md.showNotification(from, align, type, icon, message, time);
                } else {
                    NProgress.start();
                    $('.send-notification').prop('disabled', true);
                    $('#notify-rider-modal').modal('hide');
                    var notify = {
                        rid: riderid,
                        header: header,
                        message: message
                    };
                    socket.emit('notify single rider', notify);
                    socket.on('notify single rider', function(response) {
                        socket.off('notify single rider');
                        console.log(response)
                        $('.send-notification').prop('disabled', false);
                        $('.not-header, .not-content').val('');
                        NProgress.done();
                        var from = 'top';
                        var align = 'right';
                        var type = 'success';
                        var icon = 'notifications_active';
                        var message = 'Push notification has been successfully sent to ' + ridername;
                        var time = 5000;
                        md.showNotification(from, align, type, icon, message, time);
                    })
                }
            })
        })
    })
    $('.notify-all-riders').unbind().bind('click', function(e) {
        e.preventDefault();
        $('#notify-rider-modal').modal('show');
        $('.rider-name-title').html('<i class="material-icons align-middle text-warning">notifications_active</i> Send Push Notification to All Riders');
        $('.send-notification').unbind().bind('click', function(e) {
            e.preventDefault();
            var header = $('.not-header').val();
            var message = $('.not-content').val();
            if (header === '') {
                $('.not-header').focus();
                var from = 'top';
                var align = 'right';
                var type = 'warning';
                var icon = 'error';
                var message = 'Please enter the push notification header in order to proceed';
                var time = 3000;
                md.showNotification(from, align, type, icon, message, time);
            } else if (message === '') {
                $('.not-content').focus();
                var from = 'top';
                var align = 'right';
                var type = 'warning';
                var icon = 'error';
                var message = 'Please enter the push notification message in order to proceed';
                var time = 3000;
                md.showNotification(from, align, type, icon, message, time);
            } else {
                NProgress.start();
                $('.send-notification').prop('disabled', true);
                var notify = {
                    rid: freelance,
                    header: header,
                    message: message
                };
                socket.emit('notify all riders', notify);
                socket.on('notify all riders', function(response) {
                    socket.off('notify all riders');
                    $('#notify-rider-modal').modal('hide');
                    $('.send-notification').prop('disabled', false);
                    $('.not-header, .not-content').val('');
                    NProgress.done();
                    var from = 'top';
                    var align = 'right';
                    var type = 'primary';
                    var icon = 'notifications_active';
                    var message = 'Push notification has been successfully sent to ' + response.recipients + ' riders';
                    var time = 5000;
                    md.showNotification(from, align, type, icon, message, time);
                })
            }
        })
    })
    $('.refresh-data').unbind().bind('click', function(e) {
        e.preventDefault();
        riders();
    })

}

function drivers() {
    NProgress.start();
    $('.refresh-data').css('display', 'none');
    $('.notify-all-drivers').addClass('hidden');
    destroyDataTable();
    socket.emit('fetch all drivers', admin);
    socket.on('fetch all drivers', function(response) {
        socket.off('fetch all drivers');
        NProgress.done();
        $('.refresh-data').css('display', 'block');
        setTimeout(function() {
            $('.notify-all-drivers').removeClass('hidden');
        }, 500)
        $('.all-drivers').html('');
        var i = 1;
        for (var key in response) {
            var id = i++;
            var rides = response[key].xrides.length;
            if (response[key].xvehicle.length === 1) {
                var vplate = '<span class="text-succes">' + response[key].xvehicle[0].plate + '</span>';
            } else {
                var vplate = 'NONE';
            }
            if (response[key].status === 1) {
                var blockcolor = 'col-blue-grey';
                var blockclass = 'block-driver';
                var badge = '<span class="badge blue lighten-5 blue-text text-accent-2">Pending</span>';
            } else if (response[key].status === 2) {
                var blockcolor = 'col-blue-grey';
                var blockclass = 'block-driver';
                var badge = '<span class="badge green lighten-5 green-text text-accent-2">Active</span>';
            } else if (response[key].status === 3) {
                var blockcolor = 'col-pink';
                var blockclass = 'unblock-driver';
                var badge = '<span class="badge pink lighten-5 pink-text text-accent-2">Blocked</span>';
            }
            if (response[key].license === 'none' || response[key].license.length < 10) {
                var license = '<span class="badge pink lighten-5 pink-text text-accent-2">DL</span>';
            } else {
                var license = `<span class="badge green lighten-5 dlove green-text text-accent-2"><a href="${cloudUrl}/assets/drivers/documents/license/${response[key].license}">DL</a></span>`;
            }
            if (response[key].ntsa === 'none' || response[key].ntsa.length < 10) {
                var ntsa = '<span class="badge pink lighten-5 pink-text text-accent-2">NTSA</span>';
            } else {
                var ntsa = `<span class="badge green lighten-5 nlove green-text text-accent-2"><a href="${cloudUrl}/assets/drivers/documents/ntsa/${response[key].ntsa}">NTSA</a></span>`;
            }
            var name = truncateString(response[key].firstname + ' ' + response[key].lastname, 15);
            var dname = response[key].firstname + ' ' + response[key].lastname;
            var drvtr = `<tr class="animate__animated animate__fadeIn">
            <td>${id}</td>
            <td><img class="table-icon" src="${cloudUrl}/assets/drivers/avatars/${response[key].photo}"></td>
            <td>${name}</td>
            <td>${response[key].phone}</td>
            <td>${truncateString(response[key].email, 15)}</td>
            <td>${license} ${ntsa}</td>
            <td>${timeConverterDate(response[key].created)} ${timeConverterTime(response[key].created)}</td>
            <td>${badge}</td>
            <td>${vplate}</td>
            <td>${rides}</td>
            <td>${response[key].activationcode}</td>
            <td class="text-center">
            <a href="javascript:void(0)" class="locate-driver" data-name="${dname}" data-id="${response[key]._id}"><i class="material-icons size-20 col-blue-grey">my_location</i></a>
            <a href="javascript:void(0)" class="notify-driver" data-name="${dname}" data-id="${response[key]._id}"><i class="material-icons size-20 col-blue-grey">notifications</i></a>
            <a href="javascript:void(0)" class="${blockclass}" data-name="${dname}" data-id="${response[key]._id}"><i class="material-icons size-20 ${blockcolor}">block</i></a>
            </td>
            <td class="td-actions text-right">
            <a href="javascript:void(0)" class="view-driver" data-id="${response[key]._id}"><i class="material-icons col-blue-grey">more_vert</i></a>
            </td>
            </tr>`;
            $('.all-drivers').append(drvtr);
        }
        $('.dlove, .nlove').lightGallery({
            counter: false
        });
        $('#dtable tbody').on('click', 'tr td .locate-driver', function(e) {
            e.preventDefault();
            NProgress.start();
            var driverid = $(this).data('id');
            socket.emit('fetch single driver', driverid);
            socket.on('fetch single driver', function(response) {
                socket.off('fetch single driver');
                NProgress.done();
                $('.driver-name-title').html(response.firstname + ' ' + response.lastname + '\'s Current Location');
                var position = {
                    lat: response.location.coordinates[1],
                    lng: response.location.coordinates[0]
                };
                var map = new google.maps.Map(document.getElementById('map-driver-location'), {
                    mapTypeControl: false,
                    center: position,
                    disableDefaultUI: true,
                    zoom: 16,
                    zoomControl: true,
                    scaleControl: true,
                    streetViewControl: false,
                    fullScreenControl: false
                });
                infoWindow = new google.maps.InfoWindow();
                var marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    icon: '/assets/admin/img/icons/street-view.png'
                });
                map.setCenter(position);
                $('#view-driver-location-modal').modal('show');
            })
        })
        $('#dtable tbody').on('click', 'tr td .view-driver', function(e) {
            e.preventDefault();
            NProgress.start();
            var riderid = $(this).data('id');
            socket.emit('fetch single driver', riderid);
            socket.on('fetch single driver', function(response) {
                socket.off('fetch single driver');
                NProgress.done();
                console.log(response)
                for (var key in response) {
                    $('.driver-photo').prop('src', cloudUrl + '/assets/drivers/avatars/' + response[key].photo);
                    $('.user-profile-name').html(response[key].firstname + ' ' + response[key].lastname);
                    $('.user-profile-email').html(response[key].email);
                    $('.user-profile-phone').html(response[key].phone);
                    $('.ride-count').html(response[key].xrides.length);
                    if (response[key].xvehicle) {
                        $('.driver-vehicle').html(response[key].xvehicle.plate);
                    } else {
                        $('.driver-vehicle').html('No Vehicle Assigned');
                    }
                    if (response[key].license === 'none' && response[key].ntsa === 'none') {
                        $('.doc-count').html('0');
                        $('.dlntsa').html('<a href="javascript:void(0)" class="pink-link">DL & NTSA not Uploaded</a>');
                    } else if (response[key].license !== 'none' && response[key].ntsa === 'none') {
                        $('.doc-count').html('1');
                        $('.dlntsa').html(`<a data-sub-html="Driving License" href="${cloudUrl}/assets/drivers/documents/license/${response[key].license}" class="pink-link">View Driving License</a>`);
                        $('.dlntsa').lightGallery();
                    } else if (response[key].license === 'none' && response[key].ntsa !== 'none') {
                        $('.doc-count').html('1');
                        $('.dlntsa').html(`<a data-sub-html="NTSA Certificate" href="${cloudUrl}/assets/drivers/documents/ntsa/${response[key].ntsa}" class="pink-link">View NTSA Certificate</a>`);
                        $('.dlntsa').lightGallery();
                    } else if (response[key].license !== 'none' && response[key].ntsa !== 'none') {
                        $('.doc-count').html('2');
                        $('.dlntsa').html(`<a data-sub-html="Driving License" href="${cloudUrl}/assets/drivers/documents/license/${response[key].license}" class="pink-link">
                            <img src="${cloudUrl}/assets/drivers/documents/license/${response[key].license}" class="hidden"/>
                            View DL & NTSA Documents</a>
                            <a data-sub-html="NTSA Certificate" href="${cloudUrl}/assets/drivers/documents/ntsa/${response[key].ntsa}" class="pink-link">
                            <img src="${cloudUrl}/assets/drivers/documents/ntsa/${response[key].ntsa}" class="hidden"/>
                            </a>`);
                        $('.dlntsa').lightGallery({
                            thumbnail: true
                        });
                    }
                    if (response[key].xpackage.length > 0) {
                        $('.package-count').html('1');
                        $('.package-name').html(response[key].xpackage[0].package + ' Ride Package');
                    } else {
                        $('.package-count').html('0');
                        $('.package-name').html('No Package Assigned');
                    }
                    $('#view-driver-details-modal').modal('show');
                }

            })
        })
        $('#dtable tbody').on('click', 'tr td .notify-driver', function(e) {
            e.preventDefault();
            var driverid = $(this).data('id');
            var drivername = $(this).data('name');
            $('#notify-driver-modal').modal('show');
            $('.driver-name-title').html('<i class="material-icons align-middle text-warning">notifications_active</i>  Send Push Notification to ' + drivername);
            $('.send-notification').unbind().bind('click', function(e) {
                e.preventDefault();
                var header = $('.dnot-header').val();
                var message = $('.dnot-content').val();
                if (header === '') {
                    $('.dnot-header').focus();
                    var from = 'top';
                    var align = 'right';
                    var type = 'warning';
                    var icon = 'error';
                    var message = 'Please enter the push notification header in order to proceed';
                    var time = 3000;
                    md.showNotification(from, align, type, icon, message, time);
                } else if (message === '') {
                    $('.dnot-content').focus();
                    var from = 'top';
                    var align = 'right';
                    var type = 'warning';
                    var icon = 'error';
                    var message = 'Please enter the push notification message in order to proceed';
                    var time = 3000;
                    md.showNotification(from, align, type, icon, message, time);
                } else {
                    NProgress.start();
                    $('.send-notification').prop('disabled', true);
                    $('#notify-driver-modal').modal('hide');
                    var notify = {
                        did: driverid,
                        header: header,
                        message: message
                    };
                    socket.emit('notify single driver', notify);
                    socket.on('notify single driver', function(response) {
                        socket.off('notify single driver');
                        $('.send-notification').prop('disabled', false);
                        $('.dnot-header, .dnot-content').val('');
                        NProgress.done();
                        var from = 'top';
                        var align = 'right';
                        var type = 'success';
                        var icon = 'notifications_active';
                        var message = 'Push notification has been successfully sent to ' + drivername;
                        var time = 5000;
                        md.showNotification(from, align, type, icon, message, time);
                    })
                }
            })
        })
        $('#dtable tbody').on('click', 'tr td .block-driver', function(e) {
            e.preventDefault();
            var dname = $(this).data('name');
            var did = $(this).data('id');
            Swal.fire({
                title: '<h4 class="lexacle-bold">Block Driver Account?</h4>',
                icon: 'question',
                html: `Are you sure you want to block ${dname}'s account?`,
                scrollbarPadding: false,
                confirmButtonText: 'Block',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
                showCancelButton: true,
                customClass: {
                    confirmButton: 'btn btn-danger pull-right-swal waves-effect',
                    cancelButton: 'btn btn-success pull-left-swal waves-effect'
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.value) {
                    ////// Block Account Reload Data
                    socket.emit('block driver account', did);
                    socket.on('block driver account', function(response) {
                        socket.off('block driver account');
                        console.log(response)
                        drivers();
                    })
                }

            })
        })
        $('#dtable tbody').on('click', 'tr td .unblock-driver', function(e) {
            e.preventDefault();
            var dname = $(this).data('name');
            var did = $(this).data('id');
            Swal.fire({
                title: '<h4 class="lexacle-bold">Unblock Driver Account?</h4>',
                icon: 'question',
                html: `Unblock ${dname}'s account?`,
                scrollbarPadding: false,
                confirmButtonText: 'Unblock',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
                showCancelButton: true,
                customClass: {
                    confirmButton: 'btn btn-success pull-right-swal waves-effect',
                    cancelButton: 'btn btn-danger pull-left-swal waves-effect'
                },
                buttonsStyling: false
            }).then((result) => {
                console.log(result)
                if (result.value) {
                    ////// Block Account Reload Data
                    socket.emit('unblock driver account', did);
                    socket.on('unblock driver account', function(response) {
                        socket.off('unblock driver account');
                        drivers();
                    })
                }

            })
        })

        initDataTable();
    })
    $('.notify-all-drivers').unbind().bind('click', function(e) {
        e.preventDefault();
        $('#notify-driver-modal').modal('show');
        $('.driver-name-title').html('<i class="material-icons align-middle text-warning">notifications_active</i> Send Push Notification to All Drivers');
        $('.send-notification').unbind().bind('click', function(e) {
            e.preventDefault();
            var header = $('.dnot-header').val();
            var message = $('.dnot-content').val();
            if (header === '') {
                $('.dnot-header').focus();
                var from = 'top';
                var align = 'right';
                var type = 'warning';
                var icon = 'error';
                var message = 'Please enter the push notification header in order to proceed';
                var time = 3000;
                md.showNotification(from, align, type, icon, message, time);
            } else if (message === '') {
                $('.dnot-content').focus();
                var from = 'top';
                var align = 'right';
                var type = 'warning';
                var icon = 'error';
                var message = 'Please enter the push notification message in order to proceed';
                var time = 3000;
                md.showNotification(from, align, type, icon, message, time);
            } else {
                NProgress.start();
                $('.send-notification').prop('disabled', true);
                var notify = {
                    did: freelance,
                    header: header,
                    message: message
                };
                socket.emit('notify all drivers', notify);
                socket.on('notify all drivers', function(response) {
                    socket.off('notify all drivers');
                    $('#notify-driver-modal').modal('hide');
                    $('.send-notification').prop('disabled', false);
                    $('.dnot-header, .dnot-content').val('');
                    NProgress.done();
                    var from = 'top';
                    var align = 'right';
                    var type = 'primary';
                    var icon = 'notifications_active';
                    var message = 'Push notification has been successfully sent to ' + response.recipients + ' drivers';
                    var time = 5000;
                    md.showNotification(from, align, type, icon, message, time);
                })
            }
        })
    })
    $('.refresh-data').unbind().bind('click', function(e) {
        e.preventDefault();
        drivers();
    })

}

function vehicles() {
    NProgress.start();
    $('.refresh-data').css('display', 'none');
    destroyDataTable();
    $('.notify-all-owners').addClass('hidden');
    socket.emit('fetch all vehicles', admin);
    socket.on('fetch all vehicles', function(response) {
        socket.off('fetch all vehicles');
        NProgress.done();
        $('.refresh-data').css('display', 'block');
        setTimeout(function() {
            $('.notify-all-owners').removeClass('hidden');
        }, 500)
        var i = 1;
        for (var key in response) {
            var vid = response[key]._id;
            var frontphoto = response[key].frontphoto;
            var sidephoto = response[key].sidephoto;
            var backphoto = response[key].backphoto;
            var make = response[key].make;
            var model = response[key].model;
            var plate = response[key].plate;
            var color = response[key].color;
            var manufacture = response[key].manufacture;
            var purchase = response[key].purchase;
            var logbook = response[key].logbook;
            var insurance = response[key].insurance;
            var package = response[key].package;
            var activationcode = response[key].activationcode;
            var status = response[key].status;
            if (logbook === 'none' || insurance === 'none' || frontphoto === 'none' || sidephoto === 'none' || backphoto === 'none' || make === 'none' || model === 'none' || plate === 'none' || color === 'none' || manufacture === 'none' || purchase === 'none') {
                var badge = '<span class="badge pink lighten-5 pink-text text-accent-2">Pending</span>';
                var superb = '0';
            } else {
                if (status === 1) {
                    var badge = '<span class="badge blue lighten-5 blue-text text-accent-2">Inactive</span>';
                    var superb = '1';
                } else if (status === 2) {
                    var badge = '<span class="badge green lighten-5 green-text text-accent-2">Active</span>';
                    var superb = '2';
                }

            }
            if (response[key].xdriver.length === 1) {
                var adriver = '<button data-id="' + vid + '" data-pid="' + package + '" class="assign-driver btn btn-sm bg-teal btn-block waves-effect">Assigned</button>';
            } else {
                var adriver = '<button data-id="' + vid + '" data-pid="' + package + '" class="assign-driver btn btn-sm bg-orange waves-effect btn-block">Assign</button>';
            }
            if (package === freelance) {
                var pstatus = `<button data-id="${vid}" data-pub="${superb}" class="assign-package btn btn-sm bg-orange waves-effect btn-block">Assign</button>`;
            } else {
                var pstatus = `<button data-id="${vid}" data-pub="${superb}" class="assign-package btn btn-sm bg-teal waves-effect btn-block">${response[key].xpackage[0].package}</button>`;
            }
            var id = i++;
            var allvehicles = `<tr class="animate__animated animate__fadeIn">
            <td>${id}</td>
            <td><img class="table-icon" src="${cloudUrl}/assets/vehicles/avatars/${response[key].photo}"></td>
            <td>${response[key].firstname} ${response[key].lastname}</td>
            <td><small>${response[key].make}</small></td>
            <td><small>${response[key].model}</small></td>
            <td><small>${response[key].plate}</small></td>
            <td>${response[key].color}</td>
            <td>${adriver}</td>
            <td>${pstatus}</td>
            <td>${badge}</td>
            <td>${timeConverterDate(response[key].created)}</td>
            <td>${activationcode}</td>
            <td class="text-center">
            <a class="notify-owner" href="#" data-id="${response[key]._id}" data-name="${response[key].firstname} ${response[key].lastname}">
            <i class="material-icons col-blue-grey sie-20">notifications</i>
            </a>
            </td>
            <td class="td-actions text-right">
            <a class="more-vehicle" href="#" data-id="${response[key]._id}">
            <i class="material-icons col-blue-grey">more_vert</i>
            </a>
            </td>
            </tr>`;
            $('.all-vehicles').append(allvehicles);
        }

        initDataTable();
        $('#dtable tbody').on('click', 'tr td .assign-driver', function(e) {
            e.preventDefault();
            var vid = $(this).data('id');
            var pid = $(this).data('pid');
            var novehicle = '5f47f9e62dc7b16cb6f33c40';
            if (pid === freelance) {
                var from = 'top';
                var align = 'right';
                var type = 'warning';
                var icon = 'error';
                var message = 'You must assign a ride package first before assigning a driver';
                var time = 3000;
                md.showNotification(from, align, type, icon, message, time);
            } else {
                NProgress.start();
                socket.emit('fetch no vehicle drivers', novehicle)
                socket.on('fetch no vehicle drivers', function(response) {
                    socket.off('fetch no vehicle drivers');
                    NProgress.done();
                    $('.vehicle-package-id').val(pid);
                    $('#assign-driver-modal').modal('show');
                    $('.search-driver-module').find('option:not(:first)').remove();
                    for (var key in response) {
                        var sdriver = `
                    <option value="${response[key]._id}">${response[key].firstname} ${response[key].lastname} - ${response[key].email}</option>`;
                        $('.search-driver-module').append(sdriver);
                    }
                    $("#search-driver-module").select2({
                        placeholder: 'Select a driver'
                    });
                    $('.issue-vehicle').unbind().bind('click', function(e) {
                        e.preventDefault();
                        var did = $('.search-driver-module').val();
                        var pid = $('.vehicle-package-id').val();
                        if (did === '0' || did === 0) {
                            var from = 'top';
                            var align = 'right';
                            var type = 'warning';
                            var icon = 'error';
                            var message = 'Please select a driver from the drop-down list to proceed';
                            var time = 3000;
                            md.showNotification(from, align, type, icon, message, time);
                        } else if (pid === '0' || pid === 0 || pid === '' || pid === 'undefined' || pid.length < 10 || pid === novehicle) {
                            var from = 'top';
                            var align = 'right';
                            var type = 'warning';
                            var icon = 'error';
                            var message = 'This vehicle does not have a package assigned to it';
                            var time = 3000;
                            md.showNotification(from, align, type, icon, message, time);
                        } else {
                            var edata = {
                                did: did,
                                vid: vid,
                                xid: novehicle,
                                pid: pid
                            };
                            NProgress.start();
                            socket.emit('assign vehicle to driver', edata);
                            socket.on('assign vehicle to driver', function(response) {
                                socket.off('assign vehicle to driver');
                                NProgress.done();
                                $('#assign-driver-modal').modal('hide');
                                vehicles();
                                var from = 'top';
                                var align = 'right';
                                var type = 'success';
                                var icon = 'check';
                                var message = 'The vehicle has been assigned to ' + response.firstname + ' ' + response.lastname;
                                var time = 3000;
                                md.showNotification(from, align, type, icon, message, time);
                            })
                        }
                    })
                })
            }
            /*

            */
        })
        $('#dtable tbody').on('click', 'tr td .assign-package', function(e) {
            e.preventDefault();
            var vid = $(this).data('id');
            var vpub = $(this).data('pub');
            if (vpub === 0) {
                var from = 'top';
                var align = 'right';
                var type = 'warning';
                var icon = 'check';
                var message = 'This vehicle owner has not completed uploading their required documents';
                var time = 3000;
                md.showNotification(from, align, type, icon, message, time);
            } else if (vpub === 1) {
                var from = 'top';
                var align = 'right';
                var type = 'warning';
                var icon = 'check';
                var message = 'This vehicle owner has registered but not verified their account yet';
                var time = 3000;
                md.showNotification(from, align, type, icon, message, time);
            } else if (vpub === 2) {
                NProgress.start();
                socket.emit('fetch all packages', vid);
                socket.on('fetch all packages', function(response) {
                    socket.off('fetch all packages');
                    NProgress.done();
                    $('#assign-package-modal').modal('show');
                    $('.search-package-module').find('option:not(:first)').remove();
                    for (var key in response) {
                        var spackage = `
                    <option value="${response[key]._id}">${response[key].package} Ride Package</option>`;
                        $('.search-package-module').append(spackage);
                    }
                    $("#search-package-module").select2();
                    $('.issue-package').unbind().bind('click', function(e) {
                        e.preventDefault();
                        var pid = $('.search-package-module').val();
                        if (pid === '0' || pid === 0) {
                            var from = 'top';
                            var align = 'right';
                            var type = 'warning';
                            var icon = 'error';
                            var message = 'Please select a package from the drop-down list to proceed';
                            var time = 3000;
                            md.showNotification(from, align, type, icon, message, time);
                        } else {
                            var edata = {
                                pid: pid,
                                vid: vid
                            };
                            NProgress.start();
                            socket.emit('assign package to vehicle', edata);
                            socket.on('assign package to vehicle', function(response) {
                                socket.off('assign package to vehicle');
                                NProgress.done();
                                $('#assign-package-modal').modal('hide');
                                vehicles();
                                var from = 'top';
                                var align = 'right';
                                var type = 'success';
                                var icon = 'check';
                                var message = 'The ride package has been assigned to <b>' + response.plate + '</b>';
                                var time = 3000;
                                md.showNotification(from, align, type, icon, message, time);
                            })
                        }
                    })
                })
            }
        })
        $('#dtable tbody').on('click', 'tr td .notify-owner', function(e) {
            e.preventDefault();
            var ownerid = $(this).data('id');
            var ownername = $(this).data('name');
            $('#notify-owner-modal').modal('show');
            $('.owner-name-title').html('<i class="material-icons align-middle text-warning">notifications_active</i>  Send Push Notification to ' + ownername);
            $('.send-notification').unbind().bind('click', function(e) {
                e.preventDefault();
                var header = $('.onot-header').val();
                var message = $('.onot-content').val();
                if (header === '') {
                    $('.onot-header').focus();
                    var from = 'top';
                    var align = 'right';
                    var type = 'warning';
                    var icon = 'error';
                    var message = 'Please enter the push notification header in order to proceed';
                    var time = 3000;
                    md.showNotification(from, align, type, icon, message, time);
                } else if (message === '') {
                    $('.onot-content').focus();
                    var from = 'top';
                    var align = 'right';
                    var type = 'warning';
                    var icon = 'error';
                    var message = 'Please enter the push notification message in order to proceed';
                    var time = 3000;
                    md.showNotification(from, align, type, icon, message, time);
                } else {
                    NProgress.start();
                    $('.send-notification').prop('disabled', true);
                    $('#notify-owner-modal').modal('hide');
                    var notify = {
                        oid: ownerid,
                        header: header,
                        message: message
                    };
                    socket.emit('notify single owner', notify);
                    socket.on('notify single owner', function(response) {
                        socket.off('notify single owner');
                        $('.send-notification').prop('disabled', false);
                        $('.onot-header, .onot-content').val('');
                        NProgress.done();
                        var from = 'top';
                        var align = 'right';
                        var type = 'success';
                        var icon = 'notifications_active';
                        var message = 'Push notification has been successfully sent to ' + ownername;
                        var time = 5000;
                        md.showNotification(from, align, type, icon, message, time);
                    })
                }
            })
        })
        $('#dtable tbody').on('click', 'tr td .more-vehicle', function(e) {
            e.preventDefault();
            NProgress.start();
            var vid = $(this).data('id');
            socket.emit('super functions vehicle', vid);
            socket.on('super functions vehicle', function(response) {
                socket.off('super functions vehicle');
                NProgress.done();
                console.log(response)

                for (var key in response) {
                    $('.owner-profile-photo').prop('src', cloudUrl + '/assets/vehicles/avatars/' + response[key].photo);
                    $('.owner-profile-name').html(response[key].firstname + ' ' + response[key].lastname);
                    $('.owner-profile-email').html(response[key].email);
                    $('.owner-profile-phone').html(response[key].phone);
                    $('.v-rides').html(response[key].rides.length);
                    if (response[key].frontphoto !== 'none') {
                        var vfp1 = 1;
                        $('.frontx').prop('href', cloudUrl + '/assets/vehicles/cars/' + response[key].frontphoto);
                        $('.fronty').prop('src', cloudUrl + '/assets/vehicles/cars/' + response[key].frontphoto);
                    } else {
                        var vfp1 = 0;
                        $('.frontx').remove();
                    }
                    if (response[key].sidephoto !== 'none') {
                        var vsp1 = 1;
                        $('.sidex').prop('href', cloudUrl + '/assets/vehicles/cars/' + response[key].sidephoto);
                        $('.sidey').prop('src', cloudUrl + '/assets/vehicles/cars/' + response[key].sidephoto);
                    } else {
                        var vsp1 = 0;
                        $('.sidex').remove();
                    }

                    if (response[key].backphoto !== 'none') {
                        var vbp1 = 1;
                        $('.rearx').prop('href', cloudUrl + '/assets/vehicles/cars/' + response[key].backphoto);
                        $('.reary').prop('src', cloudUrl + '/assets/vehicles/cars/' + response[key].backphoto);
                    } else {
                        var vbp1 = 0;
                        $('.rearx').remove();
                    }
                    if (response[key].logbook !== 'none') {
                        var lbk = 1;
                        var logy = response[key].logbook;
                        var splitlog = logy.split(".");
                        var exty = splitlog[1].toUpperCase();
                        if (exty !== 'PDF') {
                            $('.magnic-logbook').html(`<a target="_blank" href="${cloudUrl}/assets/vehicles/logbooks/${logy}" class="primary-link magnic">View ${exty} Logbook</a>`);

                        } else {
                            $('.magnic-logbook').html(`<a target="_blank" href="${cloudUrl}/assets/vehicles/logbooks/${logy}" class="primary-link">Download ${exty} Logbook</a>`)
                        }
                    } else {
                        var lbk = 0;
                        var exty = '';
                        $('.magnic-logbook').html(`<a href="javascript:void(0)" class="primary-link">No Logbook Uploaded</a>`)
                    }
                    if (response[key].insurance !== 'none') {
                        var ins = 1;
                        var insy = response[key].insurance;
                        var splitins = insy.split(".");
                        var exti = splitins[1].toUpperCase();
                        if (exti !== 'PDF') {
                            $('.magnic-insurance').html(`<a target="_blank" href="${cloudUrl}/assets/vehicles/insurance/${insy}" class="pink-link magnic">View ${exty} Insurance</a>`);
                        } else {
                            $('.magnic-insurance').html(`<a target="_blank" href="${cloudUrl}/assets/vehicles/insurance/${insy}" class="pink-link">Download ${exty} Insurance</a>`)
                        }
                    } else {
                        var ins = 0;
                        var exti = '';
                        $('.magnic-insurance').html(`<a href="javascript:void(0)" class="pink-link">No Insurance Uploaded</a>`)
                    }
                    var pcount = (vfp1 + vsp1 + vbp1);
                    $('.count-photos').html(pcount);
                    $('.count-logbook').html(lbk + ' <small>' + exty + '</small>');
                    $('.count-insurance').html(ins + ' <small>' + exti + '</small>');
                    $('.count-drivers').html(response[key].drivers.length);
                    $('.count-packages').html(response[key].rates.length);
                    if (response[key].drivers.length > 0) {
                        $('.v-drivers').html(response[key].drivers[0].firstname + ' ' + response[key].drivers[0].lastname);
                    } else {
                        $('.v-drivers').html('No Driver Assigned');
                    }
                    if (response[key].rates.length > 0) {
                        $('.v-package').html(response[key].rates[0].package + ' Package');

                    } else {
                        $('.v-package').html('No Package');
                    }
                    $('#modal-vehicle-profile').modal('show');
                    $(function() {
                        $('.magnic-photos').lightGallery({
                            thumbnail: true,
                            autoplay: false,
                            selector: 'a'
                        });
                    });
                }

            })
        })

    })
    $('.notify-all-owners').unbind().bind('click', function(e) {
        e.preventDefault();
        $('#notify-owner-modal').modal('show');
        $('.owner-name-title').html('<i class="material-icons align-middle text-warning">notifications_active</i> Send Push Notification to All Car Owners');
        $('.send-notification').unbind().bind('click', function(e) {
            e.preventDefault();
            var header = $('.onot-header').val();
            var message = $('.onot-content').val();
            if (header === '') {
                $('.onot-header').focus();
                var from = 'top';
                var align = 'right';
                var type = 'warning';
                var icon = 'error';
                var message = 'Please enter the push notification header in order to proceed';
                var time = 3000;
                md.showNotification(from, align, type, icon, message, time);
            } else if (message === '') {
                $('.onot-content').focus();
                var from = 'top';
                var align = 'right';
                var type = 'warning';
                var icon = 'error';
                var message = 'Please enter the push notification message in order to proceed';
                var time = 3000;
                md.showNotification(from, align, type, icon, message, time);
            } else {
                NProgress.start();
                $('.send-notification').prop('disabled', true);
                var notify = {
                    oid: freelance,
                    header: header,
                    message: message
                };
                socket.emit('notify all owners', notify);
                socket.on('notify all owners', function(response) {
                    socket.off('notify all owners');
                    $('#notify-owner-modal').modal('hide');
                    $('.send-notification').prop('disabled', false);
                    $('.onot-header, .onot-content').val('');
                    NProgress.done();
                    var from = 'top';
                    var align = 'right';
                    var type = 'primary';
                    var icon = 'notifications_active';
                    var message = 'Push notification has been successfully sent to ' + response.recipients + ' car owners';
                    var time = 5000;
                    md.showNotification(from, align, type, icon, message, time);
                })
            }
        })
    })
    $('.refresh-data').unbind().bind('click', function(e) {
        e.preventDefault();
        vehicles();
    })
}

function rides() {

    NProgress.start();
    $('.refresh-data').css('display', 'none');
    destroyRidesDataTable();
    socket.emit('fetch all rides', admin);
    socket.on('fetch all rides', function(response) {
        socket.off('fetch all rides');
        socket.emit('fetch pending rides', admin);
        $('.refresh-data').css('display', 'block');
        $('.all-rides, .pending-rides, .active-rides, .cancelled-rides, .completed-rides, .driver-initiated-rides').html('');
        var i = 1;
        console.log(response)
        for (var key in response) {
            var id = i++;
            if (response[key].driveraccept === 0 && response[key].driverstop === 0) {
                var badge = '<span class="badge blue lighten-5 blue-text text-accent-2">Pending</span>';
            } else if (response[key].driveraccept === 1 && response[key].driverstop === 0) {
                var badge = '<span class="badge green lighten-5 green-text text-accent-2">Active</span>';
            } else if (response[key].driveraccept === 2 && response[key].driverstop === 0) {
                var badge = '<span class="badge pink lighten-5 pink-text text-accent-2">Rejected</span>';
            } else if (response[key].driveraccept === 3 && response[key].driverstop === 0) {
                var badge = '<span class="badge pink lighten-5 pink-text text-accent-2">Cancelled</span>';
            }
            var origin = truncateString(response[key].origin, 28);
            var destination = truncateString(response[key].destination, 28);
            var waitingtime = ((response[key].driverstart - response[key].driverarrive) / 60000).toFixed(0);
            var xwait = response[key].xpackage[0].waitingtime;
            if (xwait < waitingtime) {
                var waiter = `<span class="text-warning">${waitingtime} Mins</span>`;
            } else {
                var waiter = `<span class="text-info">${waitingtime} Mins</span>`;
            }
            var rdriver = response[key].xdriver[0].firstname + ' ' + response[key].xdriver[0].lastname;
            var ldriver = response[key].xdriver[0].location.coordinates[1] + ',' + response[key].xdriver[0].location.coordinates[0];
            if (response[key].rider === freelance) {
                var rrider = 'Unregistered Rider';
            } else {
                var rrider = response[key].xrider[0].firstname + ' ' + response[key].xrider[0].lastname;
            }
            var allrides = `<tr class="animate__animated animate__fadeIn">
            <td class="text-center"><img class="table-icon-no-radius" src="${appUrl}/assets/packages/${response[key].xpackage[0].photo}"></td>
            <td>${truncateString(rdriver, 15)}</td>
            <td>${truncateString(rrider, 15)}</td>
            <td>${origin}</td>
            <td>${destination}</td>
            <td>${(response[key].distance / 1000).toFixed(1)} KM</td>
            <td>${waiter}</td>
            <td>KES. ${response[key].actprice}</td>
            <td>${badge}</td>
            <td>${timeConverterDate(response[key].created)}</td>
            <td>${timeConverterTime(response[key].created)}</td>
            <td class="td-actions text-right">
            <a href="javascript:void(0)" class="view-ride" data-id="${response[key]._id}"><i class="material-icons col-blue-grey size-20">more_vert</i></a>
            <a href="javascript:void(0)" class="simulate-ride" data-id="${response[key]._id}" data-origin="${response[key].position.origin}" data-driverid="${response[key].driver}" data-destination="${response[key].position.destination}" data-driverlocation="${ldriver}"><i class="f7-icons col-blue-grey size-20">hand_draw_fill</i></a>
            </td>
            </tr>`;
            $('.all-rides').append(allrides);
        }
        initRtable1();
        socket.on('fetch pending rides', function(response) {
            socket.off('fetch pending rides');
            socket.emit('fetch active rides', admin);
            var i = 1;
            for (var key in response) {
                var id = i++;
                if (response[key].status === 1) {
                    var badge = '<span class="badge green lighten-5 green-text text-accent-2">Pending</span>';
                } else if (response[key].status === 2) {
                    var badge = '<span class="badge green lighten-5 green-text text-accent-2">Complete</span>';
                } else {
                    var badge = '<span class="badge pink lighten-5 pink-text text-accent-2">Cancelled</span>';
                }
                var origin = truncateString(response[key].origin, 28);
                var destination = truncateString(response[key].destination, 28);
                var waitingtime = ((response[key].driverstart - response[key].driverarrive) / 60000).toFixed(0);
                var rdriver = response[key].xdriver[0].firstname + ' ' + response[key].xdriver[0].lastname;
                var rrider = response[key].xrider[0].firstname + ' ' + response[key].xrider[0].lastname;
                var ldriver = response[key].xdriver[0].location.coordinates[1] + ',' + response[key].xdriver[0].location.coordinates[0];
                var pendingrides = `<tr class="animate__animated animate__fadeIn">
                <td class="text-center"><img class="table-icon-no-radius" src="${appUrl}/assets/packages/${response[key].xpackage[0].photo}"></td>
                <td>${truncateString(rdriver, 15)}</td>
                <td>${truncateString(rrider, 15)}</td>
                <td>${origin}</td>
                <td>${destination}</td>
                <td>${(response[key].distance / 1000).toFixed(1)} KM</td>
                <td>${waitingtime} Mins</td>
                <td>KES. ${response[key].actprice}</td>
                <td>${timeConverterDate(response[key].created)}</td>
                <td>${timeConverterTime(response[key].created)}</td>
                <td class="td-actions text-right">
                <a href="javascript:void(0)" class="view-ride" data-id="${response[key]._id}"><i class="material-icons col-blue-grey size-20">more_vert</i></a>
                <a href="javascript:void(0)" class="simulate-ride" data-id="${response[key]._id}" data-origin="${response[key].position.origin}" data-destination="${response[key].position.destination}" data-driverid="${response[key].driver}" data-driverlocation="${ldriver}"><i class="f7-icons col-blue-grey size-20">hand_draw_fill</i></a>
                </td>
                </tr>`;
                $('.pending-rides').append(pendingrides);
            }
            initRtable2();

            socket.on('fetch active rides', function(response) {
                socket.off('fetch active rides');
                socket.emit('fetch cancelled rides', admin);
                var i = 1;
                console.log(response)
                for (var key in response) {
                    var id = i++;
                    if (response[key].status === 1) {
                        var badge = '<span class="badge green lighten-5 green-text text-accent-2">Pending</span>';
                    } else if (response[key].status === 2) {
                        var badge = '<span class="badge green lighten-5 green-text text-accent-2">Complete</span>';
                    } else {
                        var badge = '<span class="badge pink lighten-5 pink-text text-accent-2">Cancelled</span>';
                    }
                    var origin = truncateString(response[key].origin, 28);
                    var destination = truncateString(response[key].destination, 28);
                    var waitingtime = ((response[key].driverstart - response[key].driverarrive) / 60000).toFixed(0);
                    var rdriver = response[key].xdriver[0].firstname + ' ' + response[key].xdriver[0].lastname;
                    var ldriver = response[key].xdriver[0].location.coordinates[1] + ',' + response[key].xdriver[0].location.coordinates[0];
                    if (response[key].rider === freelance) {
                        var rrider = 'Unregistered Rider';
                    } else {
                        var rrider = response[key].xrider[0].firstname + ' ' + response[key].xrider[0].lastname;
                    }
                    var activerides = `<tr class="animate__animated animate__fadeIn">
                    <td class="text-center"><img class="table-icon-no-radius" src="${appUrl}/assets/packages/${response[key].xpackage[0].photo}"></td>
                    <td>${truncateString(rdriver, 15)}</td>
                    <td>${truncateString(rrider, 15)}</td>
                    <td>${origin}</td>
                    <td>${destination}</td>
                    <td>${(response[key].distance / 1000).toFixed(1)} KM</td>
                    <td>${waitingtime} Mins</td>
                    <td>KES. ${response[key].actprice}</td>
                    <td>${timeConverterDate(response[key].created)}</td>
                    <td>${timeConverterTime(response[key].created)}</td>
                    <td class="td-actions text-right">
                    <a href="javascript:void(0)" class="view-ride" data-id="${response[key]._id}"><i class="material-icons col-blue-grey size-20">more_vert</i></a>
                    <a href="javascript:void(0)" class="simulate-ride" data-id="${response[key]._id}" data-origin="${response[key].position.origin}" data-destination="${response[key].position.destination}"  data-driverid="${response[key].driver}" data-driverlocation="${ldriver}"><i class="f7-icons col-blue-grey size-20">hand_draw_fill</i></a>
                    </td>
                    </tr>`;
                    $('.active-rides').append(activerides);
                }
                initRtable3();

                socket.on('fetch cancelled rides', function(response) {
                    socket.off('fetch cancelled rides');
                    socket.emit('fetch completed rides', admin);
                    var i = 1;
                    for (var key in response) {
                        var id = i++;
                        if (response[key].status === 1) {
                            var badge = '<span class="badge green lighten-5 green-text text-accent-2">Pending</span>';
                        } else if (response[key].status === 2) {
                            var badge = '<span class="badge green lighten-5 green-text text-accent-2">Complete</span>';
                        } else {
                            var badge = '<span class="badge pink lighten-5 pink-text text-accent-2">Cancelled</span>';
                        }
                        var origin = truncateString(response[key].origin, 28);
                        var destination = truncateString(response[key].destination, 28);
                        var waitingtime = ((response[key].driverstart - response[key].driverarrive) / 60000).toFixed(0);
                        var rdriver = response[key].xdriver[0].firstname + ' ' + response[key].xdriver[0].lastname;
                        var rrider = response[key].xrider[0].firstname + ' ' + response[key].xrider[0].lastname;
                        var ldriver = response[key].xdriver[0].location.coordinates[1] + ',' + response[key].xdriver[0].location.coordinates[0];
                        var cancelledrides = `<tr class="animate__animated animate__fadeIn">
                        <td class="text-center"><img class="table-icon-no-radius" src="${appUrl}/assets/packages/${response[key].xpackage[0].photo}"></td>
                        <td>${truncateString(rdriver, 15)}</td>
                        <td>${truncateString(rrider, 15)}</td>
                        <td>${origin}</td>
                        <td>${destination}</td>
                        <td>${(response[key].distance / 1000).toFixed(1)} KM</td>
                        <td>${waitingtime} Mins</td>
                        <td>KES. ${response[key].actprice}</td>
                        <td>${timeConverterDate(response[key].created)}</td>
                        <td>${timeConverterTime(response[key].created)}</td>
                        <td class="td-actions text-right">
                        <a href="javascript:void(0)" class="view-ride" data-id="${response[key]._id}"><i class="material-icons col-blue-grey size-20">more_vert</i></a>
                        <a href="javascript:void(0)" class="simulate-ride" data-id="${response[key]._id}" data-origin="${response[key].position.origin}" data-destination="${response[key].position.destination}" data-driverid="${response[key].driver}" data-driverlocation="${ldriver}"><i class="f7-icons col-blue-grey size-20">hand_draw_fill</i></a>
                        </td>
                        </tr>`;
                        $('.cancelled-rides').append(cancelledrides);
                    }
                    initRtable4();

                    socket.on('fetch completed rides', function(response) {
                        socket.off('fetch completed rides')
                        socket.emit('fetch driver initiated rides', admin);
                        var i = 1;
                        for (var key in response) {
                            var id = i++;
                            if (response[key].status === 1) {
                                var badge = '<span class="badge green lighten-5 green-text text-accent-2">Pending</span>';
                            } else if (response[key].status === 2) {
                                var badge = '<span class="badge green lighten-5 green-text text-accent-2">Complete</span>';
                            } else {
                                var badge = '<span class="badge pink lighten-5 pink-text text-accent-2">Cancelled</span>';
                            }
                            var origin = truncateString(response[key].origin, 28);
                            var destination = truncateString(response[key].destination, 28);
                            var waitingtime = ((response[key].driverstart - response[key].driverarrive) / 60000).toFixed(0);
                            var rdriver = response[key].xdriver[0].firstname + ' ' + response[key].xdriver[0].lastname;
                            var ldriver = response[key].xdriver[0].location.coordinates[1] + ',' + response[key].xdriver[0].location.coordinates[0];
                            if (response[key].rider === freelance) {
                                var rrider = 'Unregistered Rider';
                            } else {
                                var rrider = response[key].xrider[0].firstname + ' ' + response[key].xrider[0].lastname;
                            }
                            var completedrides = `<tr class="animate__animated animate__fadeIn">
                            <td class="text-center"><img class="table-icon-no-radius" src="${appUrl}/assets/packages/${response[key].xpackage[0].photo}"></td>
                            <td>${truncateString(rdriver, 15)}</td>
                            <td>${truncateString(rrider, 15)}</td>
                            <td>${origin}</td>
                            <td>${destination}</td>
                            <td>${(response[key].distance / 1000).toFixed(1)} KM</td>
                            <td>${waitingtime} Mins</td>
                            <td>KES. ${response[key].actprice}</td>
                            <td>${timeConverterDate(response[key].created)}</td>
                            <td>${timeConverterTime(response[key].created)}</td>
                            <td class="td-actions text-right">
                            <a href="javascript:void(0)" class="view-ride" data-id="${response[key]._id}"><i class="material-icons col-blue-grey size-20">more_vert</i></a>
                            <a href="javascript:void(0)" class="simulate-ride" data-id="${response[key]._id}" data-origin="${response[key].position.origin}" data-destination="${response[key].position.destination}" data-driverid="${response[key].driver}" data-driverlocation="${ldriver}"><i class="f7-icons col-blue-grey size-20">hand_draw_fill</i></a>
                            </td>
                            </tr>`;
                            $('.completed-rides').append(completedrides);
                        }
                        initRtable5();

                        socket.on('fetch driver initiated rides', function(response) {
                            socket.off('fetch driver initiated rides');
                            console.log('fetched driver initiated rides');
                            NProgress.done();
                            initRtable6();
                        })
                    })
                })
            })
        })
        $('.refresh-data').unbind().bind('click', function(e) {
            e.preventDefault();
            rides();
        })
        $('.simulate-ride').unbind().bind('click', function(e) {
            e.preventDefault();
            var rid = $(this).data('id');
            var coorigin = $(this).data('origin');
            var codestination = $(this).data('destination');
            var codriver = $(this).data('driverlocation');
            var codriverid = $(this).data('driverid');
            var cosocket = 'driver';
            getDirections(coorigin, codestination, codriver, codriverid, cosocket);
            $('.map-title').html(`<h4 class="card-title text-success m-0 p-0">
      <i class="align-middle f7-icons size-20">waveform_path_ecg</i> <b>Track Route for Tufike Pamoja Driver's Ride</b>
      </h4>`);
            $('#modal-enroute').modal('show');
        })
    })
}
$('#modal-enroute').on('hidden.bs.modal', function() {
    console.log('Enroute closed')
});

function getDirections(coorigin, codestination, codriver, codriverid, cosocket) {
    $('.map-routes').html('');
    console.log(codriverid)
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var pointA = new google.maps.LatLng(coorigin);
    var pointB = new google.maps.LatLng(codestination);
    var map = new google.maps.Map(document.getElementById('map-panel'), {
        disableDefaultUI: true,
        zoom: 18,
        scaleControl: true,
        streetViewControl: false,
        fullScreenControl: false,
        zoomControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    infoWindow = new google.maps.InfoWindow();
    markerA = new google.maps.Marker({
        position: pointA,
        icon: appUrl + '/assets/admin/img/icons/origin.png',
        map: map
    });

    var splitco = codriver.split(",");
    var colat = parseFloat(splitco[0]);
    var colng = parseFloat(splitco[1]);
    var xLatlng = { lat: colat, lng: colng };
    if (cosocket === 'driver') {
        var markerX = new google.maps.Marker({
            position: xLatlng,
            map: map,
            icon: appUrl + '/assets/admin/img/icons/green-point.png',
        });
    } else if (cosocket === 'rider') {
        var markerX = new google.maps.Marker({
            position: xLatlng,
            map: map,
            icon: appUrl + '/assets/admin/img/icons/blue-point.png',
        });
    }
    var styles = mapstyles;
    map.setOptions({
        styles: styles['hide']
    });
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('map-routes'));
    var request = {
        origin: coorigin,
        destination: codestination,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            var pOptions = {
                map: map,
                strokeColor: "#000000",
                strokeOpacity: 0.8,
                strokeWeight: 6,
            };
            directionsDisplay.setDirections(response);
            directionsDisplay.setOptions({ suppressMarkers: false, polylineOptions: pOptions });
            var center = response.routes[0].overview_path[Math.floor(response.routes[0].overview_path.length / 2)];
            infoWindow.setPosition(center);
            infoWindow.setContent(response.routes[0].legs[0].duration.text + "<br>" + response.routes[0].legs[0].distance.text);
            //infoWindow.open(map);
            if (cosocket === 'driver') {
                socket.on('new driver location', function(response) {
                    if (response.did === codriverid) {
                        var position = [colat, colng];
                        var result = [response.lat, response.lng];
                        var rotor = bearing(colat, colng, response.lat, response.lng);
                        transitionX(result, position, rotor);
                        $('img[src="' + appUrl + '/assets/admin/img/icons/green-point.png"]').css({ 'transform': 'rotate(' + rotor + 'deg)' });
                    }
                })
            } else if (cosocket === 'rider') {
                socket.on('new rider location', function(response) {
                    if (response.uid === codriverid) {
                        var position = [colat, colng];
                        var result = [response.lat, response.lng];
                        var rotor = bearing(colat, colng, response.lat, response.lng);
                        transitionX(result, position, rotor);
                        $('img[src="' + appUrl + '/assets/admin/img/icons/blue-point.png"]').css({ 'transform': 'rotate(' + rotor + 'deg)' });
                    }
                })
            }

            var numDeltas = 100;
            var delay = 10; //milliseconds
            var i = 0;
            var deltaLat;
            var deltaLng;

            function transitionX(result, position, rotor) {
                i = 0;
                deltaLat = (result[0] - position[0]) / numDeltas;
                deltaLng = (result[1] - position[1]) / numDeltas;
                moveMarkerX(position, rotor);
            }

            function moveMarkerX(position, rotor) {
                position[0] += deltaLat;
                position[1] += deltaLng;
                var latlngX = new google.maps.LatLng(position[0], position[1]);
                markerX.setPosition(latlngX);

                if (i != numDeltas) {
                    i++;
                    window.movea = setTimeout(function() {
                        moveMarkerX(position, rotor);
                    }, delay)
                }
            }
        }
    });
}

function toRadians(degrees) {
    return degrees * Math.PI / 180;
};

function toDegrees(radians) {
    return radians * 180 / Math.PI;
}

function bearing(startLat, startLng, destLat, destLng) {
    startLat = toRadians(startLat);
    startLng = toRadians(startLng);
    destLat = toRadians(destLat);
    destLng = toRadians(destLng);
    y = Math.sin(destLng - startLng) * Math.cos(destLat);
    x = Math.cos(startLat) * Math.sin(destLat) -
        Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    brng = Math.atan2(y, x);
    brng = toDegrees(brng);
    return (brng + 360) % 360;
}

function packages() {
    NProgress.start();
    $('.refresh-data').css('display', 'none');
    destroyDataTable();
    socket.emit('fetch all packages', admin);
    socket.on('fetch all packages', function(response) {
        socket.off('fetch all packages');
        NProgress.done();
        $('.refresh-data').css('display', 'block');
        $('.all-packages').html('');
        var i = 1;
        for (var key in response) {
            var id = i++;
            if (response[key].status === 1) {
                var badge = '<span class="badge pink lighten-5 pink-text text-accent-2">Pending</span>';
            } else {
                var badge = '<span class="badge green lighten-5 green-text text-accent-2">Active</span>';
            }
            var name = truncateString(response[key].firstname + ' ' + response[key].lastname, 15);
            var status = response[key].status;
            if (status === 1) {
                bcolor = 'col-blue-grey';
                bclass = 'disable-package';
            } else if (status === 2) {
                bcolor = 'col-pink';
                bclass = 'enable-package';
            }
            var riders = `<tr class="animate__animated animate__fadeIn">
            <td>${id}</td>
            <td><img class="table-icon-no-radius" src="${appUrl}/assets/packages/${response[key].photo}"></td>
            <td>${response[key].package}</td>
            <td>KES. ${response[key].basefare}</td>
            <td>KES. ${response[key].minimumfare}</td>
            <td>KES. ${response[key].permin}</td>
            <td>KES. ${response[key].perkm}</td>
            <td>${response[key].waitingtime} Mins</td>
            <td>KES. ${response[key].waitingcharges}</td>
            <td>${response[key].commission}%</td>
            <td>${response[key].rewards} <i class="f7-icons size-15">bolt_circle</i> Per Km</td>
            <td class="td-actions text-right">
            <a href="javascript:void(0)" class="edit-package" data-id="${response[key]._id}"><i class="f7-icons col-blue-grey size-25">pencil_ellipsis_rectangle</i></a>
            <a href="javascript:void(0)" class="${bclass}" data-id="${response[key]._id}" data-name="${response[key].package}"><i class="material-icons ${bcolor} size-20">block</i></a>
            </td>
            </tr>`;
            $('.all-packages').append(riders);
        }
        initDataTable();
        $('.refresh-data').unbind().bind('click', function(e) {
            e.preventDefault();
            packages();
        })
        $('.disable-package').unbind().bind('click', function(e) {
            e.preventDefault();
            var pid = $(this).data('id');
            var pname = $(this).data('name');
            Swal.fire({
                title: '<h4 class="lexacle-bold">Disable Ride Package?</h4>',
                icon: 'question',
                html: `Are you sure you want to disable the ${pname} Ride Package?`,
                scrollbarPadding: false,
                confirmButtonText: 'Disable',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
                showCancelButton: true,
                customClass: {
                    confirmButton: 'btn btn-danger pull-right-swal waves-effect',
                    cancelButton: 'btn btn-success pull-left-swal waves-effect'
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.value) {
                    socket.emit('disable ride package', pid);
                    socket.on('disable ride package', function(response) {
                        socket.off('disable ride package');
                        packages();
                    })
                }
            })
        })
        $('.enable-package').unbind().bind('click', function(e) {
            e.preventDefault();
            var pid = $(this).data('id');
            var pname = $(this).data('name');
            Swal.fire({
                title: '<h4 class="lexacle-bold">Enable Ride Package?</h4>',
                icon: 'question',
                html: `Are you sure you want to enable the ${pname} Ride Package?`,
                scrollbarPadding: false,
                confirmButtonText: 'Enable',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
                showCancelButton: true,
                customClass: {
                    confirmButton: 'btn btn-success pull-right-swal waves-effect',
                    cancelButton: 'btn btn-danger pull-left-swal waves-effect'
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.value) {
                    socket.emit('enable ride package', pid);
                    socket.on('enable ride package', function(response) {
                        socket.off('enable ride package');
                        packages();
                    })
                }
            })
        })
        $('.edit-package').unbind().bind('click', function(e) {
            e.preventDefault();
            var pid = $(this).data('id');
            NProgress.start();
            socket.emit('fetch single package', pid);
            socket.on('fetch single package', function(response) {
                socket.off('fetch single package');
                NProgress.done();
                $('.package-photo').prop('src', appUrl + '/assets/packages/' + response.photo);
                $('.package-name').html(response.package);
                $('.upackage-name').val(response.package);
                $('.upackage-base').val(response.basefare);
                $('.upackage-minimum').val(response.minimumfare);
                $('.upackage-perkm').val(response.perkm);
                $('.upackage-permin').val(response.permin);
                $('.upackage-points').val(response.rewards);
                $('.upackage-wtime').val(response.waitingtime);
                $('.upackage-wfee').val(response.waitingcharges);
                $('.upackage-commission').val(response.commission);
                $('.upackage-perpoints').val(response.perreward);
                $('.upackage-minpoints').val(response.minredeem);
                $('.upackage-maxpoints').val(response.maxredeem);
                $('#edit-package-modal').modal('show');
                $('.update-package').unbind().bind('click', function(e) {
                    e.preventDefault();
                    var packagename = $('.upackage-name').val();
                    var basefare = $('.upackage-base').val();
                    var minimum = $('.upackage-minimum').val();
                    var perkm = $('.upackage-perkm').val();
                    var permin = $('.upackage-permin').val();
                    var points = $('.upackage-points').val();
                    var waitingtime = $('.upackage-wtime').val();
                    var waitingcharges = $('.upackage-wfee').val();
                    var commission = $('.upackage-commission').val();
                    var perreward = $('.upackage-perpoints').val();
                    var minpoints = $('.upackage-minpoints').val();
                    var maxpoints = $('.upackage-maxpoints').val();
                    if (packagename === '') {
                        var from = 'top';
                        var align = 'right';
                        var type = 'warning';
                        var icon = 'error';
                        var message = 'The ride package name is required in order to proceed';
                        var time = 3000;
                        md.showNotification(from, align, type, icon, message, time);
                        $('.upackage-name').focus();
                    } else if (basefare === '') {
                        var from = 'top';
                        var align = 'right';
                        var type = 'warning';
                        var icon = 'error';
                        var message = 'The ride package base fare is required to proceed';
                        var time = 3000;
                        md.showNotification(from, align, type, icon, message, time);
                        $('.upackage-base').focus();
                    } else if (minimum === '') {
                        var from = 'top';
                        var align = 'right';
                        var type = 'warning';
                        var icon = 'error';
                        var message = 'The ride package minimum fare is required to proceed';
                        var time = 3000;
                        md.showNotification(from, align, type, icon, message, time);
                        $('.upackage-minimum').focus();
                    } else if (perkm === '') {
                        var from = 'top';
                        var align = 'right';
                        var type = 'warning';
                        var icon = 'error';
                        var message = 'The ride package Per Kilometre fee is required to proceed';
                        var time = 3000;
                        md.showNotification(from, align, type, icon, message, time);
                        $('.upackage-perkm').focus();
                    } else if (permin === '') {
                        var from = 'top';
                        var align = 'right';
                        var type = 'warning';
                        var icon = 'error';
                        var message = 'The ride package Per Minute fee is required to proceed';
                        var time = 3000;
                        md.showNotification(from, align, type, icon, message, time);
                        $('.upackage-permin').focus();
                    } else if (points === '') {
                        var from = 'top';
                        var align = 'right';
                        var type = 'warning';
                        var icon = 'error';
                        var message = 'The ride package Rewards Per Kilometre is required to proceed';
                        var time = 3000;
                        md.showNotification(from, align, type, icon, message, time);
                        $('.upackage-points').focus();
                    } else if (waitingtime === '') {
                        var from = 'top';
                        var align = 'right';
                        var type = 'warning';
                        var icon = 'error';
                        var message = 'The ride package Waiting time is required to proceed';
                        var time = 3000;
                        md.showNotification(from, align, type, icon, message, time);
                        $('.upackage-wtime').focus();
                    } else if (waitingcharges === '') {
                        var from = 'top';
                        var align = 'right';
                        var type = 'warning';
                        var icon = 'error';
                        var message = 'The ride package Waiting fee per minute is required to proceed';
                        var time = 3000;
                        md.showNotification(from, align, type, icon, message, time);
                        $('.upackage-wfee').focus();
                    } else if (commission === '') {
                        var from = 'top';
                        var align = 'right';
                        var type = 'warning';
                        var icon = 'error';
                        var message = 'The ride package payments to Tufike in percentage is required';
                        var time = 3000;
                        md.showNotification(from, align, type, icon, message, time);
                        $('.upackage-commission').focus();
                    } else if (perreward === '') {
                        var from = 'top';
                        var align = 'right';
                        var type = 'warning';
                        var icon = 'error';
                        var message = 'The package reward in KES per point is required';
                        var time = 3000;
                        md.showNotification(from, align, type, icon, message, time);
                        $('.upackage-perpoints').focus();
                    } else if (minpoints === '') {
                        var from = 'top';
                        var align = 'right';
                        var type = 'warning';
                        var icon = 'error';
                        var message = 'The minimum number of Redeemable Points is required';
                        var time = 3000;
                        md.showNotification(from, align, type, icon, message, time);
                        $('.upackage-minpoints').focus();
                    } else if (maxpoints === '') {
                        var from = 'top';
                        var align = 'right';
                        var type = 'warning';
                        var icon = 'error';
                        var message = 'The maximum number of Redeemable Points is required';
                        var time = 3000;
                        md.showNotification(from, align, type, icon, message, time);
                        $('.upackage-maxpoints').focus();
                    } else {
                        var pdata = {
                            pid: pid,
                            pname: packagename,
                            pbase: basefare,
                            pminimum: minimum,
                            pkm: perkm,
                            pmin: permin,
                            ppoints: points,
                            pwtime: waitingtime,
                            pwcharge: waitingcharges,
                            pcom: commission,
                            psh: perreward,
                            prmin: minpoints,
                            prmax: maxpoints
                        };
                        socket.emit('update ride package', pdata);
                        socket.on('update ride package', function(response) {
                            socket.off('update ride package');
                            console.log(response)
                            var from = 'top';
                            var align = 'right';
                            var type = 'success';
                            var icon = 'check';
                            var message = 'The ride package has been successfully updated';
                            var time = 3000;
                            md.showNotification(from, align, type, icon, message, time);
                            $('#edit-package-modal').modal('hide');
                            packages();
                        })
                    }
                })
            })
        })
    })
}

function points() {

    NProgress.start();
    $('.refresh-data').css('display', 'none');
    destroyDataTable();
    socket.emit('fetch all rewards', admin);
    socket.on('fetch all rewards', function(response) {
        socket.off('fetch all rewards');
        NProgress.done();
        $('.refresh-data').css('display', 'block');
        $('.all-rewards').html('');
        console.log(response)
        var i = 1;
        for (var key in response) {
            if (response[key].xrider) {
                var ridername = response[key].xrider.firstname + ' ' + response[key].xrider.lastname;
                var riderreg = timeConverterDate(response[key].xrider.created) + ' ' + timeConverterTime(response[key].xrider.created);
                var riderphoto = `<img class="table-icon" src="${appUrl}/assets/riders/avatars/${response[key].xrider.photo}" />`;
                var riderphone = response[key].xrider.phone;
                var rideremail = response[key].xrider.email;
                var rewardedpoints = response[key].totalRewarded;
                var redeemeedpoints = response[key].totalRedeemed;
                var availablepoints = rewardedpoints - redeemeedpoints;
                var rewardsdate = timeConverterDate(response[key].created);
                var apoints = `
            <tr>
            <td>${i++}</td>
            <td>${riderphoto}</td>
            <td>${ridername}</td>
            <td>${riderreg}</td>
            <td>${riderphone}</td>
            <td>${truncateString(rideremail,20)}</td>
            <td>${rewardedpoints} <i class="f7-icons size-15">gift_alt_fill</i></td>
            <td>${redeemeedpoints} <i class="f7-icons size-15">gift_alt_fill</i></td>
            <td>${availablepoints} <i class="f7-icons size-15">gift_alt_fill</i></td>
            <td>${rewardsdate}</td>
            </tr>
            `;
                $('.all-rewards').append(apoints);
            }
        }
        initDataTable();
    })
    $('.refresh-data').unbind().bind('click', function(e) {
        e.preventDefault();
        points();
    })
}

function promotions() {
    NProgress.start();
    $('.refresh-data').css('display', 'none');
    destroydxDataTable();
    $('.add-promo').addClass('hidden');
    socket.emit('fetch all promos', admin);
    socket.on('fetch all promos', function(response) {
        socket.off('fetch all promos');
        NProgress.done();
        setTimeout(function() {
            $('.add-promo').removeClass('hidden');
        }, 500)
        $('.refresh-data').css('display', 'block');
        $('.all-promos').html('');
        var i = 1;
        for (var key in response) {
            var id = i++;
            if (response[key].stopdate < Date.now()) {
                var badge = '<span class="badge pink lighten-5 pink-text text-accent-2">Expired</span>';
                var probtn = '<a href="javascript:void(0)" class="expired-promo" data-id="' + response[key]._id + '"><i class="f7-icons col-blue-grey">calendar_circle</i></a>';
                var prem = 'grayscalefilter';
            } else {
                if (response[key].status === 0) {
                    var badge = '<span class="badge blue lighten-5 blue-text text-accent-2">Pending</span>';
                    var probtn = '<a href="javascript:void(0)" class="activate-promo" data-id="' + response[key]._id + '"><i class="material-icons col-blue-grey">play_circle_outline</i></a>';
                    var prem = 'grayscalefilter';
                } else if (response[key].status === 1) {
                    var badge = '<span class="badge green lighten-5 green-text text-accent-2">Active</span>';
                    var probtn = '<a href="javascript:void(0)" class="deactivate-promo" data-id="' + response[key]._id + '"><i class="material-icons col-green">pause_circle_outline</i></a>';
                    var prem = '';
                } else if (response[key].status === 2) {
                    var badge = '<span class="badge pink lighten-5 pink-text text-accent-2">Stopped</span>';
                    var probtn = '<a href="javascript:void(0)" class="activate-promo" data-id="' + response[key]._id + '"><i class="material-icons col-blue-grey">play_circle_outline</i></a>';
                    var prem = 'grayscalefilter';
                }
            }
            var promotext = truncateString(response[key].content, 20);
            var promos = `<tr class="animate__animated animate__fadeIn">
            <td>${id}</td>
            <td><img src="/assets/admin/img/icons/promotion.svg" class="table-icon-no-radius ${prem}"/> &nbsp; &nbsp; ${response[key].promocode}</td>
            <td>${response[key].discount} '% Off</td>
            <td>${timeConverterDate(response[key].startdate)}</td>
            <td>${timeConverterDate(response[key].stopdate)}</td>
            <td>${promotext}</td>
            <td>${response[key].xrides.length} Times</td>
            <td>${badge}</td>
            <td class="td-actions text-right">
            <a href="javascript:void(0)" class="delete-promo" data-id="${response[key]._id}" data-code="${response[key].promocode}"><i class="f7-icons col-blue-grey size-20">trash</i></a>
            ${probtn}
            </td>
            </tr>`;
            $('.all-promos').append(promos);
        }
        initdxDataTable();
        $('.refresh-data').unbind().bind('click', function(e) {
            e.preventDefault();
            promotions();
        })
        $('#dxtable tbody').on('click', 'tr td .activate-promo', function(e) {
            e.preventDefault();
            var promoid = $(this).data('id');
            var promocode = $(this).data('code');
            var tr = $(this).parent('td').parent('tr');
            Swal.fire({
                title: '<h4 class="lexacle-bold">Activate Promo?</h4>',
                icon: 'question',
                html: `Are you sure you want to Activate the promo code ${promocode}?`,
                scrollbarPadding: false,
                confirmButtonText: 'Activate',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
                showCancelButton: true,
                customClass: {
                    confirmButton: 'btn btn-success pull-right-swal waves-effect',
                    cancelButton: 'btn btn-primary pull-left-swal waves-effect'
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.value) {
                    //tr.addClass('magictime puffIn')
                    socket.emit('activate new promo', promoid);
                    socket.on('activate new promo', function(response) {
                        socket.off('activate new promo');
                        promotions();
                    })
                }
            })
        })
        $('#dxtable tbody').on('click', 'tr td .deactivate-promo', function(e) {
            e.preventDefault();
            var promoid = $(this).data('id');
            var promocode = $(this).data('code');
            var tr = $(this).parent('td').parent('tr');
            Swal.fire({
                title: '<h4 class="lexacle-bold">Deactivate Promo?</h4>',
                icon: 'question',
                html: `Are you sure you want to Deactivate the promo code ${promocode}?`,
                scrollbarPadding: false,
                confirmButtonText: 'Dectivate',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
                showCancelButton: true,
                customClass: {
                    confirmButton: 'btn btn-primary pull-right-swal waves-effect',
                    cancelButton: 'btn btn-success pull-left-swal waves-effect'
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.value) {
                    //tr.addClass('magictime puffIn')
                    socket.emit('deactivate new promo', promoid);
                    socket.on('deactivate new promo', function(response) {
                        socket.off('deactivate new promo');
                        promotions();
                    })
                }
            })
        })
        $('#dxtable tbody').on('click', 'tr td .delete-promo', function(e) {
            e.preventDefault();
            var promoid = $(this).data('id');
            var promocode = $(this).data('code');
            var tr = $(this).parent('td').parent('tr');
            Swal.fire({
                title: '<h4 class="lexacle-bold">Delete Promo?</h4>',
                icon: 'question',
                html: `Are you sure you want to delete the promo ${promocode} from the system? <br>You cannot revert this operation.`,
                scrollbarPadding: false,
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
                showCancelButton: true,
                customClass: {
                    confirmButton: 'btn btn-danger pull-right-swal waves-effect',
                    cancelButton: 'btn btn-success pull-left-swal waves-effect'
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.value) {
                    tr.addClass('magictime holeOut')
                    setTimeout(function() {
                        socket.emit('delete new promo', promoid);
                        socket.on('delete new promo', function(response) {
                            socket.off('delete new promo');
                            promotions();
                        })
                    }, 1000)
                }
            })
        })
    })
    $('.datepicker').bootstrapMaterialDatePicker({
        format: 'dddd DD MMMM YYYY',
        clearButton: true,
        weekStart: 1,
        time: false
    });

    $('.add-promo').unbind().bind('click', function(e) {
        e.preventDefault();
        $('#add-promo-modal').modal('show');
        $('.save-promo').unbind().bind('click', function(e) {
            e.preventDefault();
            $('.save-promo').prop('disabled', true);
            var promocode = $('.pro-code').val().toUpperCase();;
            var discount = $('.pro-discount').val();
            var startdate = $('.pro-start').val();
            var stopdate = $('.pro-stop').val();
            var content = $('.pro-content').val();
            var created = Date.now();
            var status = 0;
            if (promocode === '') {
                $('.pro-code').focus();
                var from = 'top';
                var align = 'right';
                var type = 'warning';
                var icon = 'error';
                var message = 'Please enter the promotion code first in order to proceed';
                var time = 3000;
                md.showNotification(from, align, type, icon, message, time);
            } else if (discount === '' || discount < 0.1) {
                $('.pro-discount').focus();
                var from = 'top';
                var align = 'right';
                var type = 'warning';
                var icon = 'error';
                var message = 'Please enter the promotion discount first in order to proceed';
                var time = 3000;
                md.showNotification(from, align, type, icon, message, time);
            } else if (startdate === '') {
                $('.pro-start').focus();
                var from = 'top';
                var align = 'right';
                var type = 'warning';
                var icon = 'error';
                var message = 'Please enter the promotion start date first in order to proceed';
                var time = 3000;
                md.showNotification(from, align, type, icon, message, time);
            } else if (stopdate === '') {
                $('.pro-stop').focus();
                var from = 'top';
                var align = 'right';
                var type = 'warning';
                var icon = 'error';
                var message = 'Please enter the promotion stop date first in order to proceed';
                var time = 3000;
                md.showNotification(from, align, type, icon, message, time);
            } else {
                var dstart = moment(new Date(startdate)).format('x');
                var dstop = moment(new Date(stopdate)).format('x');
                if (dstop < dstart) {
                    $('.pro-stop').val('').focus();
                } else {
                    if (content === '') {
                        $('.pro-content').focus();
                        var from = 'top';
                        var align = 'right';
                        var type = 'warning';
                        var icon = 'error';
                        var message = 'Please enter the promotion content first in order to proceed';
                        var time = 3000;
                        md.showNotification(from, align, type, icon, message, time);
                    } else {
                        var newpromo = {
                            promocode: promocode,
                            startdate: dstart,
                            stopdate: dstop,
                            discount: discount,
                            content: content,
                            created: created,
                            status: status
                        };
                        socket.emit('add new promo', newpromo);
                        socket.on('add new promo', function(response) {
                            socket.off('add new promo');
                            $('.save-promo').prop('disabled', false);
                            console.log(response)
                            if (response.status !== 0) {
                                var from = 'top';
                                var align = 'right';
                                var type = 'warning';
                                var icon = 'error';
                                var message = response.message;
                                var time = 3000;
                                md.showNotification(from, align, type, icon, message, time);
                            } else {
                                var from = 'top';
                                var align = 'right';
                                var type = 'success';
                                var icon = 'check';
                                var message = 'New promo code has been successfully added to the system';
                                var time = 3000;
                                md.showNotification(from, align, type, icon, message, time);
                                $('#add-promo-modal').modal('hide');
                                $('.pro-code, .pro-discount, .pro-start, .pro-stop, .pro-content').val('');
                                promotions();
                            }
                        })
                    }
                }

            }
        })
    })

}

function notifications() {

    destroyNTable1();
    destroyNTable2();
    destroyNTable3();
    $('.all-rider-notifications, .all-driver-notifications, .all-owner-notifications').html('');
    socket.emit('fetch rider notifications', admin);
    socket.emit('fetch driver notifications', admin);
    socket.emit('fetch owner notifications', admin);
    socket.on('fetch rider notifications', function(response) {
        socket.off('fetch rider notifications');
        var i = 1;
        for (var key in response) {
            if (response[key].xrider.length > 0) {
                if (response[key].status === 1) {
                    var badge = '<span class="badge blue lighten-5 blue-text text-accent-2">Unread</span>';
                } else if (response[key].status === 2) {
                    var badge = '<span class="badge green lighten-5 green-text text-accent-2">Read</span>';
                } else if (response[key].status === 3) {
                    var badge = '<span class="badge pink lighten-5 pink-text text-accent-2">Deleted</span>';
                }
                if (response[key].sender === 'Tufike Pamoja') {
                    var nok = '<i class="f7-icons text-info">bell_fill</i>';
                } else if (response[key].sender === 'Tufike Pamoja Notification') {
                    var nok = '<i class="material-icons text-success">notifications_active</i>';
                } else {
                    var nok = '<i class="f7-icons text-warning">bell_circle_fill</i>';
                }
                if (response[key].userid === freelance) {
                    var nmane = 'All Riders';
                } else {
                    var nmane = `${response[key].xrider[0].firstname} ${response[key].xrider[0].lastname}`;
                }
                var rnot = `
                <tr class="animate__animated animate__fadeIn">
                <td>${nok}</td>
                <td>${nmane}</td>
                <td>${truncateString(response[key].title, 20)}</td>
                <td>${truncateString(response[key].message, 30)}</td>
                <td>${timeConverterDate(response[key].time)} ${timeConverterTime(response[key].time)}</td>
                <td>${badge}</td>
                <td class="td-actions text-right">
                <a href="javascript:void(0)" class="view-notification" data-id="${response[key]._id}" data-name="${nmane}" data-header="${response[key].title}" data-message="${response[key].message}">
                <i class="f7-icons size-20 col-blue-grey">doc_text_search</i>
                </a>
                <a href="javascript:void(0)" class="delete-notification" data-id="${response[key]._id}">
                <i class="f7-icons size-20 col-blue-grey">trash</i>
                </a>
                </td>
                </tr>`;
                $('.all-rider-notifications').append(rnot);
            }
        }
        initNTable1();
        $('#ntable1 tbody').on('click', 'tr td .delete-notification', function(e) {
            e.preventDefault();
            var nid = $(this).data('id');
            var tr = $(this).parent('td').parent('tr');
            Swal.fire({
                title: '<h4 class="lexacle-bold">Delete Notification?</h4>',
                icon: 'question',
                html: `Are you sure you want to delete this notification from the system? <br>You cannot revert this operation.`,
                scrollbarPadding: false,
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
                showCancelButton: true,
                customClass: {
                    confirmButton: 'btn btn-danger pull-right-swal waves-effect',
                    cancelButton: 'btn btn-success pull-left-swal waves-effect'
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.value) {
                    tr.addClass('magictime holeOut')

                    setTimeout(function() {
                        socket.emit('super delete notifications', nid);
                        socket.on('super delete notifications', function(response) {
                            socket.off('super delete notifications');
                            notifications();
                        })
                    }, 1000)
                }
            })
        })

    })
    socket.on('fetch driver notifications', function(response) {
        socket.off('fetch driver notifications');
        var i = 1;
        for (var key in response) {
            if (response[key].xdriver.length > 0) {
                if (response[key].status === 1) {
                    var badge = '<span class="badge blue lighten-5 blue-text text-accent-2">Unread</span>';
                } else if (response[key].status === 2) {
                    var badge = '<span class="badge green lighten-5 green-text text-accent-2">Read</span>';
                } else if (response[key].status === 3) {
                    var badge = '<span class="badge pink lighten-5 pink-text text-accent-2">Deleted</span>';
                }
                if (response[key].sender === 'Tufike Pamoja') {
                    var nok = '<i class="f7-icons text-info">bell_fill</i>';
                } else if (response[key].sender === 'Tufike Pamoja Notification') {
                    var nok = '<i class="material-icons text-success">notifications_active</i>';
                } else {
                    var nok = '<i class="f7-icons text-warning">bell_circle_fill</i>';
                }
                var dname = `${response[key].xdriver[0].firstname} ${response[key].xdriver[0].lastname}`;
                var rnot = `
            <tr class="animate__animated animate__fadeIn">
            <td>${nok}</td>
            <td>${dname}</td>
            <td>${truncateString(response[key].title, 20)}</td>
            <td>${truncateString(response[key].message, 30)}</td>
            <td>${timeConverterDate(response[key].time)} ${timeConverterTime(response[key].time)}</td>
            <td>${badge}</td>
            <td class="td-actions text-right">
            <a href="javascript:void(0)" class="view-notification" data-id="${response[key]._id}" data-name="${dname}" data-header="${response[key].title}" data-message="${response[key].message}">
            <i class="f7-icons size-20 col-blue-grey">doc_text_search</i>
            </a>
            <a href="javascript:void(0)" class="delete-notification" data-id="${response[key]._id}">
            <i class="f7-icons size-20 col-blue-grey">trash</i>
            </a>
            </td>
            </tr>`;
                $('.all-driver-notifications').append(rnot);
            }
        }
        initNTable2();
        $('#ntable2 tbody').on('click', 'tr td .delete-notification', function(e) {
            e.preventDefault();
            var nid = $(this).data('id');
            var tr = $(this).parent('td').parent('tr');
            Swal.fire({
                title: '<h4 class="lexacle-bold">Delete Notification?</h4>',
                icon: 'question',
                html: `Are you sure you want to delete this notification from the system? <br>You cannot revert this operation.`,
                scrollbarPadding: false,
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
                showCancelButton: true,
                customClass: {
                    confirmButton: 'btn btn-danger pull-right-swal waves-effect',
                    cancelButton: 'btn btn-success pull-left-swal waves-effect'
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.value) {
                    tr.addClass('magictime holeOut')

                    setTimeout(function() {
                        socket.emit('super delete notifications', nid);
                        socket.on('super delete notifications', function(response) {
                            socket.off('super delete notifications');
                            notifications();
                        })
                    }, 1000)
                }
            })
        })
    })
    socket.on('fetch owner notifications', function(response) {
        socket.off('fetch owner notifications');
        console.log(response)
        var i = 1;
        for (var key in response) {
            if (response[key].xowner.length > 0) {
                if (response[key].status === 1) {
                    var badge = '<span class="badge blue lighten-5 blue-text text-accent-2">Unread</span>';
                } else if (response[key].status === 2) {
                    var badge = '<span class="badge green lighten-5 green-text text-accent-2">Read</span>';
                } else if (response[key].status === 3) {
                    var badge = '<span class="badge pink lighten-5 pink-text text-accent-2">Deleted</span>';
                }
                if (response[key].sender === 'Tufike Pamoja') {
                    var nok = '<i class="f7-icons text-info">bell_fill</i>';
                } else if (response[key].sender === 'Tufike Pamoja Notification') {
                    var nok = '<i class="material-icons text-success">notifications_active</i>';
                } else {
                    var nok = '<i class="f7-icons text-warning">bell_circle_fill</i>';
                }
                var oname = `${response[key].xowner[0].firstname} ${response[key].xowner[0].lastname}`;
                var rnot = `
            <tr class="animate__animated animate__fadeIn">
            <td>${nok}</td>
            <td>${oname}</td>
            <td>${truncateString(response[key].title, 20)}</td>
            <td>${truncateString(response[key].message, 30)}</td>
            <td>${timeConverterDate(response[key].time)} ${timeConverterTime(response[key].time)}</td>
            <td>${badge}</td>
            <td class="td-actions text-right">
            <a href="javascript:void(0)" class="view-notification" data-id="${response[key]._id}" data-name="${oname}" data-header="${response[key].title}" data-message="${response[key].message}">
            <i class="f7-icons size-20 col-blue-grey">doc_text_search</i>
            </a>
            <a href="javascript:void(0)" class="delete-notification" data-id="${response[key]._id}">
            <i class="f7-icons size-20 col-blue-grey">trash</i>
            </a>
            </tr>`;
                $('.all-owner-notifications').append(rnot);
            }
        }
        initNTable3();
        $('#ntable3 tbody').on('click', 'tr td .delete-notification', function(e) {
            e.preventDefault();
            var nid = $(this).data('id');
            var tr = $(this).parent('td').parent('tr');
            Swal.fire({
                title: '<h4 class="lexacle-bold">Delete Notification?</h4>',
                icon: 'question',
                html: `Are you sure you want to delete this notification from the system? <br>You cannot revert this operation.`,
                scrollbarPadding: false,
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
                showCancelButton: true,
                customClass: {
                    confirmButton: 'btn btn-danger pull-right-swal waves-effect',
                    cancelButton: 'btn btn-success pull-left-swal waves-effect'
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.value) {
                    tr.addClass('magictime holeOut')

                    setTimeout(function() {
                        socket.emit('super delete notifications', nid);
                        socket.on('super delete notifications', function(response) {
                            socket.off('super delete notifications');
                            notifications();
                        })
                    }, 1000)
                }
            })
        })
    })
}

function payments() {

    $('.refresh-data').css('display', 'none');
    destroyDataTable();
    destroyTransactionsTable();
    NProgress.start();
    socket.emit('fetch mobile transactions', admin);
    socket.on('fetch mobile transactions', function(response) {
        socket.off('fetch mobile transactions');
        console.log(response)
    })
    socket.emit('fetch all payments', admin);
    socket.on('fetch all payments', function(response) {
        socket.off('fetch all payments');
        NProgress.done();
        $('.refresh-data').css('display', 'block');
        $('.all-payments').html('');
        var i = 1;
        console.log(response)
        for (var key in response) {
            var pid = i++;
            var driverid = response[key].xdriver._id;
            var vehicleid = response[key].xvehicle._id;
            var drivername = response[key].xdriver.firstname + ' ' + response[key].xdriver.lastname;
            var ownername = response[key].xvehicle.firstname + ' ' + response[key].xvehicle.lastname;
            var driverphone = response[key].xdriver.phone;
            var ownerphone = response[key].xvehicle.phone;
            var vehicleplate = response[key].xvehicle.plate;
            var total = response[key].totalAmount;
            var created = timeConverterDate(response[key].created);
            var xpayments = response[key].xpayments;
            var rides = response[key].rides;
            var paid = 0;
            if (response[key].xpayments.length === 0) {
                paid = 0
            } else {
                for (var coy in xpayments) {
                    tpaid = xpayments[coy].amount;
                    paid += tpaid;
                }

            }
            var balance = (total - paid);
            var pdata = `
            <tr>
            <td>${pid}</td>
            <td>${drivername}</td>
            <td>${driverphone}</td>
            <td>${ownername}</td>
            <td>${ownerphone}</td>
            <td>${vehicleplate}</td>
            <td>${rides}</td>
            <td>KES. ${total}</td>
            <td>KES. ${paid}</td>
            <td>KES. ${balance}</td>
            <td>${created}</td>
            <td class="td-actions text-right">
            <a href="javascript:void(0)" class="receive-payment" data-did="${driverid}" data-vid="${vehicleid}" data-name="${drivername}" data-phone="${driverphone}" data-plates="${vehicleplate}">
            <i class="f7-icons col-blue-grey size-20">plus_circle</i>
            </a>
            </td>
            </tr>`;
            $('.all-payments').append(pdata);
        }
        initDataTable();
        $('#dtable tbody').on('click', 'tr td .receive-payment', function(e) {
            e.preventDefault();
            var did = $(this).data('did');
            var vid = $(this).data('vid');
            var dname = $(this).data('name');
            var dphone = $(this).data('phone');
            var vplates = $(this).data('plates');
            $('.mod-driver-phone').html(dphone);
            $('.mod-driver-name').html(dname);
            $('.mod-vehicle-plates').html(vplates);
            $('#modal-driver-payment').modal('show');
            $('.amount-received').focus();
            $('.accept-payment').unbind().bind('click', function(e) {
                e.preventDefault();
                var payamount = $('.amount-received').val();
                var paycode = $('.transaction-code').val();
                if (payamount === '') {
                    $('.amount-received').focus();
                    var from = 'top';
                    var align = 'right';
                    var type = 'warning';
                    var icon = 'error';
                    var message = 'Please enter the amount received from the driver to proceed';
                    var time = 3000;
                    md.showNotification(from, align, type, icon, message, time);
                } else if (payamount === 0 || payamount < 0) {
                    $('.amount-received').focus();
                    var from = 'top';
                    var align = 'right';
                    var type = 'warning';
                    var icon = 'error';
                    var message = 'You can not receive Ksh. 0 or Less. Negatives are not allowed.';
                    var time = 3000;
                    md.showNotification(from, align, type, icon, message, time);
                } else if (paycode === '') {
                    $('.transaction-code').focus();
                    var from = 'top';
                    var align = 'right';
                    var type = 'warning';
                    var icon = 'error';
                    var message = 'Please enter the payment transaction code to proceed.';
                    var time = 3000;
                    md.showNotification(from, align, type, icon, message, time);
                } else {
                    var payload = {
                        cashier: aid,
                        driver: did,
                        vehicle: vid,
                        amount: payamount,
                        code: paycode,
                        created: Date.now(),
                        status: 1
                    };
                    NProgress.start();
                    socket.emit('receive driver payments', payload);
                    socket.on('receive driver payments', function(response) {
                        socket.off('receive driver payments');
                        NProgress.done();
                        $('.amount-received, .transaction-code').val('');
                        $('#modal-driver-payment').modal('hide');
                        var from = 'top';
                        var align = 'right';
                        var type = 'success';
                        var icon = 'check';
                        var message = 'KSH. ' + response.amount + ' has been credited to Tufike Pamoja Cabs just now.';
                        var time = 3000;
                        md.showNotification(from, align, type, icon, message, time);
                        payments();
                    })

                }
            })
        })
        socket.emit('fetch payment transactions', admin);
        socket.on('fetch payment transactions', function(response) {
            socket.off('fetch payment transactions');
            var i = 1;
            for (var key in response) {
                var pid = i++;
                var tid = response[key]._id;
                var pphoto = `<img width="30" src="${appUrl}/assets/drivers/avatars/${response[key].pdriver.photo}"/>`;
                var pname = response[key].pdriver.firstname + ' ' + response[key].pdriver.lastname;
                var pphone = response[key].pdriver.phone;
                var pplate = response[key].pvehicle.plate;
                var pamount = response[key].amount;
                var pcode = response[key].code;
                var created = timeConverterDate(response[key].created) + ' ' + timeConverterTime(response[key].created);
                var paidin = `
                <tr>
                <td>${pid}</td>
                <td>${pphoto} ${pname}</td>
                <td>${pphone}</td>
                <td>${pplate}</td>
                <td>KES. ${pamount}</td>
                <td>${pcode}</td>
                <td>${created}</td>
                <td class="td-actions text-right">
                <a href="javascript:void(0)" class="delete-payment" data-id="${tid}" data-name="${pname}" data-amount="${pamount}" data-plates="${pplate}">
                <i class="f7-icons col-blue-grey size-20">trash</i>
                </a>
                </td>
                </tr>`;
                $('.all-transactions').append(paidin);
            }
            initTransactionsTable();
            $('#transactionstable tbody').on('click', 'tr td .delete-payment', function(e) {
                e.preventDefault();
                var tid = $(this).data('id');
                var tname = $(this).data('name');
                var tamount = $(this).data('amount');
                var tplate = $(this).data('plates');
                var tr = $(this).parent('td').parent('tr')
                Swal.fire({
                    title: '<h4 class="lexacle-bold">Delete Transaction <b>' + tplate + '</b></h4>',
                    icon: 'question',
                    html: `Delete ${tname}'s payment transaction of KES. ${tamount}?<br> You cannot undo this operation.`,
                    scrollbarPadding: false,
                    confirmButtonText: 'Proceed',
                    cancelButtonText: 'Cancel',
                    reverseButtons: true,
                    showCancelButton: true,
                    customClass: {
                        confirmButton: 'btn btn-danger pull-right-swal waves-effect',
                        cancelButton: 'btn btn-success pull-left-swal waves-effect'
                    },
                    buttonsStyling: false
                }).then((result) => {
                    console.log(result)
                    if (result.value) {
                        tr.addClass('magictime holeOut')
                        socket.emit('delete old transaction', tid);
                        socket.on('delete old transaction', function(response) {
                            socket.off('delete old transaction');
                            setTimeout(function() {
                                payments();
                            }, 1000)
                        })
                    }
                })
            })
        })
        $('.refresh-data').unbind().bind('click', function(e) {
            e.preventDefault();
            payments();
        })
    })
}


function support() {
    const selector = document.querySelector('.mholder')
    setTimeout(function() {
        selector.classList.remove('hidden')
        selector.classList.add('magictime', 'spaceInUp')
    }, 1000)

    $('.all-contacts-list').html('');
    socket.emit('fetch support riders', admin);
    socket.on('fetch support riders', function(response) {
        socket.off('fetch support riders');
        for (var key in response) {
            var account = 'rider';
            var luka = 'Rider';
            var loca = 'riders';
            var chatname = truncateString(response[key].firstname, 20) + ' ' + truncateString(response[key].lastname, 20);
            var chatnamex = response[key].firstname + ' ' + response[key].lastname;
            var contact1 = `<li class="single-chat animate__animated animate__fadeIn" data-name="${chatnamex}" data-id="${response[key]._id}" data-photo="${response[key].photo}" data-plum="${luka}" data-purge="rider" data-account="${loca}">
            <div class="item-content">
            <div class="item-media">
            <img src="${appUrl}/assets/${loca}/avatars/${response[key].photo}" width="40"/>
            </div>
            <div class="item-inner">
            <div class="item-title-row">
            <div class="item-title">${chatname} <span class="item-time">${luka}</span></div>
            </div>
            <div class="item-subtitle">Member Since ${timeConverterDate(response[key].created)} ${timeConverterTime(response[key].created)}</div>
            </div>
            </div>
            </li>`;
            $('.all-contacts-list').append(contact1);
        }
        socket.emit('fetch support drivers', admin);
        socket.on('fetch support drivers', function(response) {
            socket.off('fetch support drivers');
            for (var key in response) {
                var account = 'driver';
                var luka = 'Driver';
                var loca = 'drivers';
                var chatname = truncateString(response[key].firstname, 20) + ' ' + truncateString(response[key].lastname, 20);
                var chatnamex = response[key].firstname + ' ' + response[key].lastname;
                var contact2 = `<li class="single-chat animate__animated animate__fadeIn" data-name="${chatnamex}" data-id="${response[key]._id}" data-photo="${response[key].photo}" data-plum="${luka}" data-purge="owner" data-account="${loca}">
                <div class="item-content">
                <div class="item-media">
                <img src="${appUrl}/assets/${loca}/avatars/${response[key].photo}" width="40"/>
                </div>
                <div class="item-inner">
                <div class="item-title-row">
                <div class="item-title">${chatname} <span class="item-time">${luka}</span></div>
                </div>
                <div class="item-subtitle">Member Since ${timeConverterDate(response[key].created)} ${timeConverterTime(response[key].created)}</div>
                </div>
                </div>
                </li>`;
                $('.all-contacts-list').append(contact2);
            }
            socket.emit('fetch support owners', admin);
            socket.on('fetch support owners', function(response) {
                socket.off('fetch support owners');
                for (var key in response) {
                    var account = 'owner';
                    var luka = 'Owner';
                    var loca = 'vehicles';
                    var chatname = truncateString(response[key].firstname, 20) + ' ' + truncateString(response[key].lastname, 20);
                    var chatnamex = response[key].firstname + ' ' + response[key].lastname;
                    var contact3 = `<li class="single-chat animate__animated animate__fadeIn" data-name="${chatnamex}" data-id="${response[key]._id}" data-photo="${response[key].photo}" data-plum="${luka}" data-purge="vehicle" data-account="${loca}">
                    <div class="item-content">
                    <div class="item-media">
                    <img src="${appUrl}/assets/${loca}/avatars/${response[key].photo}" width="40"/>
                    </div>
                    <div class="item-inner">
                    <div class="item-title-row">
                    <div class="item-title">${chatname} <span class="item-time">${luka}</span></div>
                    </div>
                    <div class="item-subtitle">Member Since ${timeConverterDate(response[key].created)} ${timeConverterTime(response[key].created)}</div>
                    </div>
                    </div>
                    </li>`;
                    $('.all-contacts-list').append(contact3);
                }
                socket.emit('fetch support contacts', admin)
                socket.on('fetch support contacts', function(response) {
                    socket.off('fetch support contacts');
                    $('.refresh-data').unbind().bind('click', function(e) {
                        e.preventDefault();
                        support();
                    })
                    $('.contact-list').html('');
                    for (var key in response) {
                        var account = response[key].account;
                        if (account === 'rider') {
                            var loca = 'riders';
                            var luka = 'Rider';
                        } else if (account === 'driver') {
                            var loca = 'drivers';
                            var luka = 'Driver';
                        } else if (account === 'owner') {
                            var loca = 'vehicles';
                            var luka = 'Vehicle Owner';
                        }
                        var atime = response[key].time;
                        var mtype = response[key].messagetype;
                        var ntime = Date.now();
                        var btime = ((ntime - atime) / 60000).toFixed(0);
                        if (btime < 1400) {
                            var xtime = timeConverterTime(atime);
                        } else {
                            var xtime = timeConverterDate(atime);
                        }
                        var chatname = truncateString(response[key].sendername, 20);
                        var contact = `<li class="single-chat animate__animated animate__fadeIn" data-name="${response[key].sendername}" data-id="${response[key].userid}" data-photo="${response[key].senderphoto}" data-plum="${luka}" data-purge="${response[key].account}" data-account="${loca}">
                        <div class="item-content">
                        <div class="item-media">
                        <img src="${appUrl}/assets/${loca}/avatars/${response[key].senderphoto}" width="40"/>
                        </div>
                        <div class="item-inner">
                        <div class="item-title-row">
                        <div class="item-title">${response[key].sendername} <span class="item-time">${xtime}</span></div>
                        </div>
                        <div class="item-subtitle">${response[key].message}</div>
                        </div>
                        </div>
                        </li>`;
                        $('.contact-list').append(contact);
                    }
                    $('.single-chat').unbind().bind('click', function(e) {
                        e.preventDefault();
                        socket.off('send support');
                        $('.mboard').removeClass('hidden')
                        $('.mholder').addClass('hidden')
                        var uname = $(this).data('name');
                        var uid = $(this).data('id');
                        var uphoto = $(this).data('photo');
                        var ufolder = $(this).data('account');
                        var upurge = $(this).data('purge');
                        var uplum = $(this).data('plum');
                        var chatname = truncateString(uname, 20);
                        $('.single-chat').each(function() {
                            $('.single-chat').removeClass('active');
                        })
                        $(this).addClass('active');
                        $('.chat-user-name').html(`<img src="${appUrl}/assets/${ufolder}/avatars/${uphoto}" class="mini-avatar"/> Chat with ${uname} - Tufike Pamoja ${uplum}`);
                        $('.chat-user-text').focus();
                        NProgress.start();
                        socket.on('send support', function(trend) {
                            if (trend.userid === uid) {
                                $('.recent-chats').append(`<div class ="chat-container-sent animate__animated animate__fadeIn">
                                    <div class ="chat-avatar">
                                    <img src="${appUrl}/assets/${ufolder}/avatars/${uphoto}" alt="">
                                    </div>
                                    <div class="chat-content">
                                    <div class="chat-header"><span class="chat-name">${uname}</span><span class="chat-time">${timeConverterTime(trend.time)}</span></div>
                                    <div class="chat-text">
                                    ${trend.message}
                                    </div>
                                    <div class="chat-date">${timeConverterDate(trend.time)}</div>
                                    </div>
                                    </div>`).animate({
                                    scrollTop: $('.recent-chats').prop('scrollHeight')
                                }, 1000);
                            }
                        })

                        socket.emit('fetch support messages', uid);
                        socket.on('fetch support messages', function(response) {
                            socket.off('fetch support messages');
                            NProgress.done();
                            $('.recent-chats').html('')
                            for (var key in response) {
                                var account = response[key].account;
                                if (response[key].messagetype === 'sent') {
                                    var avatar = `<img src="${appUrl}/assets/${ufolder}/avatars/${uphoto}" alt="">`;
                                    var xchatname = chatname;
                                } else {
                                    var avatar = `<img src="${appUrl}/assets/admin/avatars/icon.png" alt="">`;
                                    var xchatname = response[key].receivername;
                                }
                                var nmessage = `<div class ="animate__animated animate__fadeIn chat-container-${response[key].messagetype}">
                                <div class ="chat-avatar">
                                ${avatar}
                                </div>
                                <div class="chat-content">
                                <div class="chat-header"><span class="chat-name">${xchatname}</span><span class="chat-time">${timeConverterTime(response[key].time)}</span></div>
                                <div class="chat-text">
                                ${response[key].message}
                                </div>
                                <div class="chat-date">${timeConverterDate(response[key].time)}</div>
                                </div>
                                </div>`;
                                $('.recent-chats').append(nmessage);
                            }
                            $('.recent-chats').animate({
                                scrollTop: $('.recent-chats').prop('scrollHeight')
                            }, 1000);
                        })
                        $(".chat-user-text").enterKey(function(e) {
                            e.preventDefault();
                            tmessage = $('.chat-user-text').val();
                            if (tmessage === '') {
                                $('.chat-user-text').focus();
                                var from = 'top';
                                var align = 'right';
                                var type = 'warning';
                                var icon = 'error';
                                var message = 'Please enter your chat message first before sending';
                                var time = 3000;
                                md.showNotification(from, align, type, icon, message, time);
                            } else {
                                $('.send-support').html(`<img src="${appUrl}/assets/admin/img/preloaders/oval.svg" width="20"/>`);
                                tname = uname;
                                ttime = Date.now();
                                tphoto = uphoto;
                                tstatus = 1;
                                taccount = upurge;
                                tmee = 'Tufike Pamoja';
                                var xmessage = {
                                    userid: uid,
                                    sendername: tname,
                                    receivername: tmee,
                                    messagetype: 'received',
                                    message: tmessage,
                                    senderphoto: tphoto,
                                    status: tstatus,
                                    account: taccount,
                                    time: ttime
                                };
                                console.log(xmessage)
                                socket.emit('receive support', xmessage);
                                socket.on('support sent', function(response) {
                                    socket.off('support sent');
                                    $('.chat-user-text').val('');
                                    $('.chat-user-text').focus();
                                    $('.send-support').html(``);
                                    $('.recent-chats').append(`<div class ="chat-container-received animate__animated animate__fadeIn">
                                        <div class ="chat-avatar">
                                        <img src="${appUrl}/assets/admin/avatars/icon.png" alt="">
                                        </div>
                                        <div class="chat-content">
                                        <div class="chat-header"><span class="chat-name">${tmee}</span><span class="chat-time">${timeConverterTime(ttime)}</span></div>
                                        <div class="chat-text">
                                        ${tmessage}
                                        </div>
                                        <div class="chat-date">${timeConverterDate(ttime)}</div>
                                        </div>
                                        </div>`).animate({
                                        scrollTop: $('.recent-chats').prop('scrollHeight')
                                    }, 1000);
                                })

                            }
                        })
                    })
                })
            })
        })
    })



}

function distress() {
    NProgress.start();
    destroyDataTable();
    $('.all-distresses').html('');
    socket.emit('fetch distress alerts', admin);
    socket.on('fetch distress alerts', function(response) {
        socket.off('fetch distress alerts');
        NProgress.done();
        console.log(response)
        var i = 1;
        for (var key in response) {
            var ldriver = response[key].driver.location.coordinates[1] + ',' + response[key].driver.location.coordinates[0];
            var lrider = response[key].rider.location.coordinates[1] + ',' + response[key].rider.location.coordinates[0];
            if (response[key].riderid === freelance) {
                ridername = 'Unregistered Rider';
            } else {
                ridername = response[key].rider.firstname + ' ' + response[key].rider.lastname;
            }
            if (response[key].status === 1) {
                distatus = '<span class="badge pink lighten-5 pink-text text-accent-2">Pending</span>';
            } else if (response[key].status === 2) {
                distatus = '<span class="badge blue lighten-5 blue-text text-accent-2">Active</span>';
            } else if (response[key].status === 3) {
                distatus = '<span class="badge green lighten-5 green-text text-accent-2">Resolved</span>';
            } else if (response[key].status === 4) {
                distatus = '<span class="badge blue lighten-5 blue-text text-accent-2">Dismissed</span>';
            } else if (response[key].status === 5) {
                distatus = '<span class="badge pink lighten-5 pink-text text-accent-2">Deleted</span>';
            }
            var tr = `<tr class="animate__animated animate__fadeIn">
          <td>${i++}</td>
          <td>${ridername}</td>
          <td>${response[key].driver.firstname} ${response[key].driver.lastname}</td>
          <td>${response[key].initiator}</td>
          <td>${truncateString(response[key].ride.origin,30)}</td>
          <td>${truncateString(response[key].ride.destination,30)}</td>
          <td>${response[key].driver.phone}</td>
          <td>${timeConverterDate(response[key].created)} ${timeConverterTime(response[key].created)}</td>
          <td>${distatus}</td>
          <td class="td-actions text-right">
          <a href="javascript:void(0)" class="locate-distress" data-id="${response[key]._id}" data-rid="${response[key].ride._id}" data-driverid="${response[key].ride.driver}" data-riderid="${response[key].ride.rider}" data-ldriver="${ldriver}" data-lrider="${lrider}" data-origin="${response[key].ride.position.origin}" data-destination="${response[key].ride.position.destination}" data-driveremail="${response[key].driver.email}" data-driverphone="${response[key].driver.phone}" data-rideremail="${response[key].rider.email}" data-riderphone="${response[key].rider.phone}" data-drivername="${response[key].driver.firstname} ${response[key].driver.lastname}" data-ridername="${response[key].rider.firstname} ${response[key].rider.lastname}" data-initiator="${response[key].initiator}">
          <i class="material-icons size-25 col-pink">my_location</i>
          </a>
          <a href="javascript:void(0)" class="intercept-distress" data-id="${response[key]._id}" data-rid="${response[key].ride._id}" data-driverid="${response[key].ride.driver}" data-riderid="${response[key].ride.rider}" data-ldriver="${ldriver}" data-lrider="${lrider}" data-origin="${response[key].ride.position.origin}" data-destination="${response[key].ride.position.destination}" data-driveremail="${response[key].driver.email}" data-driverphone="${response[key].driver.phone}" data-rideremail="${response[key].rider.email}" data-riderphone="${response[key].rider.phone}" data-drivername="${response[key].driver.firstname} ${response[key].driver.lastname}" data-ridername="${response[key].rider.firstname} ${response[key].rider.lastname}" data-initiator="${response[key].initiator}">
          <i class="f7-icons size-25 col-blue">waveform_path</i>
          </a>
          <a href="javascript:void(0)" class="resolve-distress" data-id="${response[key]._id}" data-rid="${response[key].ride._id}" data-driverid="${response[key].ride.driver}" data-riderid="${response[key].ride.rider}" data-ldriver="${ldriver}" data-lrider="${lrider}" data-origin="${response[key].ride.position.origin}" data-destination="${response[key].ride.position.destination}" data-driveremail="${response[key].driver.email}" data-driverphone="${response[key].driver.phone}" data-rideremail="${response[key].rider.email}" data-riderphone="${response[key].rider.phone}" data-drivername="${response[key].driver.firstname} ${response[key].driver.lastname}" data-ridername="${response[key].rider.firstname} ${response[key].rider.lastname}" data-initiator="${response[key].initiator}">
          <i class="material-icons size-25 col-green">check</i>
          </a>
          <a href="javascript:void(0)" class="dismiss-distress" data-id="${response[key]._id}" data-email="${response[key].driver.email}" data-phone="${response[key].driver.phone}" data-drivername="${response[key].driver.firstname} ${response[key].driver.lastname}" data-ridername="${response[key].rider.firstname} ${response[key].rider.lastname}" data-initiator="${response[key].initiator}">
          <i class="material-icons size-25 col-orange">close</i>
          </a>
          <a href="javascript:void(0)" class="delete-distress" data-id="${response[key]._id}" data-email="${response[key].driver.email}" data-phone="${response[key].driver.phone}" data-drivername="${response[key].driver.firstname} ${response[key].driver.lastname}" data-ridername="${response[key].rider.firstname} ${response[key].rider.lastname}" data-initiator="${response[key].initiator}">
          <i class="f7-icons size-20 col-red">trash</i>
          </a>
          </td>
          </tr>`;
            $('.all-distresses').append(tr);
        }
        initDataTable();
        $('.locate-distress').unbind().bind('click', function(e) {
            e.preventDefault();
            var did = $(this).data('did');
            var rid = $(this).data('rid');
            var coorigin = $(this).data('origin');
            var codestination = $(this).data('destination');
            var initiator = $(this).data('initiator');
            if (initiator === 'Driver') {
                var coinitiator = $(this).data('driverlocation');
                var cophone = $(this).data('driverphone');
                var colocation = $(this).data('ldriver');
                var codriverid = $(this).data('driverid');
                var cosocket = 'driver';
            } else {
                var coinitiator = $(this).data('riderlocation');
                var cophone = $(this).data('riderphone');
                var colocation = $(this).data('lrider');
                var codriverid = $(this).data('riderid');
                var cosocket = 'rider';
            }
            $('.map-title').html(`<h4 class="card-title text-success m-0 p-0">
    <img src="${appUrl}/assets/admin/img/icons/green-point.png" style="width: 30px;"/>
    <b>Distress alert initiated from Tufike Pamoja ${initiator} - ${cophone}</b>
    </h4>`);
            getDirections(coorigin, codestination, colocation, codriverid, cosocket);
            console.log('locating distress')
            $('#modal-enroute').modal('show');
        })
        $('.intercept-distress').unbind().bind('click', function(e) {
            e.preventDefault();
            var distressid = $(this).data('id');
            var initiator = $(this).data('initiator');
            if (initiator === 'Driver') {
                var initiatorname = $(this).data('drivername');
            } else {
                var initiatorname = $(this).data('ridername');
            }
            Swal.fire({
                title: '<h4 class="lexacle-bold">Intercept Distress Alert?</h4>',
                icon: 'question',
                html: `Initited by the ${initiator} - ${initiatorname}. <br>Do you wish to proceed?`,
                scrollbarPadding: false,
                confirmButtonText: 'Intercept',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
                showCancelButton: true,
                customClass: {
                    confirmButton: 'btn btn-success pull-right-swal waves-effect',
                    cancelButton: 'btn btn-danger pull-left-swal waves-effect'
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.value) {
                    socket.emit('intercept distress alert', distressid);
                    socket.on('intercept distress alert', function(response) {
                        socket.off('intercept distress alert');
                        distress();
                        var from = 'top';
                        var align = 'right';
                        var type = 'success';
                        var icon = 'check';
                        var message = initiator + '\'s distress alert has been successfully intercepted';
                        var time = 3000;
                        md.showNotification(from, align, type, icon, message, time);
                    })
                }
            })
        })
        $('.resolve-distress').unbind().bind('click', function(e) {
            e.preventDefault();
            var distressid = $(this).data('id');
            var initiator = $(this).data('initiator');
            if (initiator === 'Driver') {
                var initiatorname = $(this).data('drivername');
            } else {
                var initiatorname = $(this).data('ridername');
            }
            Swal.fire({
                title: '<h4 class="lexacle-bold">Resolve Distress Alert?</h4>',
                icon: 'question',
                html: `Initited by the ${initiator} - ${initiatorname}. <br>Do you wish to proceed?`,
                scrollbarPadding: false,
                confirmButtonText: 'Resolve',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
                showCancelButton: true,
                customClass: {
                    confirmButton: 'btn btn-success pull-right-swal waves-effect',
                    cancelButton: 'btn btn-danger pull-left-swal waves-effect'
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.value) {
                    socket.emit('resolve distress alert', distressid);
                    socket.on('resolve distress alert', function(response) {
                        socket.off('resolve distress alert');
                        distress();
                        var from = 'top';
                        var align = 'right';
                        var type = 'success';
                        var icon = 'check';
                        var message = initiator + '\'s distress alert has been successfully resolved';
                        var time = 3000;
                        md.showNotification(from, align, type, icon, message, time);
                    })
                }
            })
        })
        $('.dismiss-distress').unbind().bind('click', function(e) {
            e.preventDefault();
            var distressid = $(this).data('id');
            var initiator = $(this).data('initiator');
            if (initiator === 'Driver') {
                var initiatorname = $(this).data('drivername');
            } else {
                var initiatorname = $(this).data('ridername');
            }
            Swal.fire({
                title: '<h4 class="lexacle-bold">Dismiss Distress Alert?</h4>',
                icon: 'question',
                html: `Initited by the ${initiator} - ${initiatorname}. <br>Do you wish to proceed?`,
                scrollbarPadding: false,
                confirmButtonText: 'Dismiss',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
                showCancelButton: true,
                customClass: {
                    confirmButton: 'btn btn-danger pull-right-swal waves-effect',
                    cancelButton: 'btn btn-success pull-left-swal waves-effect'
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.value) {
                    socket.emit('dismiss distress alert', distressid);
                    socket.on('dismiss distress alert', function(response) {
                        socket.off('dismiss distress alert');
                        distress();
                        var from = 'top';
                        var align = 'right';
                        var type = 'success';
                        var icon = 'check';
                        var message = initiator + '\'s distress alert has been successfully dismissed';
                        var time = 3000;
                        md.showNotification(from, align, type, icon, message, time);
                    })
                }
            })
        })
        $('.delete-distress').unbind().bind('click', function(e) {
            e.preventDefault();
            var initiator = $(this).data('initiator');
            var distressid = $(this).data('id');
            if (initiator === 'Driver') {
                var initiatorname = $(this).data('drivername');
            } else {
                var initiatorname = $(this).data('ridername');
            }
            Swal.fire({
                title: '<h4 class="lexacle-bold">Delete Distress Alert?</h4>',
                icon: 'question',
                html: `Initited by the ${initiator} - ${initiatorname}. <br>Do you wish to proceed?`,
                scrollbarPadding: false,
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
                showCancelButton: true,
                customClass: {
                    confirmButton: 'btn btn-danger pull-right-swal waves-effect',
                    cancelButton: 'btn btn-success pull-left-swal waves-effect'
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.value) {
                    socket.emit('delete distress alert', distressid);
                    socket.on('delete distress alert', function(response) {
                        socket.off('delete distress alert');
                        distress();
                        var from = 'top';
                        var align = 'right';
                        var type = 'success';
                        var icon = 'check';
                        var message = initiator + '\'s distress alert has been successfully deleted';
                        var time = 3000;
                        md.showNotification(from, align, type, icon, message, time);
                    })
                }
            })
        })
        $('.refresh-data').unbind().bind('click', function(e) {
            e.preventDefault();
            distress();
        })
    })
}

function profile() {

}

function settings() {
    NProgress.start();
    $('.refresh-data').css('display', 'none');
    socket.emit('cloud dropbox stats', admin);
    socket.on('cloud dropbox stats', function(data) {
        socket.off('cloud dropbox stats');
        if (data.status) {
            $('.dp-size-stats').html(`Disconnected`);
            var prowidth = (used / allocated * 100).toFixed(0);
            $('.dp-pro').css('width', '0%');
        } else {
            var response = JSON.parse(data);
            var used = (response.used / (1e+9)).toFixed(1);
            var allocated = (response.allocation.allocated / (1e+9)).toFixed(1);
            $('.dp-size-stats').html(`${used} GB / ${allocated} GB`);
            var prowidth = (used / allocated * 100).toFixed(0);
            $('.dp-pro').css('width', prowidth + '%');
        }
    })
    socket.emit('cloud database stats', admin);
    socket.on('cloud database stats', function(response) {
        socket.off('cloud database stats');
        var dbsize = response.dataSize / 1024;
        var prowidth = ((dbsize / 1024) / 512 * 100).toFixed(0);
        console.log(prowidth + ' Percentile')
        $('.db-pro').css('width', prowidth + '%');
        if (dbsize > 512) {
            $('.db-size-stats').html(`${Math.round(dbsize/1024)} MB / 512 MB`);
        } else {
            $('.db-size-stats').html(`${Math.round(dbsize)} KB / 512 MB`);
        }
    })
    socket.emit('cloud ssd stats', admin);
    socket.on('cloud ssd stats', function(response) {
        socket.off('cloud ssd stats');
        var totalGB = Math.round((response.size / (1e+9)));
        var freeGB = Math.round((response.free / (1e+9)));
        var usedGB = totalGB - freeGB;
        var prowidth = ((usedGB / (928)) * 100).toFixed(0);
        var prowidthx = ((usedGB / (totalGB)) * 100).toFixed(0);
        $('.ssd-pro').css('width', prowidth + '%');
        $('.ssd-size-stats').html(`${usedGB} GiB / ${928} GiB`);
        $('.drive-pro').css('width', prowidthx + '%');
        $('.drive-size-stats').html(`${usedGB} GB / ${totalGB} GB`);
    })
    socket.emit('fetch system settings', admin);
    socket.on('fetch system settings', function(response) {
        socket.off('fetch system settings');
        console.log(response)
        $('.refresh-data').css('display', 'block');
        NProgress.done();
        $('.dphone').val(response.setphone);
        $('.demail').val(response.setmail);
        $('.dcash').val(response.setperpoint);
        $('.dminpoints').val(response.setminredeem);
        $('.dmaxpoints').val(response.setmaxredeem);
        $('.dmaxrides').val(response.setrides);
        $('.dchat').val(response.setchat);
        $('.dcronfs').val(response.setcronfs);
        $('.dcrondb').val(response.setcrondb);
        $('.dcronpn').val(response.setcronpn);
        $('.near-rider').val(response.setnrider);
        $('.near-driver').val(response.setndriver);
        if(response.setmpesa === 1){$('.smpesa').prop('checked',true);}else{$('.smpesa').prop('checked',false);}
        if(response.setcard === 1){$('.scard').prop('checked',true);}else{$('.scard').prop('checked',false);}
        if(response.setpoints === 1){$('.spoints').prop('checked',true);}else{$('.spoints').prop('checked',false);}
        if(response.setpromo === 1){$('.spromo').prop('checked',true);}else{$('.spromo').prop('checked',false);}
        var sliderRiders = document.querySelector('.nouislider-range-riders');
        noUiSlider.create(sliderRiders, {
            start: [response.setnrider],
            connect: 'lower',
            step: 100,
            range: {
                'min': [100],
                'max': [20000]
            }
        });
        var sliderDrivers = document.querySelector('.nouislider-range-drivers');
        noUiSlider.create(sliderDrivers, {
            start: [response.setndriver],
            connect: 'lower',
            step: 100,
            range: {
                'min': [100],
                'max': [20000]
            }
        });
        getNoUISliderValue(sliderRiders, true);
        getNoUISliderValue(sliderDrivers, true);
        $('.update-system').unbind().bind('click', function(e) {
            e.preventDefault();
            var email = $('.demail').val();
            var phone = $('.dphone').val();
            var cash = $('.dcash').val();
            var minred = $('.dminpoints').val();
            var maxred = $('.dmaxpoints').val();
            var maxrid = $('.dmaxrides').val();
            var chatxt = $('.dchat').val();
            var cronfs = $('.dcronfs').val();
            var crondb = $('.dcrondb').val();
            var cronpn = $('.dcronpn').val();
            var nrider = $('.near-rider').val();
            var ndriver = $('.near-driver').val();
            if($('.smpesa').is(':checked')){var smpesa = 1;}else{var smpesa = 0;}
            if($('.scard').is(':checked')){var scard = 1;}else{var scard = 0;}
            if($('.spoints').is(':checked')){var spoints = 1;}else{var spoints = 0;}
            if($('.spromo').is(':checked')){var spromo = 1;}else{var spromo = 0;}
            if (email === '') {
                var from = 'top',
                    align = 'right',
                    type = 'warning',
                    icon = 'info',
                    time = 3000;
                var message = 'Error! default email address is required to proceed';
                md.showNotification(from, align, type, icon, message, time);
            } else if (!validateEmail(email)) {
                var from = 'top',
                    align = 'right',
                    type = 'warning',
                    icon = 'info',
                    time = 3000;
                var message = 'Error! the email address you entered seems to be invalid';
                md.showNotification(from, align, type, icon, message, time);
            } else if (phone === '') {
                var from = 'top',
                    align = 'right',
                    type = 'warning',
                    icon = 'info',
                    time = 3000;
                var message = 'Error! default phone number is required to proceed';
                md.showNotification(from, align, type, icon, message, time);
            } else if (!validatePhone(phone)) {
                var from = 'top',
                    align = 'right',
                    type = 'warning',
                    icon = 'info',
                    time = 3000;
                var message = 'Error! the phone number you entered seems to be invalid';
                md.showNotification(from, align, type, icon, message, time);
            } else if (cash === '' || cash < 0) {
                var from = 'top',
                    align = 'right',
                    type = 'warning',
                    icon = 'info',
                    time = 3000;
                var message = 'Error! cash rewards per point is required to proceed';
                md.showNotification(from, align, type, icon, message, time);
            } else if (minred === '' || minred < 0) {
                var from = 'top',
                    align = 'right',
                    type = 'warning',
                    icon = 'info',
                    time = 3000;
                var message = 'Error! minimum redeemable points is required to proceed';
                md.showNotification(from, align, type, icon, message, time);
            } else if (maxred === '' || maxred < 0) {
                var from = 'top',
                    align = 'right',
                    type = 'warning',
                    icon = 'info',
                    time = 3000;
                var message = 'Error! maximum redeemable points is required to proceed';
                md.showNotification(from, align, type, icon, message, time);
            } else if (parseInt(maxred) < parseInt(minred)) {
                var from = 'top',
                    align = 'right',
                    type = 'warning',
                    icon = 'info',
                    time = 3000;
                var message = 'Error! maximum redeemable points must be higher than minimum redeemable';
                md.showNotification(from, align, type, icon, message, time);
            } else if (maxrid === '' || maxrid < 0) {
                var from = 'top',
                    align = 'right',
                    type = 'warning',
                    icon = 'info',
                    time = 3000;
                var message = 'Error! maximum number of concurrent driver rides is required to proceed';
                md.showNotification(from, align, type, icon, message, time);
            } else if (chatxt === '') {
                var from = 'top',
                    align = 'right',
                    type = 'warning',
                    icon = 'info',
                    time = 3000;
                var message = 'Error! please enter a default chat message to proceed';
                md.showNotification(from, align, type, icon, message, time);
            } else if (cronfs === '') {
                var from = 'top',
                    align = 'right',
                    type = 'warning',
                    icon = 'info',
                    time = 3000;
                var message = 'Error! please select the file backup time to proceed';
                md.showNotification(from, align, type, icon, message, time);
            } else if (crondb === '') {
                var from = 'top',
                    align = 'right',
                    type = 'warning',
                    icon = 'info',
                    time = 3000;
                var message = 'Error! please select the database backup time to proceed';
                md.showNotification(from, align, type, icon, message, time);
            } else if (cronpn === '') {
                var from = 'top',
                    align = 'right',
                    type = 'warning',
                    icon = 'info',
                    time = 3000;
                var message = 'Error! please select the driver payment notification time to proceed';
                md.showNotification(from, align, type, icon, message, time);
            } else {
                var setup = { sid: response._id, email: email, phone: phone, cash: cash, minred: minred, maxred: maxred, maxrid: maxrid, chatxt: chatxt, cronfs: cronfs, crondb: crondb, cronpn: cronpn, nrider: nrider, ndriver: ndriver, smpesa: smpesa, scard: scard, spoints: spoints, spromo: spromo };
                socket.emit('update vapor console', setup);
                socket.on('update vapor console', function(res) {
                    socket.off('update vapor console');
                    var from = 'top',
                        align = 'right',
                        type = 'success',
                        icon = 'check',
                        time = 3000;
                    var message = 'Success! system settings have been successfully updated';
                    md.showNotification(from, align, type, icon, message, time);
                    playNotificationSound('cheerful');
                })
            }
        })
    })
}

function users() {

    NProgress.start();
    $('.refresh-data').css('display', 'none');
    destroyDataTable();
    $('.admin-users').empty();
    socket.emit('fetch admin users', admin);
    socket.on('fetch admin users', function(response) {
        socket.off('fetch admin users');
        $('.refresh-data').css('display', 'block');
        NProgress.done();
        var i = 1;
        for (var key in response) {
            var tr = `<tr>
            <td>${i++}</td>
            <td>${response[key].firstname} ${response[key].lastname}</td>
            <td>${truncateString(response[key].email, 18)}</td>
            <td>${response[key].phone}</td>
            <td>${timeConverterDate(response[key].time)}</td>
            <td class="td-actions text-right">
            <a href="javascript:void(0)" class="delete-account" data-id="${response[key]._id}" data-email="${response[key].email}" data-name="${response[key].firstname} ${response[key].lastname}">
            <i class="f7-icons size-20 col-blue-grey">trash</i>
            </a>
            </td>
            </tr>`;
            $('.admin-users').append(tr);
        }
        initDataTable();
        $('#dtable tbody').on('click', 'tr td .delete-account', function(e) {
            e.preventDefault();
            var did = $(this).data('id');
            var dname = $(this).data('name');
            var demail = $(this).data('email');
            if (demail === 'tufike@lexacle.com' || demail === 'lexacletechnologies@gmail.com') {
                socket.off('create admin account');
                socket.off('delete admin account');
                socket.off('fetch admin users');
                var from = 'top';
                var align = 'right';
                var type = 'warning';
                var icon = 'delete';
                var message = 'Sorry! the account you are trying to delete is system reserved';
                var time = 3000;
                md.showNotification(from, align, type, icon, message, time);
            } else {
                Swal.fire({
                    title: '<h4 class="lexacle-bold">Delete Admin Account?</h4>',
                    icon: 'question',
                    html: `Are you sure you want to delete ${dname}'s admin account from the system? <br>You cannot revert this operation.`,
                    scrollbarPadding: false,
                    confirmButtonText: 'Delete',
                    cancelButtonText: 'Cancel',
                    reverseButtons: true,
                    showCancelButton: true,
                    customClass: {
                        confirmButton: 'btn btn-danger pull-right-swal waves-effect',
                        cancelButton: 'btn btn-success pull-left-swal waves-effect'
                    },
                    buttonsStyling: false
                }).then((result) => {
                    if (result.value) {
                        socket.emit('delete admin account', did);
                        socket.on('delete admin account', function(response) {
                            socket.off('delete admin account');
                            users();
                            var from = 'top';
                            var align = 'right';
                            var type = 'success';
                            var icon = 'check';
                            var message = dname + '\'s admin account has been successfully deleted';
                            var time = 3000;
                            md.showNotification(from, align, type, icon, message, time);
                        })
                    }
                })
            }
        })
    })

    $('.refresh-data').unbind().bind('click', function(e) {
        e.preventDefault();
        users();
    })

    $('.create-account').unbind().bind('click', function(e) {
        e.preventDefault();
        var fname = $('.fname').val();
        var lname = $('.lname').val();
        var email = $('.email').val();
        var phone = $('.phone').val();
        var password = $('.password').val();

        if (fname === '') {
            var from = 'top';
            var align = 'right';
            var type = 'warning';
            var icon = 'error';
            var message = 'Please enter the admin account\'s first name to proceed';
            var time = 3000;
            md.showNotification(from, align, type, icon, message, time);
            $('.fname').focus();
        } else if (lname === '') {
            var from = 'top';
            var align = 'right';
            var type = 'warning';
            var icon = 'error';
            var message = 'Please enter the admin account\'s last name to proceed';
            var time = 3000;
            md.showNotification(from, align, type, icon, message, time);
            $('.lname').focus();
        } else if (email === '') {
            var from = 'top';
            var align = 'right';
            var type = 'warning';
            var icon = 'error';
            var message = 'Please enter the admin account\'s email address to proceed';
            var time = 3000;
            md.showNotification(from, align, type, icon, message, time);
            $('.email').focus();
        } else if (phone === '') {
            var from = 'top';
            var align = 'right';
            var type = 'warning';
            var icon = 'error';
            var message = 'Please enter the admin account\'s phone number to proceed';
            var time = 3000;
            md.showNotification(from, align, type, icon, message, time);
            $('.phone').focus();
        } else if (password === '') {
            var from = 'top';
            var align = 'right';
            var type = 'warning';
            var icon = 'error';
            var message = 'Please enter the admin account\'s login password to proceed';
            var time = 3000;
            md.showNotification(from, align, type, icon, message, time);
            $('.password').focus();
        } else if (password.length < 6) {
            var from = 'top';
            var align = 'right';
            var type = 'warning';
            var icon = 'error';
            var message = 'The admin account\'s password should be more than 6 characters';
            var time = 3000;
            md.showNotification(from, align, type, icon, message, time);
            $('.password').focus();
        } else {
            var account = {
                firstname: fname,
                lastname: lname,
                email: email,
                phone: phone,
                photo: 'admin.png',
                password: password,
                status: 1,
                settings: {
                    notifications: 1,
                    theme: 'green',
                    mode: 'dark',
                    rate: 0,
                    online: 0
                },
                time: Date.now()
            };
            socket.emit('create admin account', account);
            socket.on('create admin account', function(response) {
                if (response.email === email) {
                    socket.off('create admin account');
                    $('.fname, .lname, .email, .phone, .password').val('');
                    users();
                }

            })
        }
    })
}

function destroyDataTable() {
    $('#dtable').DataTable().clear().destroy();
}

function destroydxDataTable() {
    $('#dxtable').DataTable().clear().destroy();
}

function destroyTransactionsTable() {
    $('#transactionstable').DataTable().clear().destroy();
}

function destroyNTable1() {
    $('#ntable1').DataTable().clear().destroy();
}

function destroyNTable2() {
    $('#ntable2').DataTable().clear().destroy();
}

function destroyNTable3() {
    $('#ntable3').DataTable().clear().destroy();
}

function destroyRidesDataTable() {
    $('#rtable1, #rtable2, #rtable3, #rtable4, #rtable5, #rtable6').DataTable().clear().destroy();
}

function initTransactionsTable() {
    $('#transactionstable').DataTable({
        dom: 'Bfrtip',
        responsive: false,
        ordering: false,
        //pageLength: 5,
        sorting: false,
        stateSave: true,
        buttons: [
            'copy', 'excel', 'pdf'
        ]
    });
}

function initRtable1() {
    $('#rtable1').DataTable({
        dom: 'Bfrtip',
        responsive: false,
        ordering: false,
        //pageLength: 5,
        sorting: false,
        stateSave: true,
        buttons: [
            'copy', 'excel', 'pdf'
        ]
    });
}

function initRtable2() {
    $('#rtable2').DataTable({
        dom: 'Bfrtip',
        responsive: false,
        ordering: false,
        //pageLength: 5,
        sorting: false,
        stateSave: true,
        buttons: [
            'copy', 'excel', 'pdf'
        ]
    });
}

function initRtable3() {
    $('#rtable3').DataTable({
        dom: 'Bfrtip',
        responsive: false,
        ordering: false,
        //pageLength: 5,
        sorting: false,
        stateSave: true,
        buttons: [
            'copy', 'excel', 'pdf'
        ]
    });
}

function initRtable4() {
    $('#rtable4').DataTable({
        dom: 'Bfrtip',
        responsive: false,
        ordering: false,
        //pageLength: 5,
        sorting: false,
        stateSave: true,
        buttons: [
            'copy', 'excel', 'pdf'
        ]
    });
}

function initRtable5() {
    $('#rtable5').DataTable({
        dom: 'Bfrtip',
        responsive: false,
        ordering: false,
        //pageLength: 5,
        sorting: false,
        stateSave: true,
        buttons: [
            'copy', 'excel', 'pdf'
        ]
    });
}

function initRtable6() {
    $('#rtable6').DataTable({
        dom: 'Bfrtip',
        responsive: false,
        ordering: false,
        //pageLength: 5,
        sorting: false,
        stateSave: true,
        buttons: [
            'copy', 'excel', 'pdf'
        ]
    });
}

function initDataTable() {
    $('#dtable').DataTable({
        dom: 'Bfrtip',
        responsive: false,
        ordering: false,
        //pageLength: 5,
        sorting: false,
        stateSave: true,
        buttons: [
            'copy', 'excel', 'pdf'
        ]
    });
}

function initdxDataTable() {
    $('#dxtable').DataTable({
        dom: 'Bfrtip',
        responsive: false,
        ordering: false,
        //pageLength: 5,
        sorting: false,
        stateSave: true,
        buttons: [
            'copy', 'excel', 'pdf'
        ]
    });
}

function initNTable1() {
    $('#ntable1').DataTable({
        dom: 'Bfrtip',
        responsive: false,
        ordering: false,
        pageLength: 7,
        sorting: false,
        stateSave: true,
        buttons: [
            'copy', 'excel', 'pdf'
        ]
    });
}

function initNTable2() {
    $('#ntable2').DataTable({
        dom: 'Bfrtip',
        responsive: false,
        ordering: false,
        pageLength: 7,
        sorting: false,
        stateSave: true,
        buttons: [
            'copy', 'excel', 'pdf'
        ]
    });
}

function initNTable3() {
    $('#ntable3').DataTable({
        dom: 'Bfrtip',
        responsive: false,
        ordering: false,
        pageLength: 7,
        sorting: false,
        stateSave: true,
        buttons: [
            'copy', 'excel', 'pdf'
        ]
    });
}


//Get noUISlider Value and write on
function getNoUISliderValue(slider, percentage) {
    slider.noUiSlider.on('update', function() {
        var val = slider.noUiSlider.get();
        if (percentage) {
            spur = `${parseInt(val)}`;
            val = `${parseInt(val)} Meters / ${parseFloat(parseInt(val)/1000)} Kilometers Radius`;
        }
        $(slider).parent().find('span.js-nouislider-value').text(val);
        $(slider).parent().find('.near-dis').val(spur);
    });
}

function validateEmail($email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test($email);
}

function validatePhone(phone) {
    var toMatch = /^07\d{8}$/;
    var authenticate = toMatch.test(phone);
    if (authenticate) {
        return true;
    } else {
        return false;
    }
}

function truncateString(input, max) {
    if (input.length > max) {
        return input.substring(0, max) + '...';
    }
    return input;
};

function timeConverterDate(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = dateOrdinal(date) + ' ' + month + ' ' + year + ' ';
    return time;
}

function dateOrdinal(d) {
    return d + (31 == d || 21 == d || 1 == d ? "st" : 22 == d || 2 == d ? "nd" : 23 == d || 3 == d ? "rd" : "th")
};

function timeConverterTime(UNIX_timestamp) {
    var currentTime = new Date(UNIX_timestamp);
    var hours = currentTime.getHours()
    var suffix = '';
    if (hours > 11) {
        suffix += "PM";
    } else {
        suffix += "AM";
    }
    var minutes = currentTime.getMinutes()
    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (hours > 12) {
        hours -= 12;
    } else if (hours === 0) {
        hours = 12;
    }
    var time = hours + ":" + minutes + " " + suffix;
    return time;
}

function playNotificationSound(sound) {
    var mp3Source = '<source src="/assets/admin/sounds/' + sound + '.mp3" type="audio/mpeg">';
    var oggSource = '<source src="/assets/admin/sounds/' + sound + '.ogg" type="audio/ogg">';
    var embedSource = '<embed hidden="false" autostart="true" loop="false" src="/assets/admin/sounds/' + sound + '.mp3">';
    document.getElementById("server-sound").innerHTML = '<audio autoplay="autoplay">' + mp3Source + oggSource + embedSource + '</audio>';
}

/*
if('serviceWorker' in navigator && 'PushManager' in window){
    navigator.serviceWorker.register(appUrl + '/sw.js')
    .then(reg => console.log('service worker registered'))
    .catch(err => console.log('service worker not registered', err));
}
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});
navigator.serviceWorker.ready.then(function(swRegistration) {
    return swRegistration.sync.register('tufikeSync');
});
*/

var $status = document.getElementById('status');

if ('Notification' in window) {
    //$status.innerText = Notification.permission;
}
setTimeout(function() {
    requestPermission()
}, 2000)

function requestPermission() {
    if (!('Notification' in window)) {
        alert('Notification API not supported!');
        return;
    }

    Notification.requestPermission(function(result) {
        $status.innerText = result;
    });
}

function nonPersistentNotification() {
    if (!('Notification' in window)) {
        alert('Notification API not supported!');
        return;
    }

    try {
        var notification = new Notification("Hi there - non-persistent!");
    } catch (err) {
        alert('Notification API error: ' + err);
    }
}

function persistentNotification() {
    if (!('Notification' in window) || !('ServiceWorkerRegistration' in window)) {
        alert('Persistent Notification API not supported!');
        return;
    }

    try {
        navigator.serviceWorker.getRegistration()
            .then((reg) => reg.showNotification("Hi there - persistent!"))
            .catch((err) => alert('Service Worker registration error: ' + err));
    } catch (err) {
        alert('Notification API error: ' + err);
    }
}

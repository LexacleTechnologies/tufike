function auth() {
    $('.admin-login-button').unbind().bind('click', function(e) {
        e.preventDefault();
        var email = $('.email').val();
        var password = $('.password').val();
        if (email === '') {
            $('.email').focus();
            var from = 'bottom';
            var align = 'center';
            var type = 'danger';
            var icon = 'report';
            var message = 'Please enter your admin account email address to login.';
            var time = 5000;
            md.showNotification(from, align, type, icon, message, time);
        } else if (password === '') {
            $('.password').focus();
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
                    if (response.status === 1) {
                        var from = 'bottom';
                        var align = 'center';
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
                        var align = 'center';
                        var type = 'danger';
                        var icon = 'report';
                        var message = 'Invalid Email and/ or Password. Please try again.';
                        var time = 5000;
                        md.showNotification(from, align, type, icon, message, time);
                    }
                }
            })
        }
    })
}
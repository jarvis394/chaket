$(document).ready(function() {

  if (!navigator.cookieEnabled) {
    M.toast({
      html: 'Please, turn on cookies feature to use login correctly'
    }, 5000);
  }

  $('#regRedir').click(() => {
    $('.log').addClass('hidden');
    $('.reg').addClass('fadeIn');
    $('.reg').removeClass('hidden');
    setTimeout(() => {
      $('.reg').removeClass('fadeIn')
    }, 1000);
  });

  $('#loginRedir').click(() => {
    $('.reg').addClass('hidden');
    $('.log').addClass('fadeIn');
    $('.log').removeClass('hidden');
    setTimeout(() => {
      $('.log').removeClass('fadeIn')
    }, 1000);
  });

  $('.loginForm').submit((e) => {
    e.preventDefault();
    
    var email = $('#email').val();
    var password = $('#password').val();
    
    if (email === "")    return $('#email')   .addClass('red-input');
    if (password === "") return $('#password').addClass('red-input');

    $.ajax({
      type: "POST",
      url: "/login",
      data: JSON.stringify({
        email: email,
        password: password
      }),
      dataType: "json",
      contentType: "application/json",
      success: data => {
        window.location.href = "https://chaket.glitch.me";
      },
      statusCode: {
        404: () => {
          M.toast({
            html: 'User not found. Please check you credentials before login.',
            displayLength: 5000
          });
        },
        403: () => {
          M.toast({
            html: 'Wrong e-mail or password',
            displayLength: 5000
          });
        }
      }
    });
  });

  $('.registerForm').submit((e) => {
    e.preventDefault();
    
    var username = $('#first_nameRegister').val();
    var surname = $('#last_nameRegister').val();
    var emailReg = $('#emailRegister').val();
    var passwordReg = $('#passwordRegister').val();
    
    if (username === "")    return $('#first_nameRegister').addClass('red-input');
    if (surname === "")     return $('#last_nameRegister') .addClass('red-input');
    if (emailReg === "")    return $('#emailRegister')     .addClass('red-input');
    if (passwordReg === "") return $('#passwordRegister')  .addClass('red-input');

    $.ajax({
      type: "POST",
      url: "/register",
      data: JSON.stringify({
        name: username,
        surname: surname,
        email: emailReg,
        password: passwordReg
      }),
      dataType: "json",
      contentType: "application/json",
      success: data => {
        window.location.href = "https://chaket.glitch.me";
      },
      statusCode: {
        500: () => {
          M.toast({
            html: 'Something went wrong. Please, try later.',
            displayLength: 5000
          });
        },
        403: () => {
          M.toast({
            html: 'Account is already taken',
            displayLength: 5000
          });
        }
      }
    });
  });

});
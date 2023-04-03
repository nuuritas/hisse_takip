$(document).ready(function() {
    displayLoginForm();
  });
  
function displayLoginForm() {
const loginForm = `
    <div class="login-form-container">
    <form class="login-form" id="login-form">
        <h2 class="title">Finance Tracker</h2>
        <label for="username">Kullanıcı Adı:</label>
        <br>
        <input type="text" id="username" name="username">
        <br>
        <label for="password">Şifre:</label>
        <br>
        <input type="password" id="password" name="password">
        <br>
        <input type="submit" value="Login">
    </form>
    <div id="error-message"></div>
    </div>
`;
$('#content-container').html(loginForm);

// Add submit event listener to the form
$('#login-form').submit(function(event) {
    event.preventDefault();
  
    // Get entered username and password
    const enteredUsername = $('#username').val();
    const enteredPassword = $('#password').val();
  
    // Load users from JSON file
    $.getJSON('users.json', function(data) {
      const users = data.users;
  
      // Find user with matching username
      const user = users.find(user => user.username === enteredUsername);
  
      // Check if user exists
      if (user) {
        // Compute SHA256 hash of entered password
        const hashedPassword = CryptoJS.SHA256(enteredPassword).toString();
  
        // Check if hashed password matches the one in the users file
        if (hashedPassword === user.password) {
          // Redirect to dashboard page
          $('#wb-pic').remove();
          displayDashboard();
        } else {
          // Display error message
          $('#error-message').text('Invalid username or password');
        }
      } else {
        // Display error message
        $('#error-message').text('Invalid username or password');
      }
    });
  });
  

}
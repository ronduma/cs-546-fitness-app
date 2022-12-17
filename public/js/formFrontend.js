function toggle() {
  let password = document.getElementById("passwordInput");
  let confirmPassword = document.getElementById("confirmPasswordInput")
  if (password.type === "password") {
    password.type = "text";
    confirmPassword.type = "text";
  } else {
    password.type = "password";
    confirmPassword.type = "password";
  }
}
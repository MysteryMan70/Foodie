// =====================================================
// Predefined Accounts
// =====================================================

// These accounts are already registered in the website
// and are not stored in localStorage.

const predefinedAccounts = [
  {
    username: "a7sss",
    email: "ahmed@gmail.com",
    password: "123456",
  },
];

// =====================================================
// favorite Dot
// =====================================================

function updatefavoritedot() {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  let favoriteDot = document.getElementById("favoriteDot");
  if (!favoriteDot) return;
  if (favorites.length > 0) {
    favoriteDot.style.display = "block";
  } else {
    favoriteDot.style.display = "none";
  }
}

// =====================================================
// Load Components
// =====================================================

async function loadComponent(id, file) {
  try {
    const element = document.getElementById(id);

    if (!element) {
      console.error(`Element #${id} not found`);
      return;
    }

    const response = await fetch(file);

    if (!response.ok) {
      throw new Error(`Could not load ${file}`);
    }

    const data = await response.text();

    element.innerHTML = data;

    // =================================================
    // Move Modals Outside Navbar
    // =================================================

    const loginModal = element.querySelector("#exampleModal");
    const registerModal = element.querySelector("#registerModal");
    const loginRequiredModal = element.querySelector("#loginRequiredModal");

    if (loginModal) {
      document.body.appendChild(loginModal);
    }

    if (registerModal) {
      document.body.appendChild(registerModal);
    }

    if (loginRequiredModal) {
      document.body.appendChild(loginRequiredModal);
    }

    // =================================================
    // Navbar Ready
    // =================================================

    if (id === "navbar") {
      setActiveNavLink();

      updateCartBadge();

      updatefavoritedot();
      initAuth();
    }
  } catch (error) {
    console.error(error);
  }
}

// =====================================================
// Active Navbar Link
// =====================================================

function setActiveNavLink() {
  let currentPage = window.location.pathname.split("/").pop().toLowerCase();

  if (currentPage === "") {
    currentPage = "index.html";
  }

  const navLinks = document.querySelectorAll("#navbar .nav-link");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");

    if (!href) {
      return;
    }

    const linkPage = href.split("/").pop().split("?")[0].toLowerCase();

    if (linkPage === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// =====================================================
// Authentication System
// =====================================================

function initAuth() {
  // =====================================================
  // LOGIN ELEMENTS
  // =====================================================

  const loginUsername = document.getElementById("loginUsername");

  const loginUsernameError = document.getElementById("loginUsernameError");

  const passwordInput = document.getElementById("inputPassword5");

  const passwordError = document.getElementById("passwordError");

  const togglePassword = document.getElementById("togglePassword");

  const rememberMe = document.getElementById("rememberMe");

  const loginBtn = document.getElementById("loginBtn");

  const modalElement = document.getElementById("exampleModal");

  // =====================================================
  // NAVBAR ELEMENTS
  // =====================================================

  const navLoginBtn = document.getElementById("navLoginBtn");

  const userDropdown = document.getElementById("userDropdown");

  const accountUsername = document.getElementById("accountUsername");

  const accountEmail = document.getElementById("accountEmail");

  const userEmailText = document.getElementById("userEmailText");

  const logoutBtn = document.getElementById("logoutBtn");

  // =====================================================
  // REGISTER ELEMENTS
  // =====================================================

  const registerUsername = document.getElementById("registerUsername");

  const registerUsernameError = document.getElementById(
    "registerUsernameError",
  );

  const registerEmail = document.getElementById("registerEmail");

  const registerEmailError = document.getElementById("registerEmailError");

  const registerPassword = document.getElementById("registerPassword");

  const registerPasswordError = document.getElementById(
    "registerPasswordError",
  );

  const confirmPassword = document.getElementById("confirmPassword");

  const confirmPasswordError = document.getElementById("confirmPasswordError");

  const registerBtn = document.getElementById("registerBtn");

  const registerModalElement = document.getElementById("registerModal");

  const openRegisterFromLogin = document.getElementById(
    "openRegisterFromLogin",
  );

  const openLoginFromRegister = document.getElementById(
    "openLoginFromRegister",
  );

  const toggleRegisterPassword = document.getElementById(
    "toggleRegisterPassword",
  );

  const toggleConfirmPassword = document.getElementById(
    "toggleConfirmPassword",
  );

  // =====================================================
  // REGEX
  // =====================================================

  const usernameRegex = /^[A-Za-z0-9_@]{3,}$/;

  const registerEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const registerPasswordRegex = /^.{6,}$/;

  // =====================================================
  // USERS FUNCTIONS
  // =====================================================

  function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
  }

  function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  // =====================================================
  // FIND USER
  // =====================================================

  function findUser(username) {
    const usernameLower = username.toLowerCase();

    // Predefined accounts

    const predefinedUser = predefinedAccounts.find(
      (user) => user.username.toLowerCase() === usernameLower,
    );

    if (predefinedUser) {
      return predefinedUser;
    }

    // Registered users

    const users = getUsers();

    return users.find((user) => user.username.toLowerCase() === usernameLower);
  }

  // =====================================================
  // CHECK USERNAME EXISTS
  // =====================================================

  function usernameExists(username) {
    const usernameLower = username.toLowerCase();

    const predefinedExists = predefinedAccounts.some(
      (user) => user.username.toLowerCase() === usernameLower,
    );

    if (predefinedExists) {
      return true;
    }

    const users = getUsers();

    return users.some((user) => user.username.toLowerCase() === usernameLower);
  }

  // =====================================================
  // CHECK EMAIL EXISTS
  // =====================================================

  function emailExists(email) {
    const emailLower = email.toLowerCase();

    const predefinedExists = predefinedAccounts.some(
      (user) => user.email.toLowerCase() === emailLower,
    );

    if (predefinedExists) {
      return true;
    }

    const users = getUsers();

    return users.some((user) => user.email.toLowerCase() === emailLower);
  }

  // =====================================================
  // PASSWORD TOGGLE
  // =====================================================

  function setupPasswordToggle(button, input) {
    if (!button || !input) {
      return;
    }

    button.addEventListener("click", () => {
      const isPassword = input.type === "password";

      input.type = isPassword ? "text" : "password";

      const icon = button.querySelector("i");

      if (!icon) {
        return;
      }

      icon.classList.toggle("fa-eye", !isPassword);

      icon.classList.toggle("fa-eye-slash", isPassword);
    });
  }

  setupPasswordToggle(toggleRegisterPassword, registerPassword);

  setupPasswordToggle(toggleConfirmPassword, confirmPassword);

  // =====================================================
  // CHECK AUTHENTICATION
  // =====================================================

  function checkAuth() {
    const savedUsername =
      localStorage.getItem("userUsername") ||
      sessionStorage.getItem("userUsername");

    const savedEmail =
      localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");

    const isLoggedIn = Boolean(savedUsername && savedEmail);

    // =================================================
    // LOGIN BUTTON
    // =================================================

    if (navLoginBtn) {
      navLoginBtn.classList.toggle("d-none", isLoggedIn);
    }

    // =================================================
    // USER DROPDOWN
    // =================================================

    if (userDropdown) {
      userDropdown.classList.toggle("d-none", !isLoggedIn);
    }

    if (!isLoggedIn) {
      return;
    }

    // =================================================
    // USERNAME
    // =================================================

    if (accountUsername) {
      accountUsername.textContent = savedUsername;
    }

    // =================================================
    // EMAIL
    // =================================================

    if (accountEmail) {
      accountEmail.textContent = savedEmail;
    }

    if (userEmailText) {
      userEmailText.textContent = savedEmail;
    }
  }

  // =====================================================
  // OPEN REGISTER FROM LOGIN
  // =====================================================

  if (openRegisterFromLogin && modalElement && registerModalElement) {
    openRegisterFromLogin.addEventListener("click", () => {
      const loginModal = bootstrap.Modal.getInstance(modalElement);

      if (loginModal) {
        loginModal.hide();
      }

      setTimeout(() => {
        const registerModal =
          bootstrap.Modal.getInstance(registerModalElement) ||
          new bootstrap.Modal(registerModalElement);

        registerModal.show();
      }, 300);
    });
  }

  // =====================================================
  // OPEN LOGIN FROM REGISTER
  // =====================================================

  if (openLoginFromRegister && modalElement && registerModalElement) {
    openLoginFromRegister.addEventListener("click", () => {
      const registerModal = bootstrap.Modal.getInstance(registerModalElement);

      if (registerModal) {
        registerModal.hide();
      }

      setTimeout(() => {
        const loginModal =
          bootstrap.Modal.getInstance(modalElement) ||
          new bootstrap.Modal(modalElement);

        loginModal.show();
      }, 300);
    });
  }

  // =====================================================
  // REGISTER
  // =====================================================

  if (
    registerBtn &&
    registerUsername &&
    registerEmail &&
    registerPassword &&
    confirmPassword
  ) {
    registerBtn.addEventListener("click", () => {
      const usernameVal = registerUsername.value.trim();

      const emailVal = registerEmail.value.trim();

      const passwordVal = registerPassword.value;

      const confirmPasswordVal = confirmPassword.value;

      // =================================================
      // USERNAME VALIDATION
      // =================================================

      let isUsernameValid = true;

      if (usernameVal === "") {
        isUsernameValid = false;

        registerUsernameError.textContent = "Please enter your username.";

        registerUsernameError.classList.remove("d-none");
      } else if (usernameVal.length < 3) {
        isUsernameValid = false;

        registerUsernameError.textContent =
          "Username must be at least 3 characters.";

        registerUsernameError.classList.remove("d-none");
      } else if (!usernameRegex.test(usernameVal)) {
        isUsernameValid = false;

        registerUsernameError.textContent =
          "Username can contain English letters, numbers, _ and @ only.";

        registerUsernameError.classList.remove("d-none");
      } else {
        registerUsernameError.textContent = "";

        registerUsernameError.classList.add("d-none");
      }

      // =================================================
      // EMAIL VALIDATION
      // =================================================

      let isEmailValid = true;

      if (emailVal === "") {
        isEmailValid = false;

        registerEmailError.textContent = "Please enter your email address.";

        registerEmailError.classList.remove("d-none");
      } else if (!registerEmailRegex.test(emailVal)) {
        isEmailValid = false;

        registerEmailError.textContent = "Please enter a valid email address.";

        registerEmailError.classList.remove("d-none");
      } else {
        registerEmailError.textContent = "";

        registerEmailError.classList.add("d-none");
      }

      // =================================================
      // PASSWORD VALIDATION
      // =================================================

      let isPasswordValid = true;

      if (passwordVal === "") {
        isPasswordValid = false;

        registerPasswordError.textContent = "Please enter your password.";

        registerPasswordError.classList.remove("d-none");
      } else if (!registerPasswordRegex.test(passwordVal)) {
        isPasswordValid = false;

        registerPasswordError.textContent =
          "Password must be at least 6 characters.";

        registerPasswordError.classList.remove("d-none");
      } else {
        registerPasswordError.textContent = "";

        registerPasswordError.classList.add("d-none");
      }

      // =================================================
      // CONFIRM PASSWORD
      // =================================================

      let isConfirmValid = true;

      if (confirmPasswordVal === "") {
        isConfirmValid = false;

        confirmPasswordError.textContent = "Please confirm your password.";

        confirmPasswordError.classList.remove("d-none");
      } else if (passwordVal !== confirmPasswordVal) {
        isConfirmValid = false;

        confirmPasswordError.textContent = "Passwords do not match.";

        confirmPasswordError.classList.remove("d-none");
      } else {
        confirmPasswordError.textContent = "";

        confirmPasswordError.classList.add("d-none");
      }

      // =================================================
      // BOOTSTRAP VALIDATION
      // =================================================

      registerUsername.classList.toggle("is-invalid", !isUsernameValid);

      registerEmail.classList.toggle("is-invalid", !isEmailValid);

      registerPassword.classList.toggle("is-invalid", !isPasswordValid);

      confirmPassword.classList.toggle("is-invalid", !isConfirmValid);

      // =================================================
      // STOP IF INVALID
      // =================================================

      if (
        !isUsernameValid ||
        !isEmailValid ||
        !isPasswordValid ||
        !isConfirmValid
      ) {
        return;
      }

      // =================================================
      // CHECK USERNAME
      // =================================================

      if (usernameExists(usernameVal)) {
        registerUsernameError.textContent =
          "This username is already registered.";

        registerUsernameError.classList.remove("d-none");

        registerUsername.classList.add("is-invalid");

        return;
      }

      // =================================================
      // CHECK EMAIL
      // =================================================

      if (emailExists(emailVal)) {
        registerEmailError.textContent = "This email is already registered.";

        registerEmailError.classList.remove("d-none");

        registerEmail.classList.add("is-invalid");

        return;
      }

      // =================================================
      // CREATE USER
      // =================================================

      const newUser = {
        username: usernameVal,
        email: emailVal,
        password: passwordVal,
      };

      // =================================================
      // SAVE USER
      // =================================================

      const users = getUsers();

      users.push(newUser);

      saveUsers(users);

      // =================================================
      // TRANSFER GUEST CART
      // =================================================

      if (typeof window.transferGuestCartToUser === "function") {
        window.transferGuestCartToUser(usernameVal);
      }

      // =================================================
      // SUCCESS
      // =================================================

      alert("Registration successful! You can now log in.");

      // =================================================
      // CLOSE REGISTER MODAL
      // =================================================

      if (registerModalElement) {
        const registerModal =
          bootstrap.Modal.getInstance(registerModalElement) ||
          new bootstrap.Modal(registerModalElement);

        registerModal.hide();
      }

      // =================================================
      // CLEAR INPUTS
      // =================================================

      registerUsername.value = "";
      registerEmail.value = "";
      registerPassword.value = "";
      confirmPassword.value = "";

      registerPassword.type = "password";
      confirmPassword.type = "password";

      // =================================================
      // RESET EYE ICONS
      // =================================================

      const registerIcon = toggleRegisterPassword?.querySelector("i");

      const confirmIcon = toggleConfirmPassword?.querySelector("i");

      if (registerIcon) {
        registerIcon.classList.remove("fa-eye-slash");

        registerIcon.classList.add("fa-eye");
      }

      if (confirmIcon) {
        confirmIcon.classList.remove("fa-eye-slash");

        confirmIcon.classList.add("fa-eye");
      }

      // =================================================
      // REMOVE VALIDATION
      // =================================================

      registerUsername.classList.remove("is-invalid");

      registerEmail.classList.remove("is-invalid");

      registerPassword.classList.remove("is-invalid");

      confirmPassword.classList.remove("is-invalid");

      // =================================================
      // CLEAR ERRORS
      // =================================================

      registerUsernameError.textContent = "";
      registerEmailError.textContent = "";
      registerPasswordError.textContent = "";
      confirmPasswordError.textContent = "";

      registerUsernameError.classList.add("d-none");

      registerEmailError.classList.add("d-none");

      registerPasswordError.classList.add("d-none");

      confirmPasswordError.classList.add("d-none");

      // =================================================
      // OPEN LOGIN MODAL
      // =================================================

      setTimeout(() => {
        if (!modalElement) {
          return;
        }

        const loginModal =
          bootstrap.Modal.getInstance(modalElement) ||
          new bootstrap.Modal(modalElement);

        loginModal.show();
      }, 400);
    });
  }

  // =====================================================
  // SHOW / HIDE LOGIN PASSWORD
  // =====================================================

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";

      passwordInput.type = isPassword ? "text" : "password";

      const icon = togglePassword.querySelector("i");

      if (!icon) {
        return;
      }

      icon.classList.toggle("fa-eye", !isPassword);

      icon.classList.toggle("fa-eye-slash", isPassword);
    });
  }

  // =====================================================
  // LOGIN
  // =====================================================

  if (loginBtn && loginUsername && passwordInput) {
    loginBtn.addEventListener("click", () => {
      const usernameVal = loginUsername.value.trim();

      const passVal = passwordInput.value;

      // =================================================
      // RESET ERRORS
      // =================================================

      loginUsernameError.textContent = "";
      passwordError.textContent = "";

      loginUsernameError.classList.add("d-none");

      passwordError.classList.add("d-none");

      loginUsername.classList.remove("is-invalid");

      passwordInput.classList.remove("is-invalid");

      // =================================================
      // BASIC VALIDATION
      // =================================================

      let isValid = true;

      // Username

      if (usernameVal === "") {
        isValid = false;

        loginUsernameError.textContent = "Please enter your username.";

        loginUsernameError.classList.remove("d-none");

        loginUsername.classList.add("is-invalid");
      } else if (!usernameRegex.test(usernameVal)) {
        isValid = false;

        loginUsernameError.textContent =
          "Username can contain English letters, numbers, _ and @ only.";

        loginUsernameError.classList.remove("d-none");

        loginUsername.classList.add("is-invalid");
      }

      // Password

      if (passVal === "") {
        isValid = false;

        passwordError.textContent = "Please enter your password.";

        passwordError.classList.remove("d-none");

        passwordInput.classList.add("is-invalid");
      }

      if (!isValid) {
        return;
      }

      // =================================================
      // FIND USER
      // =================================================

      const user = findUser(usernameVal);

      // =================================================
      // USERNAME NOT FOUND
      // =================================================

      if (!user) {
        loginUsernameError.textContent = "This username is not registered.";

        loginUsernameError.classList.remove("d-none");

        loginUsername.classList.add("is-invalid");

        return;
      }

      // =================================================
      // CHECK PASSWORD
      // =================================================

      if (user.password !== passVal) {
        passwordError.textContent = "Incorrect password. Please try again.";

        passwordError.classList.remove("d-none");

        passwordInput.classList.add("is-invalid");

        return;
      }

      // =================================================
      // LOGIN SUCCESS
      // =================================================

      if (rememberMe?.checked) {
        // Permanent Login

        localStorage.setItem("userUsername", user.username);

        localStorage.setItem("userEmail", user.email);

        // Remove Session Login

        sessionStorage.removeItem("userUsername");

        sessionStorage.removeItem("userEmail");
      } else {
        // Session Login

        sessionStorage.setItem("userUsername", user.username);

        sessionStorage.setItem("userEmail", user.email);

        // Remove Permanent Login

        localStorage.removeItem("userUsername");

        localStorage.removeItem("userEmail");
      }

      // =================================================
      // UPDATE NAVBAR + CART BADGE
      // =================================================

      checkAuth();

      updateCartBadge();

      // =================================================
      // CLOSE LOGIN MODAL
      // =================================================

      if (modalElement) {
        const bootstrapModal =
          bootstrap.Modal.getInstance(modalElement) ||
          new bootstrap.Modal(modalElement);

        bootstrapModal.hide();
      }

      // =================================================
      // CLEAR INPUTS
      // =================================================

      loginUsername.value = "";
      passwordInput.value = "";

      // =================================================
      // RESET PASSWORD
      // =================================================

      passwordInput.type = "password";

      const icon = togglePassword?.querySelector("i");

      if (icon) {
        icon.classList.remove("fa-eye-slash");

        icon.classList.add("fa-eye");
      }

      // =================================================
      // RESET VALIDATION
      // =================================================

      loginUsername.classList.remove("is-invalid");

      passwordInput.classList.remove("is-invalid");

      loginUsernameError.textContent = "";
      passwordError.textContent = "";

      loginUsernameError.classList.add("d-none");

      passwordError.classList.add("d-none");

      // =================================================
      // PENDING CHECKOUT
      // =================================================

      if (sessionStorage.getItem("pendingCheckout") === "true") {
        sessionStorage.removeItem("pendingCheckout");

        setTimeout(() => {
          const checkoutModalElement = document.getElementById("exampleModal2");

          if (!checkoutModalElement) {
            return;
          }

          const checkoutModal =
            bootstrap.Modal.getInstance(checkoutModalElement) ||
            new bootstrap.Modal(checkoutModalElement);

          checkoutModal.show();
        }, 500);
      }
    });
  }

  // =====================================================
  // LOGOUT
  // =====================================================

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // =================================================
      // REMOVE PERMANENT LOGIN
      // =================================================

      localStorage.removeItem("userUsername");

      localStorage.removeItem("userEmail");

      // =================================================
      // REMOVE SESSION LOGIN
      // =================================================

      sessionStorage.removeItem("userUsername");

      sessionStorage.removeItem("userEmail");

      // =================================================
      // UPDATE NAVBAR + CART BADGE
      // =================================================

      checkAuth();

      updateCartBadge();
    });
  }

  // =====================================================
  // INITIAL AUTH CHECK
  // =====================================================

  checkAuth();
}

// =====================================================
// Start Components
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("navbar", "Components/navbar.html");

  loadComponent("footer", "Components/footer.html");
});

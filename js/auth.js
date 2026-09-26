const CRMAuth = (() => {

    const SESSION_KEY = "leadflow_session";

    // Initialize storage & demo data whenever auth module loads
    if (typeof CRMStorage !== "undefined") {
        CRMStorage.init();
    }

    // ==========================================
    // GET CURRENT USER
    // ==========================================
    function getUser() {
        const session = localStorage.getItem(SESSION_KEY);
        if (!session) return null;

        try {
            return JSON.parse(session);
        } catch (error) {
            console.error("Session parse error:", error);
            return null;
        }
    }

    // ==========================================
    // CHECK LOGIN
    // ==========================================
    function isLoggedIn() {
        return getUser() !== null;
    }

    // ==========================================
    // LOGIN
    // ==========================================
    function login(email, password) {
        CRMStorage.init();
        const data = CRMStorage.get();

        const user = data.users.find(
            u => u.email.toLowerCase() === email.trim().toLowerCase()
        );

        if (!user) {
            return {
                success: false,
                message: "Account not found. Please check your email or register."
            };
        }

        if (user.password !== password) {
            return {
                success: false,
                message: "Incorrect password. Please try again."
            };
        }

        const sessionUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));

        return {
            success: true,
            message: "Login successful! Redirecting...",
            user: sessionUser
        };
    }

    // ==========================================
    // REGISTER
    // ==========================================
    function register(name, email, password, role) {
        CRMStorage.init();
        const data = CRMStorage.get();

        const existingUser = data.users.find(
            u => u.email.toLowerCase() === email.trim().toLowerCase()
        );

        if (existingUser) {
            return {
                success: false,
                message: "An account with this email already exists."
            };
        }

        const newUser = {
            id: "usr-" + Date.now(),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password,
            role: role || "Sales Executive",
            createdAt: new Date().toISOString()
        };

        data.users.push(newUser);
        CRMStorage.save(data);

        // Auto login on registration
        const sessionUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));

        return {
            success: true,
            message: "Account created successfully! Redirecting...",
            user: sessionUser
        };
    }

    // ==========================================
    // LOGOUT
    // ==========================================
    function logout() {
        localStorage.removeItem(SESSION_KEY);
        window.location.href = "login.html";
    }

    // ==========================================
    // LOGIN / REGISTER UI BINDINGS
    // ==========================================
    function initLoginUI() {
        const loginForm = document.getElementById("loginForm");
        const registerForm = document.getElementById("registerForm");
        if (!loginForm && !registerForm) return;

        // If user is already logged in, go straight to dashboard
        if (isLoggedIn()) {
            window.location.href = "index.html";
            return;
        }

        const showRegisterBtn = document.getElementById("showRegister");
        const showLoginBtn = document.getElementById("showLogin");
        const formTitle = document.getElementById("formTitle");
        const formSubtitle = document.getElementById("formSubtitle");
        const formEyebrow = document.getElementById("formEyebrow");

        const loginMsg = document.getElementById("loginMessage");
        const regMsg = document.getElementById("registerMessage");

        const fillAdminBtn = document.getElementById("fillAdminBtn");
        const fillSalesBtn = document.getElementById("fillSalesBtn");

        function showMessage(el, text, isError = true) {
            if (!el) return;
            el.className = isError ? "form-error" : "form-success";
            el.textContent = text;
            el.classList.remove("hidden");
        }

        function clearMessage(el) {
            if (!el) return;
            el.textContent = "";
            el.className = "hidden";
        }

        // Toggle to Register
        if (showRegisterBtn) {
            showRegisterBtn.addEventListener("click", () => {
                loginForm.classList.add("hidden");
                registerForm.classList.remove("hidden");
                clearMessage(loginMsg);
                clearMessage(regMsg);
                if (formTitle) formTitle.textContent = "Create Account";
                if (formSubtitle) formSubtitle.textContent = "Join your team on SG LEADFLOW";
                if (formEyebrow) formEyebrow.textContent = "GET STARTED";
            });
        }

        // Toggle to Login
        if (showLoginBtn) {
            showLoginBtn.addEventListener("click", () => {
                registerForm.classList.add("hidden");
                loginForm.classList.remove("hidden");
                clearMessage(loginMsg);
                clearMessage(regMsg);
                if (formTitle) formTitle.textContent = "Welcome Back";
                if (formSubtitle) formSubtitle.textContent = "Sign in to manage your sales pipeline and leads";
                if (formEyebrow) formEyebrow.textContent = "AUTHENTICATION";
            });
        }

        // Quick demo fills
        if (fillAdminBtn) {
            fillAdminBtn.addEventListener("click", () => {
                document.getElementById("loginEmail").value = "admin@sgleadflow.local";
                document.getElementById("loginPassword").value = "admin123";
                clearMessage(loginMsg);
            });
        }

        if (fillSalesBtn) {
            fillSalesBtn.addEventListener("click", () => {
                document.getElementById("loginEmail").value = "sai@sgleadflow.local";
                document.getElementById("loginPassword").value = "sales123";
                clearMessage(loginMsg);
            });
        }

        // Login form submit
        if (loginForm) {
            loginForm.addEventListener("submit", (e) => {
                e.preventDefault();
                clearMessage(loginMsg);

                const email = document.getElementById("loginEmail").value;
                const password = document.getElementById("loginPassword").value;

                const res = login(email, password);
                if (!res.success) {
                    showMessage(loginMsg, res.message, true);
                } else {
                    showMessage(loginMsg, res.message, false);
                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 350);
                }
            });
        }

        // Register form submit
        if (registerForm) {
            registerForm.addEventListener("submit", (e) => {
                e.preventDefault();
                clearMessage(regMsg);

                const name = document.getElementById("registerName").value;
                const email = document.getElementById("registerEmail").value;
                const password = document.getElementById("registerPassword").value;
                const confirmPassword = document.getElementById("confirmPassword").value;
                const role = document.getElementById("registerRole").value;

                if (password !== confirmPassword) {
                    showMessage(regMsg, "Passwords do not match.", true);
                    return;
                }

                if (password.length < 4) {
                    showMessage(regMsg, "Password must be at least 4 characters.", true);
                    return;
                }

                const res = register(name, email, password, role);
                if (!res.success) {
                    showMessage(regMsg, res.message, true);
                } else {
                    showMessage(regMsg, res.message, false);
                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 400);
                }
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initLoginUI);
    } else {
        initLoginUI();
    }

    return {
        getUser,
        isLoggedIn,
        login,
        register,
        logout
    };

})();
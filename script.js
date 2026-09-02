document.addEventListener("DOMContentLoaded", () => {
  const emailStep = document.getElementById("email-step");
  const passwordStep = document.getElementById("password-step");
  const successStep = document.getElementById("success-step");

  const emailForm = document.getElementById("email-form");
  const passwordForm = document.getElementById("password-form");
  const emailInput = document.getElementById("email");
  const accountLabel = document.getElementById("account-label");
  const resetBtn = document.getElementById("reset-btn");

  // Chức năng ẩn/hiện mật khẩu
  const togglePasswordButtons = document.querySelectorAll(".toggle-password");
  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const passwordInput = document.getElementById(targetId);
      
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        button.textContent = "🔒"; // Đổi icon khi hiển thị
      } else {
        passwordInput.type = "password";
        button.textContent = "👁️"; // Đổi lại icon con mắt
      }
    });
  });

  // Bước 1: Nhập email -> Chuyển sang bước nhập mật khẩu mới
  emailForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userEmail = emailInput.value.trim();
    if (userEmail) {
      accountLabel.textContent = userEmail;
      emailStep.classList.remove("active");
      passwordStep.classList.add("active");
    }
  });

  // Bước 2: Nhập mật khẩu mới -> Chuyển sang bước thành công
  passwordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newPass = document.getElementById("new-password").value;
    const confirmPass = document.getElementById("confirm-password").value;

    if (newPass !== confirmPass) {
      alert("Mật khẩu xác nhận không khớp, vui lòng nhập lại!");
      return;
    }

    passwordStep.classList.remove("active");
    successStep.classList.add("active");
  });

  // Bước 3: Nút quay lại trạng thái ban đầu
  resetBtn.addEventListener("click", () => {
    emailForm.reset();
    passwordForm.reset();
    
    // Đưa input mật khẩu về dạng ẩn mặc định
    document.getElementById("new-password").type = "password";
    document.getElementById("confirm-password").type = "password";
    document.querySelectorAll(".toggle-password").forEach(btn => btn.textContent = "👁️");

    successStep.classList.remove("active");
    emailStep.classList.add("active");
  });
});

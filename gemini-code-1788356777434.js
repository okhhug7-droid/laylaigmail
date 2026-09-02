document.addEventListener("DOMContentLoaded", () => {
  const emailStep = document.getElementById("email-step");
  const passwordStep = document.getElementById("password-step");
  const successStep = document.getElementById("success-step");

  const emailForm = document.getElementById("email-form");
  const passwordForm = document.getElementById("password-form");
  const emailInput = document.getElementById("email");
  const accountLabel = document.getElementById("account-label");
  const resetBtn = document.getElementById("reset-btn");

  // Bước 1: Nhập email -> Chuyển sang bước nhập mật khẩu
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
      alert("Mật khẩu không khớp, vui lòng nhập lại!");
      return;
    }

    passwordStep.classList.remove("active");
    successStep.classList.add("active");
  });

  // Bước 3: Nút quay lại trạng thái ban đầu
  resetBtn.addEventListener("click", () => {
    emailForm.reset();
    passwordForm.reset();
    successStep.classList.remove("active");
    emailStep.classList.add("active");
  });
});
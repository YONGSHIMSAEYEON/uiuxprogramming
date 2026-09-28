// 공부메이트 - 5주차 JavaScript
// 기능: "무료로 시작하기" 이메일 신청
//   사용자가 이메일을 입력하고 버튼을 누르면,
//   입력값을 확인해서 상황에 맞는 안내 문구를 보여 주고
//   신청이 끝나면 버튼을 "신청 완료" 상태로 바꾼다.

// ---------- 1. 필요한 HTML 요소 선택 ----------
const form = document.querySelector("#subscribe form");
const emailInput = document.querySelector("#email");
const submitButton = document.querySelector("#subscribe button");
const message = document.querySelector("#form-message");

// ---------- 2. 상태를 담는 변수 ----------
// 이미 신청한 이메일을 기억해 두는 목록 (같은 이메일로 두 번 신청하는 것을 막음)
const joinedEmails = [];

// ---------- 3. 안내 문구를 바꾸는 함수 ----------
// type: "error"(빨강) / "success"(초록) / "info"(파랑)
function showMessage(text, type) {
  message.textContent = text;
  message.className = "form-message " + type;
}

// ---------- 4. 버튼을 누르면 실행되는 함수 ----------
function handleSubmit(event) {
  event.preventDefault(); // 페이지가 새로고침되지 않게 막음

  const email = emailInput.value.trim(); // 앞뒤 공백 제거한 입력값

  // 조건 1: 아무것도 입력하지 않았을 때
  if (email === "") {
    showMessage("이메일을 입력해 주세요.", "error");
    emailInput.classList.add("invalid");
    emailInput.focus();
    return;
  }

  // 조건 2: 이메일 형식이 아닐 때 (@ 와 . 이 없으면)
  if (!email.includes("@") || !email.includes(".")) {
    showMessage("이메일 형식이 올바르지 않아요. 예) name@example.com", "error");
    emailInput.classList.add("invalid");
    emailInput.focus();
    return;
  }

  // 조건 3: 이미 신청한 이메일일 때
  if (joinedEmails.includes(email)) {
    showMessage("이미 신청한 이메일이에요. 메일함을 확인해 주세요.", "info");
    return;
  }

  // 조건 4: 신청 성공
  joinedEmails.push(email);
  emailInput.classList.remove("invalid");

  if (email.endsWith(".ac.kr")) {
    // 학교 이메일이면 학생 혜택 안내를 덧붙임
    showMessage(email + " 신청 완료! 학교 이메일이라 프리미엄 기능 3개월 무료 혜택도 드려요.", "success");
  } else {
    showMessage(email + " 신청 완료! 첫 공부 계획 안내를 메일로 보내 드릴게요.", "success");
  }

  // 버튼 상태 변경: 다시 누를 수 없게 막고 글자를 바꿈
  submitButton.disabled = true;
  submitButton.textContent = "신청 완료";
}

// ---------- 5. 입력 중일 때 실행되는 함수 ----------
// 신청 후 다른 이메일을 입력하면 버튼을 다시 쓸 수 있게 되돌림
function handleInput() {
  emailInput.classList.remove("invalid");

  if (submitButton.disabled) {
    submitButton.disabled = false;
    submitButton.textContent = "무료로 시작하기";
    showMessage("다른 이메일로도 신청할 수 있어요.", "info");
  }
}

// ---------- 6. 이벤트 연결 ----------
form.addEventListener("submit", handleSubmit);   // 폼 제출(버튼 클릭·엔터) 시
emailInput.addEventListener("input", handleInput); // 입력칸에 글자를 쓸 때

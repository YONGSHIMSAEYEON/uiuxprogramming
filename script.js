// 공부메이트 - 5주차 JavaScript
// 기능: "무료로 시작하기" 이메일 신청
//   폼을 제출하면 입력값을 확인해서 상황에 맞는 안내 문구를 보여 주고,
//   신청이 끝나면 버튼을 "신청 완료" 상태로 바꿔 중복 신청을 막는다.

// 개발자 도구 Console에서 script.js 연결 여부를 확인하기 위한 문장
console.log("JavaScript가 연결되었습니다.");

// ---------- 1. 신청 폼의 네 요소 선택 ----------
const subscribeForm = document.querySelector("#subscribe-form");
const emailInput = document.querySelector("#email");
const subscribeButton = document.querySelector("#subscribeButton");
const subscribeMessage = document.querySelector("#subscribeMessage");

// 요소가 보이면 선택 성공, null이면 id 철자를 확인해야 한다
console.log(subscribeForm, emailInput, subscribeButton, subscribeMessage);

// ---------- 2. 변수 ----------
// 서비스 이름처럼 바뀌지 않는 값은 const
const serviceName = "공부메이트";

// 신청 상태와 제출 횟수는 실행 중 바뀌므로 let
let isSubscribed = false;   // Boolean: 신청을 마쳤는가
let submitCount = 0;        // Number: 버튼을 누른 횟수

// ---------- 3. 입력값에 맞는 안내 문구를 만드는 함수 ----------
// 입력(email) → 판단(if) → 결과(돌려주는 문구)
function makeSubscribeMessage(email) {
  if (email === "") {
    return "이메일을 입력한 뒤 신청해 주세요.";
  }

  if (!email.includes("@") || !email.includes(".")) {
    return "이메일 형식이 올바르지 않아요. 예) name@example.com";
  }

  // 학교 이메일이면 학생 혜택 안내를 덧붙임
  if (email.endsWith(".ac.kr")) {
    return email + "로 신청이 완료되었습니다. 학교 이메일이라 프리미엄 기능 3개월 무료 혜택도 드려요.";
  }

  return email + "로 신청이 완료되었습니다. " + serviceName + "의 첫 공부 계획 안내를 보내 드릴게요.";
}

// ---------- 4. 폼이 제출될 때 실행되는 함수 ----------
function handleSubscribe(event) {
  event.preventDefault(); // 폼의 기본 새로고침을 막아 결과를 화면에 보여 줌

  submitCount += 1;
  console.log("폼 제출을 감지했습니다. 제출 횟수: " + submitCount);

  // 이미 신청했다면 아무것도 바꾸지 않음
  if (isSubscribed === true) {
    return;
  }

  const email = emailInput.value.trim(); // String: 앞뒤 공백을 지운 입력값
  subscribeMessage.textContent = makeSubscribeMessage(email);

  // 입력이 비었거나 형식이 틀렸을 때: 오류 스타일
  if (email === "" || !email.includes("@") || !email.includes(".")) {
    subscribeMessage.classList.remove("is-success");
    subscribeMessage.classList.add("is-error");
    emailInput.classList.add("is-error");
    emailInput.focus();
    return;
  }

  // 신청 성공: 상태를 바꾸고 성공 스타일 적용
  isSubscribed = true;
  subscribeMessage.classList.remove("is-error");
  subscribeMessage.classList.add("is-success");
  emailInput.classList.remove("is-error");

  // 버튼을 완료 상태로 바꾸고 중복 제출을 막음
  subscribeButton.textContent = "신청 완료";
  subscribeButton.disabled = true;
}

// ---------- 5. submit 이벤트와 함수 연결 ----------
// 버튼 클릭 또는 Enter → form의 submit 발생 → handleSubscribe 실행
subscribeForm.addEventListener("submit", handleSubscribe);

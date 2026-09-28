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

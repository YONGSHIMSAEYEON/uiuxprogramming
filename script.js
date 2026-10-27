// 공부메이트 - 5·6·7·8·9주차 JavaScript
// 5주차 기능: "무료로 시작하기" 이메일 신청
//   폼을 제출하면 입력값을 확인해서 상황에 맞는 안내 문구를 보여 주고,
//   신청이 끝나면 버튼을 "신청 완료" 상태로 바꿔 중복 신청을 막는다.
// 6주차 기능: 다양한 이벤트(click · input · change)와 탭 UI
//   "미리 써 보기" 탭 3개, 할 일 체크, 공부 시간 막대, 알림 설정,
//   이메일을 입력하는 동안 바로 형식을 알려 주는 안내.
// 7주차 기능: 사용자 흐름 "첫 공부 계획 만들기"
//   시작 → 과목 입력 → 목표 선택 → 확인(확정 팝업) → 완료 / 다시 만들기.
// 8주차(중간고사) 기능: "내 공부 계획" 목록
//   완료 화면에서 저장(중복·최대 개수 검사) → 목록에 카드 추가
//   → 목표로 찾기(결과 없음 안내) · 자세히 보기 · 삭제(확인 팝업, 취소 가능).
// 9주차 기능: 계획 만들기를 하나의 form으로 개선
//   글자 수·조건 실시간 표시, 오류 문구 표시/해제, 선택에 따른 추가 입력(disabled),
//   submit 한 곳에서 최종 검사 → 저장 중(버튼 잠금) → 완료 / 실패(입력 유지, 다시 시도).

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

// =====================================================================
// 6주차: 다양한 이벤트와 탭 UI
// =====================================================================

// ---------- 6. input 이벤트: 이메일을 입력하는 동안 바로 안내 ----------
// 한 글자 입력할 때마다 실행 → 문구 + 입력칸/문구 스타일이 함께 바뀜
function handleEmailInput() {
  if (isSubscribed === true) {
    return;
  }

  const email = emailInput.value.trim();
  subscribeMessage.classList.remove("is-error", "is-success", "is-ready");
  emailInput.classList.remove("is-error", "is-ready");

  if (email === "") {
    subscribeMessage.textContent = "이메일을 입력한 뒤 신청해 주세요.";
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    subscribeMessage.textContent = "입력 중… @와 .이 들어가야 해요.";
    return;
  }

  subscribeMessage.textContent = "좋아요! 이제 '무료로 시작하기'를 눌러 주세요.";
  subscribeMessage.classList.add("is-ready");
  emailInput.classList.add("is-ready");
}

emailInput.addEventListener("input", handleEmailInput);

// ---------- 7. click 이벤트: 탭 3개 전환 ----------
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");

function showTab(tabName) {
  // 탭 버튼: 선택된 것만 is-active + aria-selected="true"
  tabButtons.forEach(function (button) {
    const isSelected = button.dataset.tab === tabName;
    button.classList.toggle("is-active", isSelected);
    button.setAttribute("aria-selected", String(isSelected));
  });

  // 탭 내용: 선택된 탭의 내용만 보이고 나머지는 숨김
  tabPanels.forEach(function (panel) {
    panel.hidden = panel.id !== "panel-" + tabName;
  });

  console.log("선택한 탭: " + tabName);
}

tabButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    showTab(button.dataset.tab);
  });
});

// ---------- 8. change 이벤트: 오늘의 할 일 체크 ----------
// 체크할 때마다 완료 개수 문구 + 체크한 줄 스타일(취소선) + 다 끝나면 문구 색이 바뀜
const todoChecks = document.querySelectorAll(".todo-check");
const todoMessage = document.querySelector("#todoMessage");

function handleTodoChange(event) {
  const item = event.target.closest("li");
  item.classList.toggle("is-done", event.target.checked);

  let doneCount = 0;
  todoChecks.forEach(function (check) {
    if (check.checked) {
      doneCount += 1;
    }
  });

  const total = todoChecks.length;
  const percent = Math.round((doneCount / total) * 100);

  if (doneCount === total) {
    todoMessage.textContent = total + "개 중 " + doneCount + "개 완료 (100%) — 오늘 계획을 모두 끝냈어요!";
    todoMessage.classList.add("is-success");
  } else {
    todoMessage.textContent = total + "개 중 " + doneCount + "개 완료 (" + percent + "%)";
    todoMessage.classList.remove("is-success");
  }
}

todoChecks.forEach(function (check) {
  check.addEventListener("change", handleTodoChange);
});

// ---------- 9. input 이벤트: 공부 시간 막대 ----------
// 막대를 움직이는 동안 계속 실행 → 문구 + 막대 길이 + 목표 달성 시 색이 바뀜
const studyHours = document.querySelector("#studyHours");
const progressBar = document.querySelector("#progressBar");
const progressMessage = document.querySelector("#progressMessage");
const goalHours = 3;

function handleHoursInput() {
  const hours = Number(studyHours.value);
  const percent = Math.min(Math.round((hours / goalHours) * 100), 100);

  progressBar.style.width = percent + "%";

  if (hours >= goalHours) {
    progressMessage.textContent = "오늘 " + hours + "시간 공부! 목표 " + goalHours + "시간을 달성했어요.";
    progressBar.classList.add("is-goal");
    progressMessage.classList.add("is-success");
  } else {
    progressMessage.textContent = "오늘 " + hours + "시간 공부 — 목표까지 " + (goalHours - hours) + "시간 남았어요. (" + percent + "%)";
    progressBar.classList.remove("is-goal");
    progressMessage.classList.remove("is-success");
  }
}

studyHours.addEventListener("input", handleHoursInput);

// ---------- 10. change + click 이벤트: 공부 알림 ----------
const alarmTime = document.querySelector("#alarmTime");
const alarmButton = document.querySelector("#alarmButton");
const alarmMessage = document.querySelector("#alarmMessage");
let isAlarmOn = false;  // Boolean: 알림이 켜져 있는가

// change: 시간을 고르면 문구가 바뀌고 "알림 켜기" 버튼이 활성화됨
function handleAlarmChange() {
  const label = alarmTime.options[alarmTime.selectedIndex].text;

  if (alarmTime.value === "") {
    alarmMessage.textContent = "먼저 알림 받을 시간을 골라 주세요.";
    alarmButton.disabled = true;
    return;
  }

  alarmButton.disabled = false;
  if (isAlarmOn) {
    alarmMessage.textContent = "알림 시간을 " + label + "로 바꿨어요.";
  } else {
    alarmMessage.textContent = label + "에 알림을 받으려면 '알림 켜기'를 눌러 주세요.";
  }
}

// click: 누를 때마다 알림 켜기/끄기 → 버튼 글자·색 + 문구가 함께 바뀜
function handleAlarmClick() {
  const label = alarmTime.options[alarmTime.selectedIndex].text;
  isAlarmOn = !isAlarmOn;

  alarmButton.classList.toggle("is-on", isAlarmOn);
  alarmButton.setAttribute("aria-pressed", String(isAlarmOn));
  alarmMessage.classList.toggle("is-success", isAlarmOn);

  if (isAlarmOn) {
    alarmButton.textContent = "알림 끄기";
    alarmMessage.textContent = "매일 " + label + "에 오늘 공부할 내용을 알려 드릴게요.";
  } else {
    alarmButton.textContent = "알림 켜기";
    alarmMessage.textContent = "알림을 껐어요. 필요할 때 다시 켜 주세요.";
  }
}

alarmTime.addEventListener("change", handleAlarmChange);
alarmButton.addEventListener("click", handleAlarmClick);

// =====================================================================
// 7주차: 사용자 흐름 — 첫 공부 계획 만들기
// 9주차: 세 단계를 하나의 form으로 묶고 입력 경험을 개선
//   입력 중 글자 수·조건 표시 → 단계별 검사 → 조건부 입력(disabled)
//   → submit 한 곳에서 최종 검사 → 저장 중 / 완료 / 실패(다시 시도)
// =====================================================================

// ---------- 11. 흐름에 쓰는 요소 선택 ----------
const planStart = document.querySelector("#planStart");
const planFlow = document.querySelector("#planFlow");
const planForm = document.querySelector("#planForm");
const planSteps = document.querySelectorAll(".plan-step");
const planProgress = document.querySelector("#planProgress");

const subjectName = document.querySelector("#subjectName");
const subjectField = document.querySelector("#subjectField");
const subjectState = document.querySelector("#subjectState");
const subjectCount = document.querySelector("#subjectCount");
const subjectError = document.querySelector("#subjectError");

const goalField = document.querySelector("#goalField");
const goalRadios = document.querySelectorAll('input[name="goal"]');
const goalExam = document.querySelector("#goalExam");
const goalError = document.querySelector("#goalError");
const examArea = document.querySelector("#examArea");
const examDate = document.querySelector("#examDate");
const examError = document.querySelector("#examError");
const studyTime = document.querySelector("#studyTime");

const wantReminder = document.querySelector("#wantReminder");
const reminderArea = document.querySelector("#reminderArea");
const reminderTime = document.querySelector("#reminderTime");
const reminderError = document.querySelector("#reminderError");

const simulateFail = document.querySelector("#simulateFail");
const planStatus = document.querySelector("#planStatus");
const planSubmit = document.querySelector("#planSubmit");
const planBack3 = document.querySelector("#planBack3");
const planResult = document.querySelector("#planResult");

const goalNames = { exam: "시험 대비", assignment: "과제 제출", review: "매일 복습" };
const subjectMin = 2;
const subjectMax = 20;

let currentStep = 1;     // Number: 지금 보이는 단계
let isSaving = false;    // Boolean: 저장 중인가 (중복 제출 방지)

// ---------- 12. 현재 단계만 보여 주는 함수 ----------
function showStep(step) {
  currentStep = step;
  planSteps.forEach(function (item) {
    item.hidden = Number(item.dataset.step) !== step;
  });

  planProgress.textContent = step <= 3
    ? step + " / 3 · 계획 만들기 단계"
    : "계획 완성";
  planProgress.classList.toggle("is-done", step === 4);
}

// ---------- 13. 오류 표시 / 해제를 한 곳에서 처리 ----------
// inputs: 오류를 표시할 입력칸들(라디오는 여러 개), field: 테두리 색을 바꿀 묶음
function showError(inputs, field, errorBox, message) {
  errorBox.textContent = message;
  field.classList.remove("is-valid");
  field.classList.add("has-error");
  inputs.forEach(function (input) {
    input.setAttribute("aria-invalid", "true");
  });
  return false;
}

function clearError(inputs, field, errorBox) {
  errorBox.textContent = "";
  field.classList.remove("has-error");
  inputs.forEach(function (input) {
    input.removeAttribute("aria-invalid");
  });
  return true;
}

// ---------- 14. 항목별 검사 함수 (통과하면 true) ----------
function selectedGoal() {
  const checked = document.querySelector('input[name="goal"]:checked');
  return checked ? checked.value : "";
}

function isDuplicateSubject(subject) {
  return savedPlans.some(function (plan) {
    return plan.subject.toLowerCase() === subject.toLowerCase();
  });
}

// 과목: 빈 값 → 2자 미만 → 이미 저장한 과목 순서로 검사
function validateSubject() {
  const subject = subjectName.value.trim();
  if (subject === "") {
    return showError([subjectName], subjectField, subjectError,
      "과목 이름을 입력해 주세요. 예) 데이터베이스");
  }
  if (subject.length < subjectMin) {
    return showError([subjectName], subjectField, subjectError,
      "과목 이름을 " + subjectMin + "자 이상 입력해 주세요. 지금 " + subject.length + "자예요.");
  }
  if (isDuplicateSubject(subject)) {
    return showError([subjectName], subjectField, subjectError,
      "'" + subject + "'은(는) 이미 내 공부 계획에 있어요. 다른 과목을 적거나, 목록에서 예전 계획을 지운 뒤 다시 시도해 주세요.");
  }
  return clearError([subjectName], subjectField, subjectError);
}

function validateGoal() {
  if (selectedGoal() === "") {
    return showError(goalRadios, goalField, goalError, "이번 주 공부 목표를 하나 골라 주세요.");
  }
  return clearError(goalRadios, goalField, goalError);
}

// 오늘 날짜를 "2026-10-14" 형식으로 (input type="date"와 같은 형식)
function todayText() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return now.getFullYear() + "-" + month + "-" + day;
}

// 숨겨진(disabled) 칸은 검사하지 않음
function validateExamDate() {
  if (examDate.disabled) {
    return clearError([examDate], examArea, examError);
  }
  if (examDate.value === "") {
    return showError([examDate], examArea, examError, "시험 대비를 골랐다면 시험 날짜를 선택해 주세요.");
  }
  if (examDate.value < todayText()) {
    return showError([examDate], examArea, examError, "이미 지난 날짜예요. 오늘(" + todayText() + ") 이후의 날짜를 골라 주세요.");
  }
  return clearError([examDate], examArea, examError);
}

function validateReminder() {
  if (reminderTime.disabled) {
    return clearError([reminderTime], reminderArea, reminderError);
  }
  if (reminderTime.value === "") {
    return showError([reminderTime], reminderArea, reminderError,
      "알림 받을 시간을 골라 주세요. 알림이 필요 없다면 '매일 공부 알림 받기' 체크를 해제해 주세요.");
  }
  return clearError([reminderTime], reminderArea, reminderError);
}

// 한 단계 안의 항목을 모두 검사 (첫 오류에서 멈추지 않고 모든 오류를 표시)
function validateStep(step) {
  if (step === 1) {
    return validateSubject();
  }
  if (step === 2) {
    const goalOk = validateGoal();
    const examOk = validateExamDate();
    const reminderOk = validateReminder();
    return goalOk && examOk && reminderOk;
  }
  return true;
}

// 그 단계의 첫 번째 오류 칸으로 커서 이동
function focusFirstError(step) {
  const stepBox = document.querySelector('.plan-step[data-step="' + step + '"]');
  const firstError = stepBox.querySelector('[aria-invalid="true"]');
  if (firstError) {
    firstError.focus();
  }
}

// ---------- 15. input 이벤트: 입력하는 동안 글자 수와 조건 충족 여부 ----------
// 글자 수는 입력한 그대로 세고, 조건 검사는 앞뒤 공백을 뺀 값으로 한다.
// 오류 문구는 입력할 때마다 새로 띄우지 않고, 이미 오류가 있을 때만 다시 검사해 고쳐지면 해제한다.
function updateSubjectState() {
  const length = subjectName.value.length;
  const subject = subjectName.value.trim();
  subjectCount.textContent = length + " / " + subjectMax + "자";

  const isOk = subject.length >= subjectMin && !isDuplicateSubject(subject);
  if (subject === "") {
    subjectState.textContent = "과목 이름을 2자 이상 입력해 주세요.";
  } else if (subject.length < subjectMin) {
    subjectState.textContent = "조금만 더! " + subjectMin + "자 이상이어야 해요.";
  } else if (!isOk) {
    subjectState.textContent = "이미 저장한 과목이에요.";
  } else {
    subjectState.textContent = "입력 조건을 충족했어요.";
  }
  subjectField.classList.toggle("is-valid", isOk);

  if (subjectName.getAttribute("aria-invalid") === "true") {
    validateSubject();
  }
}

subjectName.addEventListener("input", updateSubjectState);

// ---------- 16. change 이벤트: 선택에 따라 추가 입력 영역 표시 + disabled ----------
// 보이는 상태(hidden) · 입력 가능 상태(disabled) · aria-expanded를 같은 값으로 함께 바꾼다.
// 숨긴 칸은 disabled라 제출값(FormData)에서 빠지고, 값은 남겨 두어 다시 고르면 그대로 보인다.
function toggleArea(area, input, controller, isOpen) {
  area.hidden = !isOpen;
  input.disabled = !isOpen;
  controller.setAttribute("aria-expanded", String(isOpen));
}

function handleGoalChange() {
  toggleArea(examArea, examDate, goalExam, selectedGoal() === "exam");
  clearError(goalRadios, goalField, goalError);
  if (examDate.disabled) {
    clearError([examDate], examArea, examError);
  }
}

goalRadios.forEach(function (radio) {
  radio.addEventListener("change", handleGoalChange);
});

wantReminder.addEventListener("change", function () {
  toggleArea(reminderArea, reminderTime, wantReminder, wantReminder.checked);
  if (reminderTime.disabled) {
    clearError([reminderTime], reminderArea, reminderError);
  }
});

// 오류가 난 칸을 고치면 바로 다시 검사해서 오류를 해제
examDate.addEventListener("change", validateExamDate);
reminderTime.addEventListener("change", validateReminder);

// ---------- 17. 단계 이동 (button) ----------
planStart.addEventListener("click", function () {
  planFlow.hidden = false;
  planStart.setAttribute("aria-expanded", "true");
  showStep(1);
  subjectName.focus();
});

// 다음: 현재 단계를 검사해서 통과하면 다음 단계, 아니면 첫 오류 칸으로
function goNext(step) {
  if (!validateStep(step)) {
    focusFirstError(step);
    return;
  }
  if (step === 2) {
    showSummary();
  }
  showStep(step + 1);
  if (step === 1) {
    goalRadios[0].focus();
  } else {
    planSubmit.focus();
  }
}

document.querySelector("#planNext1").addEventListener("click", function () {
  goNext(1);
});
document.querySelector("#planNext2").addEventListener("click", function () {
  goNext(2);
});

// 이전: 값은 그대로 두고 단계만 이동
document.querySelector("#planBack2").addEventListener("click", function () {
  showStep(1);
  subjectName.focus();
});
planBack3.addEventListener("click", function () {
  showStep(2);
  goalRadios[0].focus();
});

// ---------- 18. 3단계: 입력·선택한 값을 확인 화면에 반영 ----------
function goalText(goal, date) {
  let text = goalNames[goal];
  if (goal === "exam") {
    text += " (시험일 " + date + ")";
  }
  return text;
}

function reminderText(time) {
  if (!time) {
    return "받지 않음";
  }
  return "매일 " + reminderTime.querySelector('option[value="' + time + '"]').text;
}

function showSummary() {
  document.querySelector("#summarySubject").textContent = subjectName.value.trim();
  document.querySelector("#summaryGoal").textContent = goalText(selectedGoal(), examDate.value);
  document.querySelector("#summaryTime").textContent = studyTime.options[studyTime.selectedIndex].text;
  document.querySelector("#summaryReminder").textContent = reminderText(reminderTime.disabled ? "" : reminderTime.value);
}

// ---------- 19. 제출 상태: 기본 / 저장 중 / 실패 ----------
function setSubmitState(state, message) {
  isSaving = state === "loading";
  planSubmit.disabled = isSaving;           // 저장 중에는 버튼을 잠가 중복 제출을 막음
  planBack3.disabled = isSaving;
  planForm.setAttribute("aria-busy", String(isSaving));
  planStatus.classList.remove("is-loading", "is-error");

  if (state === "loading") {
    planSubmit.textContent = "저장 중…";
    planStatus.textContent = "계획을 저장하고 있어요. 잠시만 기다려 주세요.";
    planStatus.classList.add("is-loading");
  } else if (state === "error") {
    planSubmit.textContent = "다시 시도";
    planStatus.textContent = message;
    planStatus.classList.add("is-error");
  } else {
    planSubmit.textContent = "계획 만들기";
    planStatus.textContent = "";
  }
}

// ---------- 20. submit: 최종 검사 → 저장 ----------
// '계획 만들기' 버튼 클릭과 입력칸에서 누른 Enter가 모두 이 submit 이벤트로 들어온다.
planForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (isSaving) {
    return;                                  // 저장 중에 다시 들어온 제출은 무시
  }

  // 1·2단계에서 Enter를 누르면 제출 대신 '다음'과 같이 동작
  if (currentStep < 3) {
    goNext(currentStep);
    return;
  }

  // 모든 단계를 다시 검사하고, 오류가 있으면 그 단계를 열어 첫 오류 칸으로
  for (let step = 1; step <= 2; step += 1) {
    if (!validateStep(step)) {
      showStep(step);
      focusFirstError(step);
      return;
    }
  }

  // 이름(name)이 있고 disabled가 아닌 칸의 값만 모임
  const data = new FormData(planForm);
  console.log("제출값:", Object.fromEntries(data));

  setSubmitState("loading");
  setTimeout(function () {
    savePlan(data);
  }, 1200);                                  // 서버 대신 저장에 걸리는 시간을 흉내
});

// 저장 결과: 성공이면 완료 화면, 실패면 입력값을 그대로 두고 다시 시도 안내
function savePlan(data) {
  if (simulateFail.checked) {
    setSubmitState("error", "저장하지 못했어요. (확인용 실패) 입력한 내용은 그대로 있어요. 체크를 해제하고 '다시 시도'를 눌러 주세요.");
    planSubmit.focus();
    return;
  }
  if (savedPlans.length >= maxPlans) {
    setSubmitState("error", "목록은 최대 " + maxPlans + "개까지라 저장하지 못했어요. 아래 '내 공부 계획'에서 다 끝난 계획을 지운 뒤 '다시 시도'를 눌러 주세요.");
    planSubmit.focus();
    return;
  }

  const plan = {
    id: Date.now(),
    subject: data.get("subject").trim(),
    goal: data.get("goal"),
    examDate: data.get("examDate") || "",            // 숨겨진(disabled) 칸이면 null → 빈 값
    timeText: studyTime.options[studyTime.selectedIndex].text,
    reminderTime: data.get("reminderTime") || "",
    savedDate: todayText()
  };
  savedPlans.push(plan);

  if (!storePlans()) {
    savedPlans.pop();
    setSubmitState("error", "브라우저 저장소에 저장하지 못했어요. 입력한 내용은 그대로 있어요. 잠시 뒤 '다시 시도'를 눌러 주세요.");
    planSubmit.focus();
    return;
  }

  setSubmitState("idle");
  planResult.textContent = plan.subject + " · " + goalText(plan.goal, plan.examDate) + " 계획을 저장했어요. "
    + "매일 " + plan.timeText + "씩 오늘의 할 일로 나눠 드릴게요."
    + (plan.reminderTime ? " 공부 알림은 " + reminderText(plan.reminderTime) + "에 보내 드려요." : "");
  planStart.textContent = "공부 계획 완성";
  planStart.disabled = true;
  showStep(4);

  newPlanId = plan.id;
  listFilter.value = "all";       // 다른 목표로 찾던 중이어도 방금 저장한 계획이 보이도록
  renderList("'" + plan.subject + "' 계획을 목록에 추가했어요.");
  document.querySelector("#planRestart").focus();
}

// ---------- 21. 다시 작성: 입력값 · 안내 문구 · 버튼 상태를 함께 초기화 ----------
function resetPlan() {
  planForm.reset();                          // 입력·선택 값을 처음 값으로
  toggleArea(examArea, examDate, goalExam, false);
  toggleArea(reminderArea, reminderTime, wantReminder, false);
  clearError([subjectName], subjectField, subjectError);
  clearError(goalRadios, goalField, goalError);
  clearError([examDate], examArea, examError);
  clearError([reminderTime], reminderArea, reminderError);
  updateSubjectState();                      // 글자 수 0 / 20자, 안내 문구 처음으로
  setSubmitState("idle");
  planResult.textContent = "";

  planStart.textContent = "첫 공부 계획 만들기";
  planStart.disabled = false;
  showStep(1);
  subjectName.focus();
}

document.querySelector("#planRestart").addEventListener("click", resetPlan);

document.querySelector("#planGoList").addEventListener("click", function () {
  document.querySelector("#planList").scrollIntoView({ behavior: "smooth", block: "start" });
  listFilter.focus({ preventScroll: true });
});

// =====================================================================
// 8주차(중간고사): 내 공부 계획 목록
//   완료 → 목록 카드 → 목표로 찾기 / 자세히 보기 / 삭제
//   (9주차: 저장은 계획 만들기 form의 submit에서 처리 — 위 20번)
// =====================================================================

// ---------- 22. 목록에 쓰는 요소와 상태 ----------
const listFilter = document.querySelector("#listFilter");
const listMessage = document.querySelector("#listMessage");
const planItems = document.querySelector("#planItems");
const listEmpty = document.querySelector("#listEmpty");
const listEmptyText = document.querySelector("#listEmptyText");
const listShowAll = document.querySelector("#listShowAll");
const listNewPlan = document.querySelector("#listNewPlan");
const deleteConfirm = document.querySelector("#deleteConfirm");
const deleteText = document.querySelector("#deleteText");

const maxPlans = 5;               // 목록에 둘 수 있는 계획 수
const storageKey = "studymate-plans";
let savedPlans = loadPlans();     // Array: 저장한 계획 { id, subject, goal, examDate, timeText, reminderTime, savedDate }
let deleteTargetId = null;        // 삭제 팝업에서 지울 계획의 id
let newPlanId = null;             // 방금 저장해서 초록으로 강조할 계획의 id

// 새로고침해도 목록이 남도록 브라우저 저장소(localStorage)에 보관
// (저장소를 쓸 수 없는 브라우저에서는 빈 목록으로 시작)
function loadPlans() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

// 저장에 성공하면 true, 저장소를 쓸 수 없으면 false
function storePlans() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(savedPlans));
    return true;
  } catch (error) {
    console.log("저장소에 저장하지 못했습니다.", error);
    return false;
  }
}

// ---------- 23. 목록 그리기: 목표로 찾기 + 결과 없음 안내 ----------
// 시험 날짜까지 남은 날 (오늘 = 0, 지났으면 음수)
function daysUntil(dateText) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((new Date(dateText) - new Date(todayText())) / oneDay);
}

function detailText(plan) {
  let text = "목표: " + goalNames[plan.goal];
  if (plan.goal === "exam") {
    const days = daysUntil(plan.examDate);
    if (days > 0) {
      text += " (시험일 " + plan.examDate + ", D-" + days + ")";
    } else if (days === 0) {
      text += " (시험일 " + plan.examDate + ", 오늘이 시험날이에요!)";
    } else {
      text += " (시험일 " + plan.examDate + " — 이미 지났어요. 다 끝난 계획이면 지워 주세요.)";
    }
  }
  text += " · 하루 " + plan.timeText;
  if (plan.reminderTime) {
    text += " · 알림 " + reminderText(plan.reminderTime);
  }
  return text + " · 저장한 날 " + plan.savedDate;
}

function makePlanItem(plan) {
  const item = document.createElement("li");
  item.className = "plan-item";
  item.dataset.id = plan.id;
  item.classList.toggle("is-new", plan.id === newPlanId);

  const head = document.createElement("div");
  head.className = "plan-item-head";
  const subject = document.createElement("strong");
  subject.className = "plan-item-subject";
  subject.textContent = plan.subject;          // 입력값은 textContent로만 넣음
  const tag = document.createElement("span");
  tag.className = "goal-tag is-" + plan.goal;
  tag.textContent = goalNames[plan.goal];
  head.append(subject, tag);

  const detail = document.createElement("p");
  detail.className = "plan-item-detail";
  detail.id = "detail-" + plan.id;
  detail.textContent = detailText(plan);
  detail.classList.toggle("is-past", plan.goal === "exam" && daysUntil(plan.examDate) < 0);
  detail.hidden = true;

  const actions = document.createElement("div");
  actions.className = "plan-item-actions";
  const openButton = document.createElement("button");
  openButton.type = "button";
  openButton.className = "item-open";
  openButton.textContent = "자세히 보기";
  openButton.setAttribute("aria-expanded", "false");
  openButton.setAttribute("aria-controls", detail.id);
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "item-delete";
  deleteButton.textContent = "삭제";
  deleteButton.setAttribute("aria-label", plan.subject + " 계획 삭제");
  actions.append(openButton, deleteButton);

  item.append(head, detail, actions);
  return item;
}

// 목록을 지금 상태(savedPlans + 고른 목표)에 맞게 다시 그림
// notice: 저장·삭제 직후 함께 보여 줄 문구
function renderList(notice) {
  const goal = listFilter.value;
  const shownPlans = savedPlans.filter(function (plan) {
    return goal === "all" || plan.goal === goal;
  });

  planItems.innerHTML = "";
  shownPlans.forEach(function (plan) {
    planItems.append(makePlanItem(plan));
  });

  // 개수 문구: 전체 보기 / 목표로 찾기
  let countText = goal === "all"
    ? "저장한 계획 " + savedPlans.length + "개 (최대 " + maxPlans + "개)"
    : goalNames[goal] + " 계획 " + shownPlans.length + "개 / 전체 " + savedPlans.length + "개";
  if (notice) {
    countText = notice + " " + countText;
  }
  listMessage.textContent = countText;

  // 결과 없음: 저장한 계획이 아예 없을 때 / 고른 목표에 맞는 계획이 없을 때
  listEmpty.hidden = shownPlans.length > 0;
  if (savedPlans.length === 0) {
    listEmptyText.textContent = "아직 저장한 계획이 없어요. '첫 공부 계획 만들기'에서 계획을 만들면 여기에 저장돼요.";
    listShowAll.hidden = true;
    listNewPlan.textContent = "첫 공부 계획 만들기";
  } else if (shownPlans.length === 0) {
    listEmptyText.textContent = "'" + goalNames[goal] + "' 목표로 저장한 계획이 없어요. 전체 계획을 보거나 새 계획을 만들어 보세요.";
    listShowAll.hidden = false;
    listNewPlan.textContent = "새 계획 만들기";
  }
}

listFilter.addEventListener("change", function () {
  newPlanId = null;
  renderList();
});

// 결과 없음 → 다른 선택 1: 전체 보기
listShowAll.addEventListener("click", function () {
  listFilter.value = "all";
  renderList();
  listFilter.focus();
});

// 결과 없음 → 다른 선택 2: 계획 만들기 흐름을 1단계부터 다시 열기
listNewPlan.addEventListener("click", function () {
  resetPlan();
  planFlow.hidden = false;
  planStart.setAttribute("aria-expanded", "true");
  planFlow.scrollIntoView({ behavior: "smooth", block: "start" });
  subjectName.focus({ preventScroll: true });
});

// ---------- 24. 카드 버튼: 자세히 보기 / 삭제 ----------
// 카드는 저장할 때마다 새로 만들어지므로 목록(ul) 하나에 click을 연결해 처리
planItems.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }
  const item = button.closest(".plan-item");
  const plan = savedPlans.find(function (p) {
    return String(p.id) === item.dataset.id;
  });

  if (button.classList.contains("item-open")) {
    const detail = item.querySelector(".plan-item-detail");
    const isOpen = detail.hidden;          // 숨겨져 있었으면 이제 연다
    detail.hidden = !isOpen;
    button.textContent = isOpen ? "접기" : "자세히 보기";
    button.setAttribute("aria-expanded", String(isOpen));
    return;
  }

  // 삭제: 바로 지우지 않고 확인 팝업으로 한 번 더 묻기
  deleteTargetId = plan.id;
  deleteText.textContent = plan.subject + " · " + goalNames[plan.goal] + " · 하루 " + plan.timeText
    + " — 지운 계획은 되돌릴 수 없어요.";
  deleteConfirm.showModal();
});

// 취소: 팝업만 닫고 목록은 그대로
document.querySelector("#deleteCancel").addEventListener("click", function () {
  deleteConfirm.close();
  deleteTargetId = null;
});

// 삭제 확정: 목록에서 빼고 다시 그림
document.querySelector("#deleteSubmit").addEventListener("click", function () {
  const target = savedPlans.find(function (plan) {
    return plan.id === deleteTargetId;
  });
  savedPlans = savedPlans.filter(function (plan) {
    return plan.id !== deleteTargetId;
  });
  storePlans();
  deleteConfirm.close();

  deleteTargetId = null;
  newPlanId = null;
  renderList("'" + target.subject + "' 계획을 지웠어요.");
  listFilter.focus();
});

// 처음 열었을 때 저장돼 있던 목록을 그림
renderList();

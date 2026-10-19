// 공부메이트 - 5·6·7·8주차 JavaScript
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
//   시작 → 1 과목 입력 → 2 목표 선택 → 3 확인(확정 팝업) → 완료
// =====================================================================

// ---------- 11. 흐름에 쓰는 요소 선택 ----------
const planStart = document.querySelector("#planStart");
const planFlow = document.querySelector("#planFlow");
const planSteps = document.querySelectorAll(".plan-step");
const planProgress = document.querySelector("#planProgress");

const subjectName = document.querySelector("#subjectName");
const subjectError = document.querySelector("#subjectError");
const planGoal = document.querySelector("#planGoal");
const goalError = document.querySelector("#goalError");
const examLabel = document.querySelector("#examLabel");
const examDate = document.querySelector("#examDate");
const examError = document.querySelector("#examError");
const studyTime = document.querySelector("#studyTime");

const planConfirm = document.querySelector("#planConfirm");
const confirmText = document.querySelector("#confirmText");
const planResult = document.querySelector("#planResult");

const goalNames = { exam: "시험 대비", assignment: "과제 제출", review: "매일 복습" };

// ---------- 12. 현재 단계만 보여 주는 함수 ----------
function showStep(step) {
  planSteps.forEach(function (item) {
    item.hidden = Number(item.dataset.step) !== step;
  });

  planProgress.textContent = step <= 3
    ? step + " / 3 · 계획 만들기 단계"
    : "계획 완성";
  planProgress.classList.toggle("is-done", step === 4);
}

// 오류 표시 / 지우기를 한 곳에서 처리
function showError(input, errorBox, message) {
  errorBox.textContent = message;
  input.classList.add("has-error");
  input.setAttribute("aria-invalid", "true");
  input.focus();
}

function clearError(input, errorBox) {
  errorBox.textContent = "";
  input.classList.remove("has-error");
  input.removeAttribute("aria-invalid");
}

// ---------- 13. 시작: 핵심 행동 버튼 → 1단계 ----------
planStart.addEventListener("click", function () {
  planFlow.hidden = false;
  planStart.setAttribute("aria-expanded", "true");
  showStep(1);
  subjectName.focus();
});

// ---------- 14. 1단계: 과목 이름 검사 ----------
// 행동: '공부 목표 고르기' click → 조건: trim()한 과목 이름이 비었는가?
// → 비었으면 현재 단계에 머물며 고칠 방법 안내 / 있으면 2단계로
document.querySelector("#planNext1").addEventListener("click", function () {
  if (subjectName.value.trim() === "") {
    showError(subjectName, subjectError, "공부할 과목 이름을 입력해 주세요. 예) 데이터베이스");
    return;
  }
  clearError(subjectName, subjectError);
  showStep(2);
  planGoal.focus();
});

// 입력을 고치기 시작하면 오류 표시를 지움
subjectName.addEventListener("input", function () {
  if (subjectName.value.trim() !== "") {
    clearError(subjectName, subjectError);
  }
});

// ---------- 15. 2단계: 목표에 따라 시험 날짜 칸을 보이거나 숨김 ----------
planGoal.addEventListener("change", function () {
  const isExam = planGoal.value === "exam";
  examLabel.hidden = !isExam;
  examDate.hidden = !isExam;

  if (planGoal.value !== "") {
    clearError(planGoal, goalError);
  }
  if (!isExam) {
    examDate.value = "";              // 보이지 않는 칸은 값도 검사도 하지 않음
    clearError(examDate, examError);
  }
});

examDate.addEventListener("change", function () {
  clearError(examDate, examError);
});

// 오늘 날짜를 "2026-10-14" 형식으로 (input type="date"와 같은 형식)
function todayText() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return now.getFullYear() + "-" + month + "-" + day;
}

document.querySelector("#planNext2").addEventListener("click", function () {
  if (planGoal.value === "") {
    showError(planGoal, goalError, "이번 주 공부 목표를 하나 골라 주세요.");
    return;
  }
  clearError(planGoal, goalError);

  if (planGoal.value === "exam") {
    if (examDate.value === "") {
      showError(examDate, examError, "시험 대비를 골랐다면 시험 날짜를 선택해 주세요.");
      return;
    }
    if (examDate.value < todayText()) {
      showError(examDate, examError, "이미 지난 날짜예요. 오늘 이후의 시험 날짜를 골라 주세요.");
      return;
    }
  }
  clearError(examDate, examError);

  showSummary();
  showStep(3);
});

// ---------- 16. 3단계: 입력·선택한 값을 확인 화면에 반영 ----------
function goalText() {
  let text = goalNames[planGoal.value];
  if (planGoal.value === "exam") {
    text += " (시험일 " + examDate.value + ")";
  }
  return text;
}

function showSummary() {
  document.querySelector("#summarySubject").textContent = subjectName.value.trim();
  document.querySelector("#summaryGoal").textContent = goalText();
  document.querySelector("#summaryTime").textContent = studyTime.options[studyTime.selectedIndex].text;
}

// 이전: 값은 그대로 두고 단계만 이동
document.querySelector("#planBack2").addEventListener("click", function () {
  showStep(1);
  subjectName.focus();
});
document.querySelector("#planBack3").addEventListener("click", function () {
  showStep(2);
  planGoal.focus();
});

// ---------- 17. 확정 팝업 → 완료 ----------
document.querySelector("#planComplete").addEventListener("click", function () {
  confirmText.textContent = subjectName.value.trim() + " · " + goalText() + " · 하루 "
    + studyTime.options[studyTime.selectedIndex].text;
  planConfirm.showModal();
});

// 다시 확인(취소): 팝업만 닫고 확인 화면과 값은 그대로
document.querySelector("#confirmCancel").addEventListener("click", function () {
  planConfirm.close();
});

document.querySelector("#confirmSubmit").addEventListener("click", function () {
  planConfirm.close();
  planResult.textContent = subjectName.value.trim() + " · " + goalText() + " 계획이 완성되었습니다. "
    + "매일 " + studyTime.options[studyTime.selectedIndex].text + "씩 오늘의 할 일로 나눠 드릴게요.";
  planStart.textContent = "공부 계획 완성";
  planStart.disabled = true;
  showStep(4);
  document.querySelector("#planRestart").focus();
});

// ---------- 18. 다시 만들기: 입력·선택·오류·진행 상태 초기화 ----------
// 8주차: '새 계획 만들기' 버튼에서도 쓰도록 함수로 분리
function resetPlan() {
  subjectName.value = "";
  planGoal.value = "";
  examDate.value = "";
  studyTime.value = "60";
  examLabel.hidden = true;
  examDate.hidden = true;
  [subjectName, planGoal, examDate].forEach(function (input) {
    input.classList.remove("has-error");
    input.removeAttribute("aria-invalid");
  });
  subjectError.textContent = "";
  goalError.textContent = "";
  examError.textContent = "";
  planResult.textContent = "";

  planStart.textContent = "첫 공부 계획 만들기";
  planStart.disabled = false;
  resetSaveState();
  showStep(1);
  subjectName.focus();
}

document.querySelector("#planRestart").addEventListener("click", resetPlan);

// =====================================================================
// 8주차(중간고사): 내 공부 계획 목록
//   완료 → [내 계획 목록에 저장] → 목록 카드 → 목표로 찾기 / 자세히 보기 / 삭제
// =====================================================================

// ---------- 19. 목록에 쓰는 요소와 상태 ----------
const planSave = document.querySelector("#planSave");
const saveMessage = document.querySelector("#saveMessage");
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
let savedPlans = loadPlans();     // Array: 저장한 계획 { id, subject, goal, examDate, timeText, savedDate }
let currentSavedId = null;        // 지금 완료 화면의 계획이 저장됐다면 그 id
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

function storePlans() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(savedPlans));
  } catch (error) {
    console.log("저장소를 쓸 수 없어 이번 방문 동안만 목록을 유지합니다.");
  }
}

// 저장 버튼과 안내 문구를 처음 상태로
function resetSaveState() {
  currentSavedId = null;
  planSave.disabled = false;
  planSave.textContent = "내 계획 목록에 저장";
  saveMessage.textContent = "이 계획을 '내 공부 계획' 목록에 저장해 두면 언제든 다시 열어 볼 수 있어요.";
  saveMessage.classList.remove("is-error", "is-success");
}

function showSaveError(message) {
  saveMessage.textContent = message;
  saveMessage.classList.remove("is-success");
  saveMessage.classList.add("is-error");
  planSave.focus();
}

// ---------- 20. 저장: 완료한 계획을 목록에 추가 ----------
// 행동: '내 계획 목록에 저장' click
// → 조건 1: 목록이 가득 찼는가? / 조건 2: 같은 과목이 이미 있는가?
// → 실패하면 이유와 고칠 방법 안내(완료 화면 유지) / 성공하면 목록에 추가
planSave.addEventListener("click", function () {
  const subject = subjectName.value.trim();

  if (savedPlans.length >= maxPlans) {
    showSaveError("목록은 최대 " + maxPlans + "개까지예요. 아래 '내 공부 계획'에서 다 끝난 계획을 지운 뒤 다시 저장해 주세요.");
    return;
  }

  const samePlan = savedPlans.find(function (plan) {
    return plan.subject.toLowerCase() === subject.toLowerCase();
  });
  if (samePlan) {
    showSaveError("'" + subject + "' 계획이 이미 목록에 있어요. 목록에서 예전 계획을 지운 뒤 저장하거나, '다시 만들기'로 다른 과목을 만들어 주세요.");
    return;
  }

  const plan = {
    id: Date.now(),
    subject: subject,
    goal: planGoal.value,
    examDate: examDate.value,
    timeText: studyTime.options[studyTime.selectedIndex].text,
    savedDate: todayText()
  };
  savedPlans.push(plan);
  storePlans();

  currentSavedId = plan.id;
  newPlanId = plan.id;
  planSave.disabled = true;
  planSave.textContent = "저장 완료";
  saveMessage.textContent = "'" + subject + "' 계획을 저장했어요. 아래 '내 공부 계획'에서 다시 열어 볼 수 있어요.";
  saveMessage.classList.remove("is-error");
  saveMessage.classList.add("is-success");

  listFilter.value = "all";       // 다른 목표로 찾던 중이어도 방금 저장한 계획이 보이도록
  renderList("'" + subject + "' 계획을 목록에 추가했어요.");
});

// ---------- 21. 목록 그리기: 목표로 찾기 + 결과 없음 안내 ----------
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
  return text + " · 하루 " + plan.timeText + " · 저장한 날 " + plan.savedDate;
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
    listEmptyText.textContent = "아직 저장한 계획이 없어요. 계획을 만든 뒤 완료 화면에서 '내 계획 목록에 저장'을 눌러 주세요.";
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

// ---------- 22. 카드 버튼: 자세히 보기 / 삭제 ----------
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

  // 완료 화면에 떠 있는 계획을 지웠다면 다시 저장할 수 있게 저장 버튼을 되돌림
  if (deleteTargetId === currentSavedId) {
    resetSaveState();
    saveMessage.textContent = "목록에서 이 계획을 지웠어요. 필요하면 다시 저장할 수 있어요.";
  }

  deleteTargetId = null;
  newPlanId = null;
  renderList("'" + target.subject + "' 계획을 지웠어요.");
  listFilter.focus();
});

// 처음 열었을 때 저장돼 있던 목록을 그림
renderList();

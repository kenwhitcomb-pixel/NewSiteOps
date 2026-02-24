const state = {
  user: {
    id: "u_1",
    data: {
      active_account_id: "a_1",
      audio_prompts_enabled: false,
      voice_input_enabled: true,
      confirm_before_save: true
    }
  },
  accounts: [
    { account_id: "a_1", account_name: "Household", role: "AccountOwner" },
    { account_id: "a_2", account_name: "Parents", role: "Viewer" }
  ],
  accountMembers: [
    { account_id: "a_1", user_name: "You", role: "AccountOwner", status: "Active" },
    { account_id: "a_1", user_name: "Sibling", role: "Caregiver", status: "Active" }
  ],
  medications: [
    { account_id: "a_1", medication_name: "Lisinopril", current_dose: "10 mg daily" },
    { account_id: "a_2", medication_name: "Atorvastatin", current_dose: "20 mg nightly" }
  ],
  appointments: [
    { account_id: "a_1", appointment_datetime: "2026-05-10T09:30:00", reason: "Follow-up" }
  ],
  conditions: [
    { account_id: "a_1", condition_name: "Hypertension", status: "Active" }
  ]
};

function getMyAccounts() {
  return state.accounts;
}

function setActiveAccount(accountId) {
  const membership = state.accounts.find((a) => a.account_id === accountId);
  if (!membership) throw new Error("No active membership for selected account.");
  state.user.data.active_account_id = accountId;
  renderAll();
  return membership;
}

function activeAccountGuard(records) {
  return records.filter((r) => r.account_id === state.user.data.active_account_id);
}

function renderAccountSwitcher() {
  const switcher = document.getElementById("accountSwitcher");
  switcher.innerHTML = "";
  getMyAccounts().forEach((account) => {
    const option = document.createElement("option");
    option.value = account.account_id;
    option.textContent = `${account.account_name} (${account.role})`;
    option.selected = account.account_id === state.user.data.active_account_id;
    switcher.appendChild(option);
  });
}

function renderMembers() {
  const current = state.accounts.find((a) => a.account_id === state.user.data.active_account_id);
  const membersNav = document.getElementById("membersNav");
  const canManageMembers = ["AccountOwner", "AccountAdmin"].includes(current?.role);
  membersNav.style.display = canManageMembers ? "block" : "none";

  const list = document.getElementById("memberList");
  list.innerHTML = "";
  if (!canManageMembers) {
    list.innerHTML = "<li>Insufficient permissions.</li>";
    return;
  }
  state.accountMembers
    .filter((m) => m.account_id === current.account_id)
    .forEach((m) => {
      const li = document.createElement("li");
      li.textContent = `${m.user_name} - ${m.role} (${m.status})`;
      list.appendChild(li);
    });
}

function renderMedications() {
  const list = document.getElementById("medicationList");
  list.innerHTML = "";
  activeAccountGuard(state.medications).forEach((m) => {
    const li = document.createElement("li");
    li.textContent = `${m.medication_name} - Current dose: ${m.current_dose}`;
    list.appendChild(li);
  });
}

function renderAppointments() {
  const list = document.getElementById("appointmentList");
  list.innerHTML = "";
  activeAccountGuard(state.appointments).forEach((a) => {
    const li = document.createElement("li");
    li.textContent = `${new Date(a.appointment_datetime).toLocaleString()} - ${a.reason}`;
    list.appendChild(li);
  });
}

function renderConditions() {
  const list = document.getElementById("conditionList");
  list.innerHTML = "";
  activeAccountGuard(state.conditions).forEach((c) => {
    const li = document.createElement("li");
    li.textContent = `${c.condition_name} (${c.status})`;
    list.appendChild(li);
  });
}

function renderAll() {
  renderAccountSwitcher();
  renderMembers();
  renderMedications();
  renderAppointments();
  renderConditions();
}

function activatePage(pageId) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach((n) => n.classList.remove("active"));
  document.getElementById(pageId)?.classList.add("active");
  document.querySelector(`.nav-btn[data-page=\"${pageId}\"]`)?.classList.add("active");
}

function speak(text) {
  if (!state.user.data.audio_prompts_enabled || !window.speechSynthesis) return;
  const utter = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utter);
}

function startVoiceMvpFlow() {
  const transcript = "Add medication Metformin 500 mg twice daily.";
  const parsed = {
    type: "Medication",
    medication_name: "Metformin",
    dose_amount: 500,
    dose_unit: "mg",
    frequency_text: "twice daily"
  };

  document.getElementById("voicePreview").textContent =
    `Transcript: ${transcript}\nParsed: ${JSON.stringify(parsed, null, 2)}`;
  activatePage("voiceReview");
  speak("Voice draft ready. Please review and confirm before save.");
}

function bootstrap() {
  renderAll();

  document.getElementById("accountSwitcher").addEventListener("change", (event) => {
    setActiveAccount(event.target.value);
  });

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => activatePage(btn.dataset.page));
  });

  document.getElementById("voiceBtn").addEventListener("click", startVoiceMvpFlow);

  document.getElementById("audioPromptBtn").addEventListener("click", () => {
    state.user.data.audio_prompts_enabled = !state.user.data.audio_prompts_enabled;
    speak("Audio prompts enabled.");
  });

  document.getElementById("voiceEnabled").addEventListener("change", (e) => {
    state.user.data.voice_input_enabled = e.target.checked;
  });
  document.getElementById("audioEnabled").addEventListener("change", (e) => {
    state.user.data.audio_prompts_enabled = e.target.checked;
  });
  document.getElementById("confirmBeforeSave").addEventListener("change", (e) => {
    state.user.data.confirm_before_save = e.target.checked;
  });

  document.getElementById("confirmVoice").addEventListener("click", () => {
    alert("Saved after confirmation (MVP stub).");
    activatePage("dashboard");
  });
  document.getElementById("rejectVoice").addEventListener("click", () => {
    alert("Draft rejected.");
    activatePage("dashboard");
  });
}

bootstrap();

// Main Application Controller & View Router
import { createIcons, icons } from 'lucide';
import { storage } from './storage.js';
import { sound } from './audio.js';
import { initDraftModule, renderDraftView, showToast } from './draft.js';
import { initTeamsModule, renderTeamsView } from './teams.js';
import { initScheduleModule, renderScheduleView } from './schedule.js';
import { initRulesModule, renderRulesView } from './rules.js';

// Expose lucide to window so modules can call createIcons()
window.lucide = {
  createIcons: () => {
    createIcons({ icons });
  }
};

let currentTab = 'draft-view';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  setupNavigation();
  setupDivisionSwitcher();
  setupHeaderUtilities();

  // Initialize individual view modules
  initDraftModule();
  initTeamsModule();
  initScheduleModule();
  initRulesModule();

  // Subscribe to storage changes for reactive re-render
  storage.subscribe(() => {
    renderCurrentActiveView();
  });

  // Render initial icons
  window.lucide.createIcons();
}

// Tab Switching
function setupNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.target;
      if (targetId === currentTab) return;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      document.querySelectorAll('.tab-view').forEach(view => {
        view.classList.remove('active');
      });

      const targetView = document.getElementById(targetId);
      if (targetView) {
        targetView.classList.add('active');
        currentTab = targetId;
        sound.playClick();
        renderCurrentActiveView();
      }
    });
  });
}

function renderCurrentActiveView() {
  if (currentTab === 'draft-view') {
    renderDraftView();
  } else if (currentTab === 'teams-view') {
    renderTeamsView();
  } else if (currentTab === 'schedule-view') {
    renderScheduleView();
  } else if (currentTab === 'rules-view') {
    renderRulesView();
  }
  window.lucide.createIcons();
}

// Division Switcher (Men's 10 Teams vs Women's 4 Teams)
function setupDivisionSwitcher() {
  const maleBtn = document.getElementById('btn-div-male');
  const femaleBtn = document.getElementById('btn-div-female');
  const activeDiv = storage.getActiveDivision();

  if (activeDiv === 'female') {
    femaleBtn.classList.add('active');
    maleBtn.classList.remove('active');
  } else {
    maleBtn.classList.add('active');
    femaleBtn.classList.remove('active');
  }

  maleBtn.addEventListener('click', () => {
    if (storage.getActiveDivision() === 'male') return;
    storage.setActiveDivision('male');
    maleBtn.classList.add('active');
    femaleBtn.classList.remove('active');
    sound.playClick();
    showToast("Switched to Men's Tournament (10 Teams × 8 Players)", "info");
    renderCurrentActiveView();
  });

  femaleBtn.addEventListener('click', () => {
    if (storage.getActiveDivision() === 'female') return;
    storage.setActiveDivision('female');
    femaleBtn.classList.add('active');
    maleBtn.classList.remove('active');
    sound.playClick();
    showToast("Switched to Women's Tournament (4 Teams × 10 Players)", "info");
    renderCurrentActiveView();
  });
}

// Header Utility Buttons
function setupHeaderUtilities() {
  // Sound toggle
  const soundBtn = document.getElementById('btn-toggle-sound');
  soundBtn.addEventListener('click', () => {
    const isEnabled = sound.toggleSound();
    soundBtn.classList.toggle('active', isEnabled);
    soundBtn.innerHTML = `<i data-lucide="${isEnabled ? 'volume-2' : 'volume-x'}"></i>`;
    window.lucide.createIcons();
    showToast(`Sound Effects: ${isEnabled ? 'ENABLED' : 'MUTED'}`, 'info');
  });

  // Projector / Fullscreen Mode toggle
  const projectorBtn = document.getElementById('btn-toggle-projector');
  projectorBtn.addEventListener('click', () => {
    document.body.classList.toggle('projector-mode');
    const isProjector = document.body.classList.contains('projector-mode');
    projectorBtn.classList.toggle('active', isProjector);

    if (isProjector && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }

    showToast(isProjector ? "Projector / Big Screen Mode: ACTIVATED" : "Standard Display Mode", "info");
  });

  // Data Menu Dropdown
  const dataMenuBtn = document.getElementById('btn-data-menu');
  const dropdown = document.getElementById('data-dropdown');

  dataMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    dropdown.classList.remove('show');
  });

  // Export JSON Backup
  document.getElementById('btn-export-backup').addEventListener('click', () => {
    const data = storage.exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JSG_Box_Cricket_2026_Backup_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast("Complete tournament backup downloaded!", "success");
  });

  // Restore JSON Backup
  const importInput = document.getElementById('input-import-json');
  importInput.addEventListener('change', (e) => {
    if (e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const ok = storage.importAllData(parsed);
        if (ok) {
          showToast("Tournament data restored successfully!", "success");
          renderCurrentActiveView();
        } else {
          alert("Invalid backup file format.");
        }
      } catch (err) {
        alert("Failed to parse backup JSON file.");
      }
    };
    reader.readAsText(file);
  });

  // Reset to Defaults
  document.getElementById('btn-reset-league').addEventListener('click', () => {
    if (confirm("Reset all tournament data to fresh initial state? This will clear all draft assignments and match scores.")) {
      storage.resetToDefaults();
      showToast("Reset to default tournament state.", "info");
      renderCurrentActiveView();
    }
  });
}

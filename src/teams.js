// Teams Management & Roster Viewer Module
import { storage } from './storage.js';
import { sound } from './audio.js';
import { showToast } from './draft.js';

export function initTeamsModule() {
  renderTeamsView();
  setupTeamsEventListeners();
}

export function renderTeamsView() {
  const container = document.getElementById('teams-view-content');
  if (!container) return;

  const division = storage.getActiveDivision();
  const teams = storage.getTeams(division);
  const players = storage.getPlayers(division);
  const isMen = division === 'male';

  container.innerHTML = `
    <!-- Top Action Bar -->
    <div class="teams-page-header glass-panel">
      <div class="header-info">
        <span class="pill-division">${isMen ? "Men's Championship Division" : "Women's Championship Division"}</span>
        <h2>${teams.length} Official Franchise Teams</h2>
        <p>Complete squad rosters, captain designations, and team lineups for JSG-PC Box Cricket 2026</p>
      </div>
      <div class="header-actions">
        <button id="btn-copy-all-whatsapp" class="btn btn-emerald">
          <i data-lucide="message-circle"></i>
          <span>Copy Rosters for WhatsApp</span>
        </button>
        <button id="btn-export-teams-csv" class="btn btn-secondary">
          <i data-lucide="download"></i>
          <span>Download CSV Roster</span>
        </button>
        <button id="btn-add-custom-team" class="btn btn-primary">
          <i data-lucide="plus"></i>
          <span>Add Team</span>
        </button>
      </div>
    </div>

    <!-- Teams Grid -->
    <div class="teams-showcase-grid">
      ${teams.map((team, idx) => {
        const squad = players.filter(p => p.teamId === team.id);
        const captain = squad.find(p => p.category === 'A') || squad.find(p => p.name === team.captain);
        const isFull = squad.length >= team.slotsTotal;
        const progressPct = Math.round((squad.length / team.slotsTotal) * 100);

        return `
          <div class="franchise-card glass-panel" style="--team-glow: ${team.color}">
            <div class="card-crest-banner" style="background: linear-gradient(135deg, ${team.color} 0%, ${team.colorEnd || '#0f172a'} 100%)">
              <div class="crest-top">
                <span class="squad-num">#${idx + 1}</span>
                <span class="division-tag">${team.shortName || 'BCL'}</span>
              </div>
              <div class="crest-center">
                <div class="crest-icon-box">
                  <i data-lucide="${team.icon || 'shield'}"></i>
                </div>
                <h3 class="team-hero-name">${team.name}</h3>
              </div>
              <div class="squad-quota-badge">
                <span>${squad.length} / ${team.slotsTotal} Players</span>
                <div class="mini-bar"><div class="mini-bar-fill" style="width: ${progressPct}%"></div></div>
              </div>
            </div>

            <!-- Captain Spotlight -->
            <div class="captain-spotlight">
              <div class="cap-badge">
                <i data-lucide="crown"></i>
                <span>CAPTAIN</span>
              </div>
              <strong class="captain-name">${team.captain || (captain ? captain.name : 'Not Assigned')}</strong>
            </div>

            <!-- Squad List Table -->
            <div class="squad-roster-list">
              <div class="roster-header">
                <span>Player</span>
                <span>Category & Role</span>
              </div>
              ${squad.length > 0 ? squad.map((p, pIdx) => `
                <div class="roster-item ${p.name === team.captain ? 'is-captain-row' : ''}">
                  <div class="p-left">
                    <span class="p-idx">${pIdx + 1}.</span>
                    <strong class="p-name">${p.name}</strong>
                    ${p.name === team.captain ? `<span class="c-badge">(C)</span>` : ''}
                  </div>
                  <div class="p-right">
                    <span class="category-badge cat-${p.category}">${p.category}</span>
                    <span class="role-desc">${p.role || 'Member'}</span>
                  </div>
                </div>
              `).join('') : `
                <div class="no-squad-msg">
                  <i data-lucide="user-plus"></i>
                  <span>No players assigned yet. Go to Draft room to add players!</span>
                </div>
              `}
            </div>

            <!-- Card Actions -->
            <div class="franchise-card-actions">
              <button class="btn btn-sm btn-secondary btn-copy-team-wa" data-team-id="${team.id}">
                <i data-lucide="share-2"></i>
                <span>WhatsApp Lineup</span>
              </button>
              <button class="btn btn-sm btn-outline btn-edit-team" data-team-id="${team.id}">
                <i data-lucide="edit-2"></i>
                <span>Edit Team</span>
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}

function setupTeamsEventListeners() {
  const container = document.getElementById('teams-view-content');
  if (!container) return;

  container.addEventListener('click', (e) => {
    // Copy single team to WhatsApp
    const waTeamBtn = e.target.closest('.btn-copy-team-wa');
    if (waTeamBtn) {
      const teamId = waTeamBtn.dataset.teamId;
      copySingleTeamWhatsApp(teamId);
      return;
    }

    // Copy all teams to WhatsApp
    if (e.target.closest('#btn-copy-all-whatsapp')) {
      copyAllTeamsWhatsApp();
      return;
    }

    // Export CSV
    if (e.target.closest('#btn-export-teams-csv')) {
      exportTeamsCSV();
      return;
    }

    // Edit Team
    const editBtn = e.target.closest('.btn-edit-team');
    if (editBtn) {
      const teamId = editBtn.dataset.teamId;
      openEditTeamModal(teamId);
      return;
    }

    // Add Custom Team
    if (e.target.closest('#btn-add-custom-team')) {
      openAddTeamModal();
      return;
    }
  });
}

// Copy single team lineup formatted for WhatsApp
function copySingleTeamWhatsApp(teamId) {
  const division = storage.getActiveDivision();
  const team = storage.getTeams(division).find(t => t.id === teamId);
  const squad = storage.getPlayers(division).filter(p => p.teamId === teamId);

  if (!team) return;

  let text = `🏏 *JSG-PC BOX CRICKET LEAGUE 2026* 🏏\n`;
  text += `🏆 *TEAM: ${team.name.toUpperCase()}*\n`;
  text += `👑 *Captain:* ${team.captain || 'N/A'}\n`;
  text += `👥 *Squad (${squad.length}/${team.slotsTotal}):*\n`;
  text += `------------------------------------\n`;

  squad.forEach((p, idx) => {
    const isCap = p.name === team.captain ? ' (C)' : '';
    text += `${idx + 1}. ${p.name}${isCap} [Cat ${p.category} - ${p.role}]\n`;
  });

  text += `------------------------------------\n`;
  text += `#JSGBoxCricket2026 #BCL`;

  navigator.clipboard.writeText(text).then(() => {
    sound.playClick();
    showToast(`Copied ${team.name} lineup to clipboard! Ready to paste into WhatsApp.`, 'success');
  });
}

// Copy all teams to WhatsApp
function copyAllTeamsWhatsApp() {
  const division = storage.getActiveDivision();
  const teams = storage.getTeams(division);
  const players = storage.getPlayers(division);
  const isMen = division === 'male';

  let text = `🏏 *JSG-PC BOX CRICKET LEAGUE 2026* 🏏\n`;
  text += `✨ *OFFICIAL SQUADS ANNOUNCEMENT (${isMen ? "MEN'S 10 TEAMS" : "WOMEN'S 4 TEAMS"})*\n\n`;

  teams.forEach((t, tIdx) => {
    const squad = players.filter(p => p.teamId === t.id);
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `*TEAM ${tIdx + 1}: ${t.name.toUpperCase()}*\n`;
    text += `👑 Captain: ${t.captain || 'TBD'}\n`;
    squad.forEach((p, pIdx) => {
      text += `  ${pIdx + 1}. ${p.name} [Cat ${p.category}]\n`;
    });
    text += `\n`;
  });

  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `📅 Tournament Dates: November 2026 | JSG Box Cricket Arena\n`;

  navigator.clipboard.writeText(text).then(() => {
    sound.playClick();
    showToast(`All teams copied to clipboard for WhatsApp!`, 'success');
  });
}

// Export CSV of squads
function exportTeamsCSV() {
  const division = storage.getActiveDivision();
  const teams = storage.getTeams(division);
  const players = storage.getPlayers(division);

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Team ID,Team Name,Captain,Player Name,Category,Role,Chit Number\n";

  teams.forEach(t => {
    const squad = players.filter(p => p.teamId === t.id);
    squad.forEach(p => {
      csvContent += `"${t.id}","${t.name}","${t.captain || ''}","${p.name}","${p.category}","${p.role}","${p.chitNumber || ''}"\n`;
    });
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `JSG_Box_Cricket_2026_${division}_Rosters.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast("CSV file downloaded successfully!", "success");
}

// Edit Team Modal
function openEditTeamModal(teamId) {
  const division = storage.getActiveDivision();
  const teams = storage.getTeams(division);
  const team = teams.find(t => t.id === teamId);
  if (!team) return;

  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.id = 'edit-team-modal';

  modal.innerHTML = `
    <div class="modal-card glass-panel modal-edit-team animate-scale-up">
      <div class="modal-header">
        <h3>Edit Team: ${team.name}</h3>
        <button class="btn-close-modal" id="btn-close-edit-team">×</button>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <label>Team Name:</label>
          <input type="text" id="edit-team-name" class="form-input" value="${team.name}">
        </div>
        <div class="form-row">
          <label>Short Code (e.g. RCJ):</label>
          <input type="text" id="edit-team-short" class="form-input" value="${team.shortName || ''}">
        </div>
        <div class="form-row">
          <label>Captain Name:</label>
          <input type="text" id="edit-team-captain" class="form-input" value="${team.captain || ''}">
        </div>
        <div class="form-row form-color-row">
          <div>
            <label>Primary Color:</label>
            <input type="color" id="edit-team-color" class="form-color-picker" value="${team.color || '#3b82f6'}">
          </div>
          <div>
            <label>Squad Limit:</label>
            <input type="number" id="edit-team-slots" class="form-input" value="${team.slotsTotal || 8}" min="4" max="20">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="btn-cancel-edit-team">Cancel</button>
        <button class="btn btn-primary" id="btn-save-edit-team">Save Changes</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target.id === 'btn-close-edit-team' || e.target.id === 'btn-cancel-edit-team' || e.target.id === 'edit-team-modal') {
      modal.remove();
      return;
    }

    if (e.target.id === 'btn-save-edit-team') {
      team.name = modal.querySelector('#edit-team-name').value.trim() || team.name;
      team.shortName = modal.querySelector('#edit-team-short').value.trim() || team.shortName;
      team.captain = modal.querySelector('#edit-team-captain').value.trim();
      team.color = modal.querySelector('#edit-team-color').value;
      team.slotsTotal = parseInt(modal.querySelector('#edit-team-slots').value) || team.slotsTotal;

      storage.saveTeams(teams, division);
      showToast(`Updated ${team.name}!`, 'success');
      modal.remove();
      renderTeamsView();
    }
  });
}

// Add Custom Team Modal
function openAddTeamModal() {
  const division = storage.getActiveDivision();
  const teams = storage.getTeams(division);
  const isMen = division === 'male';

  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.id = 'add-team-modal';

  modal.innerHTML = `
    <div class="modal-card glass-panel modal-add-team animate-scale-up">
      <div class="modal-header">
        <h3>Add New Franchise Team (${isMen ? "Men's" : "Women's"})</h3>
        <button class="btn-close-modal" id="btn-close-add-team">×</button>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <label>Team Name:</label>
          <input type="text" id="add-team-name" class="form-input" placeholder="e.g. Pune Warriors JSG">
        </div>
        <div class="form-row">
          <label>Short Code:</label>
          <input type="text" id="add-team-short" class="form-input" placeholder="e.g. PWJ">
        </div>
        <div class="form-row">
          <label>Captain Name:</label>
          <input type="text" id="add-team-captain" class="form-input" placeholder="Enter captain's name">
        </div>
        <div class="form-row form-color-row">
          <div>
            <label>Team Color:</label>
            <input type="color" id="add-team-color" class="form-color-picker" value="#10b981">
          </div>
          <div>
            <label>Squad Limit:</label>
            <input type="number" id="add-team-slots" class="form-input" value="${isMen ? 8 : 10}" min="4" max="20">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="btn-cancel-add-team">Cancel</button>
        <button class="btn btn-primary" id="btn-confirm-add-team">Add Team</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target.id === 'btn-close-add-team' || e.target.id === 'btn-cancel-add-team' || e.target.id === 'add-team-modal') {
      modal.remove();
      return;
    }

    if (e.target.id === 'btn-confirm-add-team') {
      const name = modal.querySelector('#add-team-name').value.trim();
      if (!name) {
        alert('Please enter a team name');
        return;
      }
      const shortName = modal.querySelector('#add-team-short').value.trim() || name.substring(0, 3).toUpperCase();
      const captain = modal.querySelector('#add-team-captain').value.trim();
      const color = modal.querySelector('#add-team-color').value;
      const slotsTotal = parseInt(modal.querySelector('#add-team-slots').value) || (isMen ? 8 : 10);

      const newTeam = {
        id: `${division[0]}-team-${Date.now()}`,
        name,
        shortName,
        captain,
        color,
        colorEnd: color,
        icon: 'shield',
        slotsTotal,
        division
      };

      teams.push(newTeam);
      storage.saveTeams(teams, division);
      showToast(`Team ${name} added!`, 'success');
      modal.remove();
      renderTeamsView();
    }
  });
}

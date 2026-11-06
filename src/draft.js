// Draft and Chit Selection Room Logic
import confetti from 'canvas-confetti';
import { storage } from './storage.js';
import { sound } from './audio.js';

let activeCategoryFilter = 'ALL';
let activeTeamId = null;
let searchQuery = '';
let currentRevealedPlayer = null;
let draftHistory = []; // Stack for undo feature

export function initDraftModule() {
  renderDraftView();
  setupDraftEventListeners();
}

export function setActiveCategory(catId) {
  activeCategoryFilter = catId;
  sound.playClick();
  renderDraftView();
}

export function setActiveTeam(teamId) {
  if (activeTeamId === teamId) {
    activeTeamId = null; // Toggle off
  } else {
    activeTeamId = teamId;
  }
  sound.playClick();
  renderDraftView();
}

export function renderDraftView() {
  const container = document.getElementById('draft-view-content');
  if (!container) return;

  const division = storage.getActiveDivision();
  const teams = storage.getTeams(division);
  const players = storage.getPlayers(division);
  const categories = storage.getCategories();

  const isMen = division === 'male';
  const targetPerTeam = isMen ? 8 : 10;
  const totalSlots = teams.length * targetPerTeam;
  const totalDrafted = players.filter(p => p.teamId).length;
  const unassignedCount = players.filter(p => !p.teamId).length;

  // Filter players
  let filteredPlayers = players.filter(p => {
    const matchCat = activeCategoryFilter === 'ALL' || p.category === activeCategoryFilter;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.role && p.role.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  // Calculate team progress
  const teamsWithCounts = teams.map(t => {
    const drafted = players.filter(p => p.teamId === t.id);
    return {
      ...t,
      count: drafted.length,
      isFull: drafted.length >= t.slotsTotal,
      draftedPlayers: drafted
    };
  });

  const activeTeam = teamsWithCounts.find(t => t.id === activeTeamId);

  container.innerHTML = `
    <!-- Top Statistics & Status Banner -->
    <div class="draft-stats-bar glass-panel">
      <div class="stat-group">
        <div class="stat-item">
          <span class="stat-label">Division</span>
          <span class="stat-val highlight">${isMen ? "Men's Tournament" : "Women's Tournament"}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Teams</span>
          <span class="stat-val">${teams.length} Teams</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Team Squad Limit</span>
          <span class="stat-val">${targetPerTeam} Players</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Draft Progress</span>
          <span class="stat-val highlight">${totalDrafted} / ${totalSlots}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Available Players</span>
          <span class="stat-val">${unassignedCount}</span>
        </div>
      </div>

      <div class="draft-action-btns">
        <button id="btn-chit-draw-mode" class="btn btn-gold">
          <i data-lucide="sparkles"></i>
          <span>Draw Chits Mode</span>
        </button>
        <button id="btn-bulk-import-open" class="btn btn-secondary">
          <i data-lucide="file-up"></i>
          <span>Import / Paste List</span>
        </button>
        <button id="btn-undo-draft" class="btn btn-secondary ${draftHistory.length === 0 ? 'disabled' : ''}" ${draftHistory.length === 0 ? 'disabled' : ''}>
          <i data-lucide="rotate-ccw"></i>
          <span>Undo (${draftHistory.length})</span>
        </button>
      </div>
    </div>

    <!-- Active Captain / Team Selection Banner (Click-to-Assign Helper) -->
    <div class="active-team-indicator ${activeTeam ? 'is-selected' : ''}">
      ${activeTeam ? `
        <div class="active-team-info">
          <div class="pulse-dot"></div>
          <div>
            <span class="active-badge">ACTIVE DRAFT TEAM:</span>
            <strong class="active-name" style="color: ${activeTeam.color}">${activeTeam.name}</strong>
            <span class="active-captain">(Captain: ${activeTeam.captain || 'Not set'})</span>
          </div>
        </div>
        <div class="active-team-status">
          <span class="capacity-pill ${activeTeam.isFull ? 'full' : ''}">
            ${activeTeam.count} / ${activeTeam.slotsTotal} Players
          </span>
          <button id="btn-clear-active-team" class="btn-text">Deselect</button>
        </div>
      ` : `
        <div class="no-active-team-notice">
          <i data-lucide="mouse-pointer-click"></i>
          <span><strong>Quick Assign Mode:</strong> Click any Team card below to make it active, then click any player to instantly add them to that Captain's team!</span>
        </div>
      `}
    </div>

    <!-- Two-column main workspace: Teams Overview (Left) & Players Chit Board (Right) -->
    <div class="draft-workspace-grid">
      
      <!-- LEFT: Captains & Teams Roster Panel -->
      <div class="teams-draft-column">
        <div class="section-header">
          <div class="header-left">
            <i data-lucide="shield"></i>
            <h3>${isMen ? '10 Male Captains & Teams' : '4 Female Captains & Teams'}</h3>
          </div>
          <span class="badge-count">${teams.length} Teams</span>
        </div>

        <div class="teams-card-list">
          ${teamsWithCounts.map((t, idx) => `
            <div class="team-draft-card glass-panel ${activeTeamId === t.id ? 'active-selection' : ''} ${t.isFull ? 'team-full' : ''}"
                 data-team-id="${t.id}"
                 style="--team-accent: ${t.color}">
              <div class="team-card-header">
                <div class="team-identity">
                  <div class="team-num-badge" style="background: ${t.color}">#${idx + 1}</div>
                  <div>
                    <h4 class="team-title">${t.name}</h4>
                    <span class="captain-tag">
                      <i data-lucide="crown"></i> Captain: <strong>${t.captain || 'Assign Captain'}</strong>
                    </span>
                  </div>
                </div>
                <div class="team-meter">
                  <span class="meter-text">${t.count}/${t.slotsTotal}</span>
                  <div class="meter-bar">
                    <div class="meter-fill" style="width: ${(t.count / t.slotsTotal) * 100}%; background: ${t.color}"></div>
                  </div>
                </div>
              </div>

              <!-- Drafted Player Pills inside this team -->
              <div class="team-roster-preview">
                ${t.draftedPlayers.length > 0 ? t.draftedPlayers.map(p => `
                  <div class="drafted-player-chip" title="Click to remove or swap ${p.name}" data-player-id="${p.id}">
                    <span class="chip-cat cat-${p.category}">${p.category}</span>
                    <span class="chip-name">${p.name}</span>
                    <button class="chip-remove-btn" data-player-id="${p.id}" title="Remove player from team">×</button>
                  </div>
                `).join('') : `
                  <span class="empty-roster-text">No players drafted yet. Select this team & click players!</span>
                `}
              </div>

              <div class="team-card-footer">
                <button class="btn btn-sm ${activeTeamId === t.id ? 'btn-active-select' : 'btn-outline'}" data-action="toggle-select-team" data-team-id="${t.id}">
                  <i data-lucide="${activeTeamId === t.id ? 'check-circle' : 'plus-circle'}"></i>
                  <span>${activeTeamId === t.id ? 'Currently Selected' : (t.isFull ? 'Team Full (View)' : 'Select as Target')}</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- RIGHT: Category Filters & Player Pool Chit Cards -->
      <div class="players-draft-column">
        <div class="section-header">
          <div class="header-left">
            <i data-lucide="users"></i>
            <h3>Player Chit Pool & Categories</h3>
          </div>
          <div class="search-box">
            <i data-lucide="search"></i>
            <input type="text" id="draft-player-search" placeholder="Search player name or role..." value="${searchQuery}">
            ${searchQuery ? `<button id="btn-clear-search">×</button>` : ''}
          </div>
        </div>

        <!-- Category Filter Pills -->
        <div class="category-filter-tabs">
          <button class="cat-pill ${activeCategoryFilter === 'ALL' ? 'active' : ''}" data-cat="ALL">
            <span>All Categories</span>
            <span class="pill-count">${players.length}</span>
          </button>
          ${categories
            .filter(cat => players.some(p => p.category === cat.id))
            .map(cat => {
              const catCount = players.filter(p => p.category === cat.id).length;
              const availableCatCount = players.filter(p => p.category === cat.id && !p.teamId).length;
              return `
                <button class="cat-pill ${activeCategoryFilter === cat.id ? 'active' : ''}" data-cat="${cat.id}">
                  <span class="cat-dot" style="background: ${cat.badgeColor}"></span>
                  <span>${cat.name}</span>
                  <span class="pill-count" title="${availableCatCount} available / ${catCount} total">${availableCatCount}/${catCount}</span>
                </button>
              `;
            }).join('')}
        </div>

        <!-- Available Players List / Grid -->
        <div class="players-chit-grid">
          ${filteredPlayers.length > 0 ? filteredPlayers.map(p => {
            const isAssigned = !!p.teamId;
            const assignedTeam = isAssigned ? teams.find(t => t.id === p.teamId) : null;
            return `
              <div class="player-chit-card glass-panel ${isAssigned ? 'is-drafted' : 'is-available'}"
                   data-player-id="${p.id}"
                   data-category="${p.category}">
                <div class="chit-top">
                  <span class="chit-num">#${p.chitNumber || p.id}</span>
                  <span class="category-badge cat-${p.category}">Cat ${p.category}</span>
                </div>
                <div class="chit-body">
                  <h4 class="player-name">${p.name}</h4>
                  <span class="player-role">${p.role || 'Player'}</span>
                </div>
                <div class="chit-status">
                  ${isAssigned ? `
                    <div class="assigned-tag" style="border-left-color: ${assignedTeam ? assignedTeam.color : '#10b981'}">
                      <i data-lucide="check"></i>
                      <span>${assignedTeam ? assignedTeam.name : 'Drafted'}</span>
                    </div>
                  ` : `
                    <button class="btn-draft-action ${activeTeamId ? 'btn-instant-add' : 'btn-choose-team'}" data-player-id="${p.id}">
                      <i data-lucide="${activeTeamId ? 'plus' : 'user-plus'}"></i>
                      <span>${activeTeamId ? `Add to ${activeTeam.shortName || 'Team'}` : 'Assign Team'}</span>
                    </button>
                  `}
                </div>
              </div>
            `;
          }).join('') : `
            <div class="empty-state glass-panel">
              <i data-lucide="user-x"></i>
              <p>No players match the selected filter "${activeCategoryFilter}"</p>
              <button class="btn btn-sm btn-secondary" onclick="document.querySelector('.cat-pill[data-cat=ALL]').click()">Reset Filter</button>
            </div>
          `}
        </div>
      </div>
    </div>
  `;

  // Reinitialize icons in new DOM
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function setupDraftEventListeners() {
  const container = document.getElementById('draft-view-content');
  if (!container) return;

  container.addEventListener('click', (e) => {
    // Category pill click
    const catBtn = e.target.closest('.cat-pill');
    if (catBtn) {
      const cat = catBtn.dataset.cat;
      setActiveCategory(cat);
      return;
    }

    // Toggle team selection
    const teamBtn = e.target.closest('[data-action="toggle-select-team"]');
    if (teamBtn) {
      const teamId = teamBtn.dataset.teamId;
      setActiveTeam(teamId);
      return;
    }

    // Deselect active team
    if (e.target.closest('#btn-clear-active-team')) {
      activeTeamId = null;
      sound.playClick();
      renderDraftView();
      return;
    }

    // Draft player button or player card click
    const draftBtn = e.target.closest('.btn-draft-action');
    const playerCard = e.target.closest('.player-chit-card.is-available');
    if (draftBtn || (playerCard && !e.target.closest('button'))) {
      const playerId = (draftBtn || playerCard).dataset.playerId;
      handlePlayerAssignRequest(playerId);
      return;
    }

    // Remove player chip from team
    const removeBtn = e.target.closest('.chip-remove-btn');
    if (removeBtn) {
      const pId = removeBtn.dataset.playerId;
      handleUnassignPlayer(pId);
      return;
    }

    // Draw Chits Mode open
    if (e.target.closest('#btn-chit-draw-mode')) {
      sound.playClick();
      openChitDrawModal();
      return;
    }

    // Bulk Import open
    if (e.target.closest('#btn-bulk-import-open')) {
      sound.playClick();
      openBulkImportModal();
      return;
    }

    // Undo draft
    if (e.target.closest('#btn-undo-draft')) {
      handleUndo();
      return;
    }

    // Clear search
    if (e.target.closest('#btn-clear-search')) {
      searchQuery = '';
      renderDraftView();
      return;
    }
  });

  // Search input handler
  container.addEventListener('input', (e) => {
    if (e.target.id === 'draft-player-search') {
      searchQuery = e.target.value;
      renderDraftView();
    }
  });
}

// When a player is clicked to be assigned
function handlePlayerAssignRequest(playerId) {
  const division = storage.getActiveDivision();
  const players = storage.getPlayers(division);
  const player = players.find(p => p.id === playerId);
  if (!player) return;

  // If a team is already active, assign directly!
  if (activeTeamId) {
    executeAssignment(playerId, activeTeamId);
  } else {
    // Show quick team selector modal
    showAssignTeamModal(player);
  }
}

// Execute player assignment with sound, confetti, and notification
export function executeAssignment(playerId, teamId) {
  const division = storage.getActiveDivision();
  const result = storage.assignPlayer(playerId, teamId, division);

  if (!result.success) {
    showToast(result.message, 'error');
    return false;
  }

  // Record in history for undo
  draftHistory.push({
    playerId,
    teamId,
    division,
    playerName: result.player.name,
    teamName: result.team.name
  });

  sound.playDraftSuccess();

  // Trigger celebration confetti
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.6 },
    colors: [result.team.color || '#10b981', '#fbbf24', '#ffffff']
  });

  showToast(`🎉 ${result.player.name} added to ${result.team.name}! (${result.count}/${result.total})`, 'success');

  renderDraftView();
  return true;
}

// Unassign player
function handleUnassignPlayer(playerId) {
  const division = storage.getActiveDivision();
  const players = storage.getPlayers(division);
  const player = players.find(p => p.id === playerId);
  if (!player) return;

  if (confirm(`Remove ${player.name} from team and return to draft pool?`)) {
    storage.unassignPlayer(playerId, division);
    sound.playClick();
    showToast(`Removed ${player.name} from team.`, 'info');
    renderDraftView();
  }
}

// Undo last assignment
function handleUndo() {
  if (draftHistory.length === 0) return;
  const lastAction = draftHistory.pop();
  storage.unassignPlayer(lastAction.playerId, lastAction.division);
  sound.playClick();
  showToast(`Undid draft: ${lastAction.playerName} removed from ${lastAction.teamName}`, 'info');
  renderDraftView();
}

// Show Quick Team Picker Modal
function showAssignTeamModal(player) {
  const division = storage.getActiveDivision();
  const teams = storage.getTeams(division);
  const players = storage.getPlayers(division);

  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-backdrop';
  modalOverlay.id = 'assign-team-modal';

  const teamOptionsHtml = teams.map(t => {
    const count = players.filter(p => p.teamId === t.id).length;
    const isFull = count >= t.slotsTotal;
    return `
      <div class="team-select-card ${isFull ? 'disabled' : ''}" data-team-id="${t.id}" style="--team-accent: ${t.color}">
        <div class="team-indicator" style="background: ${t.color}"></div>
        <div class="team-meta">
          <strong>${t.name}</strong>
          <span class="sub">Captain: ${t.captain || 'None'} • ${count}/${t.slotsTotal} players</span>
        </div>
        <button class="btn btn-sm ${isFull ? 'btn-secondary' : 'btn-primary'}" ${isFull ? 'disabled' : ''}>
          ${isFull ? 'Full' : 'Add Player'}
        </button>
      </div>
    `;
  }).join('');

  modalOverlay.innerHTML = `
    <div class="modal-card glass-panel modal-assign animate-scale-up">
      <div class="modal-header">
        <div class="header-content">
          <span class="category-badge cat-${player.category}">Cat ${player.category}</span>
          <h3>Assign ${player.name}</h3>
          <p class="role-desc">Role: ${player.role || 'Squad Member'} • Chit #${player.chitNumber || player.id}</p>
        </div>
        <button class="btn-close-modal" id="btn-close-assign-modal">×</button>
      </div>
      <div class="modal-body">
        <p class="modal-instructions">Select a captain's team to assign this player:</p>
        <div class="team-picker-grid">
          ${teamOptionsHtml}
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target.id === 'assign-team-modal' || e.target.id === 'btn-close-assign-modal') {
      modalOverlay.remove();
      return;
    }

    const card = e.target.closest('.team-select-card:not(.disabled)');
    if (card) {
      const selectedTeamId = card.dataset.teamId;
      modalOverlay.remove();
      executeAssignment(player.id, selectedTeamId);
    }
  });
}

// Helper to randomize an array (Fisher-Yates shuffle)
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// -------------------------------------------------------------
// Interactive Chit Draw (Mystery Box / Lottery Reveal Mode)
// -------------------------------------------------------------
export function openChitDrawModal() {
  const division = storage.getActiveDivision();
  const categories = storage.getCategories();
  const allInitial = storage.getPlayers(division);

  // Find first category with unassigned players
  const availableCats = categories.filter(c => allInitial.some(p => p.category === c.id && !p.teamId));
  let selectedCategory = availableCats.length > 0 ? availableCats[0].id : (activeCategoryFilter !== 'ALL' ? activeCategoryFilter : 'B');

  // Track randomized chits per category so order is thoroughly shuffled
  const shuffledChitsMap = {};

  const modal = document.createElement('div');
  modal.className = 'modal-backdrop chit-draw-modal-backdrop';
  modal.id = 'chit-draw-modal';

  const renderChitDrawInner = (forceReShuffle = false) => {
    const allPlayers = storage.getPlayers(division);
    const unassignedInCat = allPlayers.filter(p => p.category === selectedCategory && !p.teamId);
    const teams = storage.getTeams(division);

    // Shuffle the unassigned players inside this category so nobody knows sequence
    if (!shuffledChitsMap[selectedCategory] || forceReShuffle) {
      shuffledChitsMap[selectedCategory] = shuffleArray(unassignedInCat);
    } else {
      const validIds = new Set(unassignedInCat.map(p => p.id));
      shuffledChitsMap[selectedCategory] = shuffledChitsMap[selectedCategory].filter(p => validIds.has(p.id));
      const existingIds = new Set(shuffledChitsMap[selectedCategory].map(p => p.id));
      const missing = unassignedInCat.filter(p => !existingIds.has(p.id));
      if (missing.length > 0) {
        shuffledChitsMap[selectedCategory] = shuffleArray([...shuffledChitsMap[selectedCategory], ...missing]);
      }
    }

    const chitsToDisplay = shuffledChitsMap[selectedCategory] || [];

    modal.innerHTML = `
      <div class="modal-card modal-fullscreen-chit glass-panel">
        <div class="modal-header">
          <div class="draw-title-group">
            <div class="draw-header-brand">
              <img src="/images/logo.jpg" alt="JSG Federation Logo" class="draw-jsg-logo" />
              <div>
                <span class="live-tag"><span class="live-dot"></span> LIVE CHIT DRAW ROOM</span>
                <h2>JSG-PC BOX CRICKET LEAGUE 2026</h2>
                <p>Jain Social Groups Int. Federation • Sealed chits are randomized for fair selection.</p>
              </div>
            </div>
          </div>
          <button class="btn-close-modal" id="btn-close-draw-modal">×</button>
        </div>

        <!-- Category Picker Bar & Shuffle Control -->
        <div class="draw-cat-selector">
          <div class="draw-cat-left">
            <span class="label">Select Draw Category:</span>
            <div class="draw-cat-pills">
              ${categories
                .filter(c => allPlayers.some(p => p.category === c.id))
                .map(c => {
                  const leftCount = allPlayers.filter(p => p.category === c.id && !p.teamId).length;
                  return `
                    <button class="draw-cat-btn ${selectedCategory === c.id ? 'active' : ''}" data-cat="${c.id}">
                      ${c.name} (${leftCount} Left)
                    </button>
                  `;
                }).join('')}
            </div>
          </div>
          <button id="btn-shuffle-chits" class="btn btn-sm btn-gold" title="Re-shuffle all chits in this category">
            <i data-lucide="shuffle"></i>
            <span>Re-Shuffle Bowl 🔀</span>
          </button>
        </div>

        <!-- Sealed Chits Stage (Randomized Order) -->
        <div class="draw-stage">
          ${chitsToDisplay.length > 0 ? `
            <div class="chits-golden-bowl">
              ${chitsToDisplay.map((p, index) => `
                <div class="sealed-chit-ticket" data-player-id="${p.id}" data-index="${index + 1}">
                  <div class="chit-front">
                    <div class="chit-crest">
                      <img src="/images/logo.jpg" alt="JSG" class="chit-logo-icon" />
                    </div>
                    <span class="chit-stamp">JSG 2026</span>
                    <strong class="chit-serial">CHIT #${index + 1}</strong>
                    <span class="chit-cat-tag">Cat ${p.category}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="all-chits-drawn-message">
              <i data-lucide="check-circle-2"></i>
              <h3>All Chits Drawn for ${categories.find(c => c.id === selectedCategory)?.name || selectedCategory}!</h3>
              <p>Select another category above or view completed team rosters.</p>
            </div>
          `}
        </div>

        <!-- Revealed Player Reveal Stage Container (Populated when chit clicked) -->
        <div id="chit-reveal-spotlight" class="chit-reveal-spotlight hidden"></div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  };

  renderChitDrawInner(true);
  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target.id === 'btn-close-draw-modal') {
      modal.remove();
      renderDraftView();
      return;
    }

    // Category button
    const catBtn = e.target.closest('.draw-cat-btn');
    if (catBtn) {
      selectedCategory = catBtn.dataset.cat;
      sound.playClick();
      renderChitDrawInner(true); // Shuffle whenever new category chosen!
      return;
    }

    // Re-shuffle button click
    if (e.target.closest('#btn-shuffle-chits')) {
      sound.playClick();
      renderChitDrawInner(true);
      showToast(`🔀 Chits in ${selectedCategory} bowl randomized!`, 'info');
      return;
    }

    // Clicked sealed chit ticket!
    const ticket = e.target.closest('.sealed-chit-ticket');
    if (ticket) {
      const playerId = ticket.dataset.playerId;
      revealChitCard(playerId, modal, () => renderChitDrawInner(false));
      return;
    }
  });
}

function revealChitCard(playerId, parentModal, reloadCallback) {
  const division = storage.getActiveDivision();
  const player = storage.getPlayers(division).find(p => p.id === playerId);
  const teams = storage.getTeams(division);
  const players = storage.getPlayers(division);

  if (!player) return;

  sound.playChitReveal();

  // Grand confetti explosion
  confetti({
    particleCount: 120,
    spread: 100,
    origin: { y: 0.5 },
    colors: ['#f59e0b', '#10b981', '#06b6d4', '#ffffff']
  });

  const spotlight = parentModal.querySelector('#chit-reveal-spotlight');
  if (!spotlight) return;

  spotlight.classList.remove('hidden');
  spotlight.innerHTML = `
    <div class="reveal-card-inner animate-reveal">
      <div class="reveal-badge-glow">
        <span class="cat-pill-large cat-${player.category}">Category ${player.category}</span>
        <span class="chit-id">Chit #${player.chitNumber || 'BCL'}</span>
      </div>

      <div class="reveal-avatar">
        <i data-lucide="award"></i>
      </div>

      <h1 class="reveal-player-name">${player.name}</h1>
      <p class="reveal-role-tag">${player.role || 'Player'} • ${division === 'male' ? "Men's League" : "Women's League"}</p>

      <div class="reveal-divider"></div>

      <div class="reveal-team-assign-box">
        <h3>Assign to Captain's Team:</h3>
        <div class="reveal-teams-grid">
          ${teams.map(t => {
            const count = players.filter(p => p.teamId === t.id).length;
            const isFull = count >= t.slotsTotal;
            return `
              <button class="reveal-team-btn ${isFull ? 'disabled' : ''}" data-team-id="${t.id}" ${isFull ? 'disabled' : ''} style="--team-color: ${t.color}">
                <span class="btn-t-name">${t.name}</span>
                <span class="btn-t-cap">Cap: ${t.captain || 'N/A'} (${count}/${t.slotsTotal})</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <button id="btn-cancel-reveal" class="btn btn-secondary mt-3">Cancel / Return to Chits</button>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  spotlight.onclick = (e) => {
    if (e.target.id === 'btn-cancel-reveal') {
      spotlight.classList.add('hidden');
      return;
    }

    const tBtn = e.target.closest('.reveal-team-btn:not(.disabled)');
    if (tBtn) {
      const selectedTeamId = tBtn.dataset.teamId;
      spotlight.classList.add('hidden');
      executeAssignment(player.id, selectedTeamId);
      reloadCallback();
    }
  };
}

// -------------------------------------------------------------
// Bulk Import / Paste Players Modal
// -------------------------------------------------------------
function openBulkImportModal() {
  const division = storage.getActiveDivision();
  const currentPlayers = storage.getPlayers(division);

  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.id = 'bulk-import-modal';

  modal.innerHTML = `
    <div class="modal-card glass-panel modal-import">
      <div class="modal-header">
        <div>
          <h3>Bulk Import / Edit Players (${division === 'male' ? "Men's" : "Women's"})</h3>
          <p class="sub">Paste names line-by-line with Category (A = Captains, B, C, D, E, F) or choose a Category below.</p>
        </div>
        <button class="btn-close-modal" id="btn-close-import">×</button>
      </div>

      <div class="modal-body">
        <div class="import-formats-guide">
          <strong>Supported formats (one per line):</strong>
          <code>Player Name, Category, Role</code> or <code>Player Name, Category</code> or just <code>Player Name</code> (uses target category below)
        </div>

        <div class="form-row">
          <label>Default Category for names without category:</label>
          <select id="import-default-category" class="form-select">
            <option value="A">Category A - Captains</option>
            <option value="B" selected>Category B - Star All-Rounders</option>
            <option value="C">Category C - Power Batsmen</option>
            <option value="D">Category D - Strike Bowlers</option>
            <option value="E">Category E - Keepers & Finishers</option>
            <option value="F">Category F - Dynamic Fielders</option>
          </select>
        </div>

        <div class="form-row">
          <label>Paste Player List:</label>
          <textarea id="import-player-textarea" rows="10" class="form-textarea" placeholder="Example:
Paras Jain, A, Captain / All-Rounder
Amit Shah, B, All-Rounder
Ketan Gadiya, C, Batsman
Rajesh Pipada, D, Bowler"></textarea>
        </div>

        <div class="import-options">
          <label class="checkbox-label">
            <input type="checkbox" id="import-replace-all">
            <span>Replace all current players (Warning: resets current player assignments)</span>
          </label>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" id="btn-cancel-import">Cancel</button>
        <button class="btn btn-primary" id="btn-execute-import">
          <i data-lucide="check"></i>
          <span>Process & Import Players</span>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  if (window.lucide) window.lucide.createIcons();

  modal.addEventListener('click', (e) => {
    if (e.target.id === 'btn-close-import' || e.target.id === 'btn-cancel-import' || e.target.id === 'bulk-import-modal') {
      modal.remove();
      return;
    }

    if (e.target.closest('#btn-execute-import')) {
      const textarea = modal.querySelector('#import-player-textarea');
      const defaultCat = modal.querySelector('#import-default-category').value;
      const replaceAll = modal.querySelector('#import-replace-all').checked;

      const rawText = textarea.value.trim();
      if (!rawText) {
        alert('Please paste some player names first!');
        return;
      }

      const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      const parsedPlayers = [];

      lines.forEach((line, idx) => {
        const parts = line.split(',').map(s => s.trim());
        const name = parts[0];
        let category = (parts[1] || defaultCat).toUpperCase();
        if (!['A', 'B', 'C', 'D', 'E', 'F'].includes(category)) {
          category = defaultCat;
        }
        const role = parts[2] || (category === 'A' ? 'Captain' : 'Player');

        parsedPlayers.push({
          id: `${division[0]}p-custom-${Date.now()}-${idx}`,
          name,
          category,
          role,
          division,
          teamId: null,
          chitNumber: 300 + idx
        });
      });

      let finalPlayerList;
      if (replaceAll) {
        finalPlayerList = parsedPlayers;
      } else {
        finalPlayerList = [...currentPlayers, ...parsedPlayers];
      }

      storage.bulkImportPlayers(finalPlayerList, division);
      sound.playDraftSuccess();
      showToast(`Successfully imported ${parsedPlayers.length} players!`, 'success');
      modal.remove();
      renderDraftView();
    }
  });
}

// Toast notification helper
export function showToast(message, type = 'info') {
  const existing = document.getElementById('bcl-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'bcl-toast';
  toast.className = `bcl-toast toast-${type} animate-fade-in`;
  toast.innerHTML = `
    <div class="toast-content">
      <span>${message}</span>
    </div>
  `;

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// Match Scheduler, Live Scoring, and Points Table Module
import { storage } from './storage.js';
import { sound } from './audio.js';
import { showToast } from './draft.js';

let activeStageFilter = 'ALL';

export function initScheduleModule() {
  renderScheduleView();
  setupScheduleEventListeners();
}

export function renderScheduleView() {
  const container = document.getElementById('schedule-view-content');
  if (!container) return;

  const division = storage.getActiveDivision();
  const matches = storage.getSchedule(division);
  const teams = storage.getTeams(division);
  const isMen = division === 'male';

  // Filter matches
  const filteredMatches = matches.filter(m => {
    if (activeStageFilter === 'ALL') return true;
    return m.stage === activeStageFilter;
  });

  // Calculate points table
  const standings = calculateStandings(teams, matches);

  container.innerHTML = `
    <!-- Top Action Bar -->
    <div class="schedule-header-bar glass-panel">
      <div class="header-info">
        <span class="pill-division">${isMen ? "Men's Tournament (10 Teams)" : "Women's Tournament (4 Teams)"}</span>
        <h2>Match Fixtures & Live Center</h2>
        <p>Real-time tournament schedules, live turf scores, and points standings for JSG-PC 2026</p>
      </div>
      <div class="header-actions">
        <button id="btn-auto-fixtures" class="btn btn-gold">
          <i data-lucide="shuffle"></i>
          <span>Auto Generate Fixtures</span>
        </button>
        <button id="btn-add-fixture" class="btn btn-primary">
          <i data-lucide="calendar-plus"></i>
          <span>Schedule New Match</span>
        </button>
      </div>
    </div>

    <!-- Match Stage Filters -->
    <div class="stage-filter-tabs">
      <button class="stage-pill ${activeStageFilter === 'ALL' ? 'active' : ''}" data-stage="ALL">All Matches (${matches.length})</button>
      <button class="stage-pill ${activeStageFilter === 'League Match' ? 'active' : ''}" data-stage="League Match">League Stage</button>
      <button class="stage-pill ${activeStageFilter === 'Semi-Final' ? 'active' : ''}" data-stage="Semi-Final">Semi-Finals</button>
      <button class="stage-pill ${activeStageFilter === 'Grand Finale' ? 'active' : ''}" data-stage="Grand Finale">Grand Finale 🏆</button>
    </div>

    <!-- Two columns: Fixtures Grid (Left) & Live Points Standings (Right) -->
    <div class="schedule-layout-grid">
      
      <!-- LEFT: Fixture Cards -->
      <div class="fixtures-column">
        <div class="section-title-row">
          <div class="title-with-icon">
            <i data-lucide="clock"></i>
            <h3>Tournament Fixtures (${filteredMatches.length})</h3>
          </div>
        </div>

        <div class="fixtures-card-list">
          ${filteredMatches.length > 0 ? filteredMatches.map(m => {
            const team1 = teams.find(t => t.id === m.team1Id) || { name: 'TBD', color: '#64748b', shortName: 'T1' };
            const team2 = teams.find(t => t.id === m.team2Id) || { name: 'TBD', color: '#64748b', shortName: 'T2' };
            const isCompleted = m.status === 'Completed';
            const isLive = m.status === 'Live';

            return `
              <div class="match-fixture-card glass-panel status-${m.status.toLowerCase()}">
                <div class="match-meta-top">
                  <div class="stage-badge">
                    <span>${m.stage}</span>
                    ${m.group ? `<span class="group-sub">• ${m.group}</span>` : ''}
                  </div>
                  <div class="match-status-badge ${m.status.toLowerCase()}">
                    ${isLive ? '<span class="live-dot-pulse"></span>' : ''}
                    <span>${m.status.toUpperCase()}</span>
                  </div>
                </div>

                <!-- Match Teams vs Row -->
                <div class="match-teams-vs-row">
                  <!-- Team 1 -->
                  <div class="team-side team-1">
                    <div class="team-emblem" style="background: ${team1.color}">
                      <span>${team1.shortName || team1.name.substring(0, 3).toUpperCase()}</span>
                    </div>
                    <div class="team-details">
                      <strong class="team-name">${team1.name}</strong>
                      <span class="cap-name">Cap: ${team1.captain || 'N/A'}</span>
                    </div>
                    <div class="score-display">
                      ${m.team1Score && m.team1Score.overs !== "0.0" ? `
                        <strong class="score-nums">${m.team1Score.runs}/${m.team1Score.wickets}</strong>
                        <span class="overs-sub">(${m.team1Score.overs} ov)</span>
                      ` : `<span class="yet-to-bat">-</span>`}
                    </div>
                  </div>

                  <div class="vs-divider">
                    <span class="vs-text">VS</span>
                    <span class="match-no-tag">M#${m.matchNumber}</span>
                  </div>

                  <!-- Team 2 -->
                  <div class="team-side team-2">
                    <div class="score-display text-right">
                      ${m.team2Score && m.team2Score.overs !== "0.0" ? `
                        <strong class="score-nums">${m.team2Score.runs}/${m.team2Score.wickets}</strong>
                        <span class="overs-sub">(${m.team2Score.overs} ov)</span>
                      ` : `<span class="yet-to-bat">-</span>`}
                    </div>
                    <div class="team-details text-right">
                      <strong class="team-name">${team2.name}</strong>
                      <span class="cap-name">Cap: ${team2.captain || 'N/A'}</span>
                    </div>
                    <div class="team-emblem" style="background: ${team2.color}">
                      <span>${team2.shortName || team2.name.substring(0, 3).toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                <!-- Match Venue, Date & Result -->
                <div class="match-footer-info">
                  <div class="timing-venue">
                    <span><i data-lucide="calendar"></i> ${m.date || 'TBD'}</span>
                    <span><i data-lucide="clock"></i> ${m.time || 'TBD'}</span>
                    <span><i data-lucide="map-pin"></i> ${m.turf || 'Turf 1'}</span>
                  </div>
                  
                  ${m.summary ? `
                    <div class="result-banner">
                      <i data-lucide="${isCompleted ? 'award' : 'info'}"></i>
                      <span>${m.summary}</span>
                    </div>
                  ` : ''}

                  ${m.mom ? `
                    <div class="mom-banner">
                      <i data-lucide="star"></i>
                      <span>Player of the Match: <strong>${m.mom}</strong></span>
                    </div>
                  ` : ''}

                  <div class="match-actions">
                    <button class="btn btn-sm btn-gold btn-score-match" data-match-id="${m.id}">
                      <i data-lucide="edit-3"></i>
                      <span>${isCompleted ? 'Edit Score' : (isLive ? 'Update Live Score' : 'Score Match')}</span>
                    </button>
                    <button class="btn btn-sm btn-outline btn-delete-match" data-match-id="${m.id}" title="Delete Match">
                      <i data-lucide="trash-2"></i>
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('') : `
            <div class="empty-state glass-panel">
              <i data-lucide="calendar-x"></i>
              <p>No matches scheduled yet for this stage.</p>
              <button class="btn btn-primary" id="btn-quick-create-fixtures">Auto-Generate Fixtures Now</button>
            </div>
          `}
        </div>
      </div>

      <!-- RIGHT: Points Table Standings -->
      <div class="standings-column">
        <div class="section-title-row">
          <div class="title-with-icon">
            <i data-lucide="trophy"></i>
            <h3>Points Table Standings</h3>
          </div>
          <span class="live-tag"><span class="live-dot"></span> Auto Calculated</span>
        </div>

        <div class="standings-card glass-panel">
          <div class="standings-table-wrapper">
            <table class="standings-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Team</th>
                  <th title="Matches Played">P</th>
                  <th title="Won">W</th>
                  <th title="Lost">L</th>
                  <th title="Net Run Rate">NRR</th>
                  <th title="Tournament Points">PTS</th>
                </tr>
              </thead>
              <tbody>
                ${standings.map((row, idx) => `
                  <tr class="${idx < (isMen ? 4 : 2) ? 'qualifier-row' : ''}">
                    <td class="rank-col">
                      <span class="rank-num ${idx === 0 ? 'rank-gold' : ''}">${idx + 1}</span>
                    </td>
                    <td class="team-col">
                      <div class="t-cell">
                        <span class="t-pip" style="background: ${row.team.color}"></span>
                        <strong class="t-name" title="${row.team.name}">${row.team.shortName || row.team.name}</strong>
                      </div>
                    </td>
                    <td>${row.played}</td>
                    <td class="text-success">${row.won}</td>
                    <td class="text-danger">${row.lost}</td>
                    <td class="nrr-cell ${row.nrr >= 0 ? 'nrr-pos' : 'nrr-neg'}">${row.nrr >= 0 ? '+' : ''}${row.nrr.toFixed(3)}</td>
                    <td class="pts-cell"><strong>${row.pts}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="standings-legend">
            <div class="legend-item">
              <span class="qualifier-indicator"></span>
              <span>Top ${isMen ? '4 (Semi-Finals)' : '2 (Grand Finale)'} Qualifiers</span>
            </div>
            <span class="rules-hint">Win: 2 pts • Tie: 1 pt • Loss: 0 pts</span>
          </div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}

function setupScheduleEventListeners() {
  const container = document.getElementById('schedule-view-content');
  if (!container) return;

  container.addEventListener('click', (e) => {
    // Stage Filter pill
    const stageBtn = e.target.closest('.stage-pill');
    if (stageBtn) {
      activeStageFilter = stageBtn.dataset.stage;
      sound.playClick();
      renderScheduleView();
      return;
    }

    // Auto Fixtures button
    if (e.target.closest('#btn-auto-fixtures') || e.target.closest('#btn-quick-create-fixtures')) {
      handleAutoGenerateFixtures();
      return;
    }

    // Add Match button
    if (e.target.closest('#btn-add-fixture')) {
      openAddMatchModal();
      return;
    }

    // Score Match button
    const scoreBtn = e.target.closest('.btn-score-match');
    if (scoreBtn) {
      const matchId = scoreBtn.dataset.matchId;
      openScoreModal(matchId);
      return;
    }

    // Delete Match
    const delBtn = e.target.closest('.btn-delete-match');
    if (delBtn) {
      const matchId = delBtn.dataset.matchId;
      handleDeleteMatch(matchId);
      return;
    }
  });
}

// Calculate points table standings from completed matches
function calculateStandings(teams, matches) {
  const stats = teams.map(team => ({
    team,
    played: 0,
    won: 0,
    lost: 0,
    tied: 0,
    pts: 0,
    runsFor: 0,
    oversFor: 0,
    runsAgainst: 0,
    oversAgainst: 0,
    nrr: 0
  }));

  const statMap = new Map(stats.map(s => [s.team.id, s]));

  matches.forEach(m => {
    if (m.status !== 'Completed') return;

    const s1 = statMap.get(m.team1Id);
    const s2 = statMap.get(m.team2Id);
    if (!s1 || !s2) return;

    s1.played += 1;
    s2.played += 1;

    const r1 = m.team1Score?.runs || 0;
    const r2 = m.team2Score?.runs || 0;
    const o1 = parseFloat(m.team1Score?.overs || "8.0") || 8.0;
    const o2 = parseFloat(m.team2Score?.overs || "8.0") || 8.0;

    s1.runsFor += r1;
    s1.oversFor += o1;
    s1.runsAgainst += r2;
    s1.oversAgainst += o2;

    s2.runsFor += r2;
    s2.oversFor += o2;
    s2.runsAgainst += r1;
    s2.oversAgainst += o1;

    if (r1 > r2) {
      s1.won += 1;
      s1.pts += 2;
      s2.lost += 1;
    } else if (r2 > r1) {
      s2.won += 1;
      s2.pts += 2;
      s1.lost += 1;
    } else {
      s1.tied += 1;
      s2.tied += 1;
      s1.pts += 1;
      s2.pts += 1;
    }
  });

  // Calculate NRR
  stats.forEach(s => {
    const forRate = s.oversFor > 0 ? (s.runsFor / s.oversFor) : 0;
    const againstRate = s.oversAgainst > 0 ? (s.runsAgainst / s.oversAgainst) : 0;
    s.nrr = forRate - againstRate;
  });

  // Sort by PTS desc, then NRR desc
  stats.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    return b.nrr - a.nrr;
  });

  return stats;
}

// Auto-generate tournament fixtures
function handleAutoGenerateFixtures() {
  const division = storage.getActiveDivision();
  const teams = storage.getTeams(division);
  const isMen = division === 'male';

  if (teams.length < 2) {
    alert("Please ensure at least 2 teams exist to generate fixtures.");
    return;
  }

  const generated = [];
  let matchNo = 1;

  if (isMen && teams.length >= 10) {
    // 10 Teams: Split into Pool A (5 teams) and Pool B (5 teams)
    const poolA = teams.slice(0, 5);
    const poolB = teams.slice(5, 10);

    const generateRoundRobin = (pool, groupName, turf) => {
      for (let i = 0; i < pool.length; i++) {
        for (let j = i + 1; j < pool.length; j++) {
          generated.push({
            id: `match-m-${Date.now()}-${matchNo}`,
            matchNumber: matchNo++,
            division: 'male',
            stage: 'League Match',
            group: groupName,
            team1Id: pool[i].id,
            team2Id: pool[j].id,
            date: '2026-11-14',
            time: `${9 + (matchNo % 8)}:00 ${matchNo > 4 ? 'PM' : 'AM'}`,
            turf: turf,
            status: 'Upcoming',
            team1Score: { runs: 0, wickets: 0, overs: '0.0' },
            team2Score: { runs: 0, wickets: 0, overs: '0.0' },
            winnerId: null,
            mom: null,
            summary: `${pool[i].name} vs ${pool[j].name}`
          });
        }
      }
    };

    generateRoundRobin(poolA, 'Pool A', 'Turf Alpha');
    generateRoundRobin(poolB, 'Pool B', 'Turf Beta');

    // Knockouts
    generated.push({
      id: `match-m-semi1`,
      matchNumber: matchNo++,
      division: 'male',
      stage: 'Semi-Final',
      group: 'Semi-Final 1',
      team1Id: poolA[0].id,
      team2Id: poolB[1].id,
      date: '2026-11-15',
      time: '04:00 PM',
      turf: 'Turf Alpha (Main Arena)',
      status: 'Upcoming',
      team1Score: { runs: 0, wickets: 0, overs: '0.0' },
      team2Score: { runs: 0, wickets: 0, overs: '0.0' },
      winnerId: null,
      mom: null,
      summary: `Semi-Final 1: Pool A Winner vs Pool B Runner-up`
    });

    generated.push({
      id: `match-m-semi2`,
      matchNumber: matchNo++,
      division: 'male',
      stage: 'Semi-Final',
      group: 'Semi-Final 2',
      team1Id: poolB[0].id,
      team2Id: poolA[1].id,
      date: '2026-11-15',
      time: '05:30 PM',
      turf: 'Turf Alpha (Main Arena)',
      status: 'Upcoming',
      team1Score: { runs: 0, wickets: 0, overs: '0.0' },
      team2Score: { runs: 0, wickets: 0, overs: '0.0' },
      winnerId: null,
      mom: null,
      summary: `Semi-Final 2: Pool B Winner vs Pool A Runner-up`
    });

    generated.push({
      id: `match-m-final`,
      matchNumber: matchNo++,
      division: 'male',
      stage: 'Grand Finale',
      group: 'Championship Final',
      team1Id: poolA[0].id,
      team2Id: poolB[0].id,
      date: '2026-11-15',
      time: '07:30 PM',
      turf: 'Turf Alpha (Championship Court)',
      status: 'Upcoming',
      team1Score: { runs: 0, wickets: 0, overs: '0.0' },
      team2Score: { runs: 0, wickets: 0, overs: '0.0' },
      winnerId: null,
      mom: null,
      summary: `Grand Finale: JSG Men's Box Cricket Championship Trophy`
    });

  } else {
    // 4 Teams Round Robin
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        generated.push({
          id: `match-w-${Date.now()}-${matchNo}`,
          matchNumber: matchNo++,
          division: division,
          stage: 'League Match',
          group: "Women's League",
          team1Id: teams[i].id,
          team2Id: teams[j].id,
          date: '2026-11-14',
          time: `${2 + matchNo}:00 PM`,
          turf: matchNo % 2 === 0 ? 'Turf Alpha' : 'Turf Beta',
          status: 'Upcoming',
          team1Score: { runs: 0, wickets: 0, overs: '0.0' },
          team2Score: { runs: 0, wickets: 0, overs: '0.0' },
          winnerId: null,
          mom: null,
          summary: `${teams[i].name} vs ${teams[j].name}`
        });
      }
    }

    // Grand Finale for 4 teams
    generated.push({
      id: `match-w-final`,
      matchNumber: matchNo++,
      division: division,
      stage: 'Grand Finale',
      group: 'Championship Final',
      team1Id: teams[0].id,
      team2Id: teams[1].id,
      date: '2026-11-15',
      time: '06:30 PM',
      turf: 'Turf Alpha (Main Arena)',
      status: 'Upcoming',
      team1Score: { runs: 0, wickets: 0, overs: '0.0' },
      team2Score: { runs: 0, wickets: 0, overs: '0.0' },
      winnerId: null,
      mom: null,
      summary: `Grand Finale: Women's Championship Trophy Match`
    });
  }

  // Preserve other division matches
  const allExisting = storage.getSchedule();
  const otherDivisionMatches = allExisting.filter(m => m.division !== division);
  const combined = [...otherDivisionMatches, ...generated];

  storage.saveSchedule(combined);
  sound.playDraftSuccess();
  showToast(`Generated ${generated.length} official tournament fixtures!`, 'success');
  renderScheduleView();
}

// Live Score Card Editor Modal
function openScoreModal(matchId) {
  const matches = storage.getSchedule();
  const match = matches.find(m => m.id === matchId);
  if (!match) return;

  const teams = storage.getTeams(match.division);
  const team1 = teams.find(t => t.id === match.team1Id) || { name: 'Team 1' };
  const team2 = teams.find(t => t.id === match.team2Id) || { name: 'Team 2' };

  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.id = 'score-modal';

  modal.innerHTML = `
    <div class="modal-card glass-panel modal-score animate-scale-up">
      <div class="modal-header">
        <div>
          <h3>Match #${match.matchNumber}: ${match.stage}</h3>
          <p class="sub">${team1.name} vs ${team2.name}</p>
        </div>
        <button class="btn-close-modal" id="btn-close-score">×</button>
      </div>

      <div class="modal-body">
        <div class="form-row">
          <label>Match Status:</label>
          <select id="score-match-status" class="form-select">
            <option value="Upcoming" ${match.status === 'Upcoming' ? 'selected' : ''}>Upcoming</option>
            <option value="Live" ${match.status === 'Live' ? 'selected' : ''}>🔴 Live In Progress</option>
            <option value="Completed" ${match.status === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
        </div>

        <!-- Team 1 Score inputs -->
        <div class="score-team-fieldset">
          <h4>${team1.name} Score:</h4>
          <div class="score-inputs-grid">
            <div>
              <label>Runs:</label>
              <input type="number" id="t1-runs" class="form-input" value="${match.team1Score?.runs || 0}" min="0">
            </div>
            <div>
              <label>Wickets:</label>
              <input type="number" id="t1-wickets" class="form-input" value="${match.team1Score?.wickets || 0}" min="0" max="10">
            </div>
            <div>
              <label>Overs Bowled:</label>
              <input type="text" id="t1-overs" class="form-input" value="${match.team1Score?.overs || '8.0'}" placeholder="e.g. 8.0">
            </div>
          </div>
        </div>

        <!-- Team 2 Score inputs -->
        <div class="score-team-fieldset">
          <h4>${team2.name} Score:</h4>
          <div class="score-inputs-grid">
            <div>
              <label>Runs:</label>
              <input type="number" id="t2-runs" class="form-input" value="${match.team2Score?.runs || 0}" min="0">
            </div>
            <div>
              <label>Wickets:</label>
              <input type="number" id="t2-wickets" class="form-input" value="${match.team2Score?.wickets || 0}" min="0" max="10">
            </div>
            <div>
              <label>Overs Bowled:</label>
              <input type="text" id="t2-overs" class="form-input" value="${match.team2Score?.overs || '8.0'}" placeholder="e.g. 7.4">
            </div>
          </div>
        </div>

        <div class="form-row">
          <label>Player of the Match (MOM):</label>
          <input type="text" id="match-mom" class="form-input" placeholder="Enter player name" value="${match.mom || ''}">
        </div>

        <div class="form-row">
          <label>Match Summary Note:</label>
          <input type="text" id="match-summary-note" class="form-input" placeholder="e.g. Royal Challengers won by 12 runs" value="${match.summary || ''}">
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" id="btn-cancel-score">Cancel</button>
        <button class="btn btn-primary" id="btn-save-score">Save Match Score</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target.id === 'btn-close-score' || e.target.id === 'btn-cancel-score' || e.target.id === 'score-modal') {
      modal.remove();
      return;
    }

    if (e.target.id === 'btn-save-score') {
      const status = modal.querySelector('#score-match-status').value;
      const r1 = parseInt(modal.querySelector('#t1-runs').value) || 0;
      const w1 = parseInt(modal.querySelector('#t1-wickets').value) || 0;
      const o1 = modal.querySelector('#t1-overs').value.trim() || '8.0';

      const r2 = parseInt(modal.querySelector('#t2-runs').value) || 0;
      const w2 = parseInt(modal.querySelector('#t2-wickets').value) || 0;
      const o2 = modal.querySelector('#t2-overs').value.trim() || '8.0';

      const mom = modal.querySelector('#match-mom').value.trim();
      let summary = modal.querySelector('#match-summary-note').value.trim();

      // Auto-generate result summary if blank
      if (status === 'Completed' && !summary) {
        if (r1 > r2) {
          summary = `${team1.name} won by ${r1 - r2} runs`;
        } else if (r2 > r1) {
          summary = `${team2.name} won by ${10 - w2} wickets`;
        } else {
          summary = `Match Tied (Super Over required)`;
        }
      }

      match.status = status;
      match.team1Score = { runs: r1, wickets: w1, overs: o1 };
      match.team2Score = { runs: r2, wickets: w2, overs: o2 };
      match.mom = mom || null;
      match.summary = summary;

      if (status === 'Completed') {
        match.winnerId = r1 > r2 ? match.team1Id : (r2 > r1 ? match.team2Id : 'TIED');
      }

      storage.saveSchedule(matches);
      sound.playWhistle();
      showToast(`Scorecard for Match #${match.matchNumber} updated!`, 'success');
      modal.remove();
      renderScheduleView();
    }
  });
}

// Add Custom Match Modal
function openAddMatchModal() {
  const division = storage.getActiveDivision();
  const teams = storage.getTeams(division);
  const matches = storage.getSchedule();

  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.id = 'add-match-modal';

  modal.innerHTML = `
    <div class="modal-card glass-panel modal-add-match animate-scale-up">
      <div class="modal-header">
        <h3>Schedule New Match</h3>
        <button class="btn-close-modal" id="btn-close-add-m">×</button>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <label>Stage:</label>
          <select id="new-match-stage" class="form-select">
            <option value="League Match">League Match</option>
            <option value="Quarter-Final">Quarter-Final</option>
            <option value="Semi-Final">Semi-Final</option>
            <option value="Grand Finale">Grand Finale</option>
          </select>
        </div>

        <div class="form-row form-color-row">
          <div>
            <label>Team 1:</label>
            <select id="new-m-t1" class="form-select">
              ${teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
            </select>
          </div>
          <div>
            <label>Team 2:</label>
            <select id="new-m-t2" class="form-select">
              ${teams.map((t, idx) => `<option value="${t.id}" ${idx === 1 ? 'selected' : ''}>${t.name}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-row form-color-row">
          <div>
            <label>Date:</label>
            <input type="date" id="new-m-date" class="form-input" value="2026-11-14">
          </div>
          <div>
            <label>Time:</label>
            <input type="text" id="new-m-time" class="form-input" value="10:00 AM">
          </div>
        </div>

        <div class="form-row">
          <label>Turf / Court:</label>
          <input type="text" id="new-m-turf" class="form-input" value="Turf Alpha (Main Arena)">
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="btn-cancel-add-m">Cancel</button>
        <button class="btn btn-primary" id="btn-save-new-m">Create Fixture</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target.id === 'btn-close-add-m' || e.target.id === 'btn-cancel-add-m' || e.target.id === 'add-match-modal') {
      modal.remove();
      return;
    }

    if (e.target.id === 'btn-save-new-m') {
      const stage = modal.querySelector('#new-match-stage').value;
      const t1 = modal.querySelector('#new-m-t1').value;
      const t2 = modal.querySelector('#new-m-t2').value;
      const date = modal.querySelector('#new-m-date').value;
      const time = modal.querySelector('#new-m-time').value.trim() || '10:00 AM';
      const turf = modal.querySelector('#new-m-turf').value.trim() || 'Turf 1';

      if (t1 === t2) {
        alert("Team 1 and Team 2 cannot be the same!");
        return;
      }

      const newMatch = {
        id: `match-custom-${Date.now()}`,
        matchNumber: matches.length + 1,
        division,
        stage,
        group: stage,
        team1Id: t1,
        team2Id: t2,
        date,
        time,
        turf,
        status: 'Upcoming',
        team1Score: { runs: 0, wickets: 0, overs: '0.0' },
        team2Score: { runs: 0, wickets: 0, overs: '0.0' },
        winnerId: null,
        mom: null,
        summary: `Match scheduled`
      };

      matches.push(newMatch);
      storage.saveSchedule(matches);
      showToast("New match scheduled successfully!", "success");
      modal.remove();
      renderScheduleView();
    }
  });
}

function handleDeleteMatch(matchId) {
  if (confirm("Delete this match fixture?")) {
    const allMatches = storage.getSchedule().filter(m => m.id !== matchId);
    storage.saveSchedule(allMatches);
    showToast("Match removed.", "info");
    renderScheduleView();
  }
}

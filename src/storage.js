// LocalStorage State Manager with JSON export/import and reactive listeners
import {
  DEFAULT_MALE_TEAMS,
  DEFAULT_FEMALE_TEAMS,
  INITIAL_MALE_PLAYERS,
  INITIAL_FEMALE_PLAYERS,
  CATEGORIES,
  OFFICIAL_RULES,
  INITIAL_SCHEDULE
} from './data.js';

const STORAGE_KEYS = {
  TEAMS_MALE: 'jsg_bcl_teams_male_2026',
  TEAMS_FEMALE: 'jsg_bcl_teams_female_2026',
  PLAYERS_MALE: 'jsg_bcl_players_male_2026',
  PLAYERS_FEMALE: 'jsg_bcl_players_female_2026',
  CATEGORIES: 'jsg_bcl_categories_2026',
  SCHEDULE: 'jsg_bcl_schedule_2026',
  RULES: 'jsg_bcl_rules_2026',
  CUSTOM_IMAGES: 'jsg_bcl_custom_images_2026',
  ACTIVE_DIVISION: 'jsg_bcl_active_division'
};

class LeagueStorage {
  constructor() {
    this.listeners = new Set();
    this.ensureInitialized();
  }

  ensureInitialized() {
    const version = localStorage.getItem('jsg_bcl_version_v3');
    if (version !== 'v3' || !localStorage.getItem(STORAGE_KEYS.TEAMS_MALE)) {
      this.resetToDefaults();
      localStorage.setItem('jsg_bcl_version_v3', 'v3');
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach(cb => {
      try {
        cb();
      } catch (e) {
        console.error('Storage listener error:', e);
      }
    });
  }

  getActiveDivision() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_DIVISION) || 'male';
  }

  setActiveDivision(div) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_DIVISION, div);
    this.notify();
  }

  getTeams(division = null) {
    const div = division || this.getActiveDivision();
    const key = div === 'male' ? STORAGE_KEYS.TEAMS_MALE : STORAGE_KEYS.TEAMS_FEMALE;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : (div === 'male' ? DEFAULT_MALE_TEAMS : DEFAULT_FEMALE_TEAMS);
    } catch {
      return div === 'male' ? DEFAULT_MALE_TEAMS : DEFAULT_FEMALE_TEAMS;
    }
  }

  saveTeams(teams, division = null) {
    const div = division || this.getActiveDivision();
    const key = div === 'male' ? STORAGE_KEYS.TEAMS_MALE : STORAGE_KEYS.TEAMS_FEMALE;
    localStorage.setItem(key, JSON.stringify(teams));
    this.notify();
  }

  getPlayers(division = null) {
    const div = division || this.getActiveDivision();
    const key = div === 'male' ? STORAGE_KEYS.PLAYERS_MALE : STORAGE_KEYS.PLAYERS_FEMALE;
    const defaults = div === 'male' ? INITIAL_MALE_PLAYERS : INITIAL_FEMALE_PLAYERS;
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaults;
      const players = JSON.parse(data);
      // Ensure phone and age are always populated even if loaded from older localStorage
      return players.map(p => {
        if (!p.phone) {
          const match = defaults.find(d => d.id === p.id || d.name.toLowerCase() === p.name.toLowerCase());
          if (match) {
            return { ...p, phone: match.phone, age: match.age };
          }
        }
        return p;
      });
    } catch {
      return defaults;
    }
  }

  savePlayers(players, division = null) {
    const div = division || this.getActiveDivision();
    const key = div === 'male' ? STORAGE_KEYS.PLAYERS_MALE : STORAGE_KEYS.PLAYERS_FEMALE;
    localStorage.setItem(key, JSON.stringify(players));
    this.notify();
  }

  getCategories() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : CATEGORIES;
    } catch {
      return CATEGORIES;
    }
  }

  saveCategories(cats) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));
    this.notify();
  }

  getSchedule(division = null) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
      const allMatches = data ? JSON.parse(data) : INITIAL_SCHEDULE;
      if (division) {
        return allMatches.filter(m => m.division === division);
      }
      return allMatches;
    } catch {
      return division ? INITIAL_SCHEDULE.filter(m => m.division === division) : INITIAL_SCHEDULE;
    }
  }

  saveSchedule(matches) {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(matches));
    this.notify();
  }

  getRules() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RULES);
      return data ? JSON.parse(data) : OFFICIAL_RULES;
    } catch {
      return OFFICIAL_RULES;
    }
  }

  saveRules(rules) {
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(rules));
    this.notify();
  }

  getCustomImages() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_IMAGES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  addCustomImage(imgObject) {
    const images = this.getCustomImages();
    images.unshift(imgObject);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_IMAGES, JSON.stringify(images));
    this.notify();
  }

  deleteCustomImage(id) {
    const images = this.getCustomImages().filter(img => img.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_IMAGES, JSON.stringify(images));
    this.notify();
  }

  // Assign Player to Team
  assignPlayer(playerId, teamId, division = null) {
    const div = division || this.getActiveDivision();
    const players = this.getPlayers(div);
    const teams = this.getTeams(div);
    const targetTeam = teams.find(t => t.id === teamId);

    if (!targetTeam) return { success: false, message: "Team not found" };

    // Check capacity
    const currentCount = players.filter(p => p.teamId === teamId).length;
    if (currentCount >= targetTeam.slotsTotal) {
      return {
        success: false,
        message: `${targetTeam.name} is already full (${targetTeam.slotsTotal}/${targetTeam.slotsTotal} players)`
      };
    }

    const playerIndex = players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return { success: false, message: "Player not found" };

    // If player is Category A (Captain), update captain slot
    const player = players[playerIndex];
    player.teamId = teamId;
    if (player.category === 'A' && !targetTeam.captain) {
      targetTeam.captain = player.name;
      this.saveTeams(teams, div);
    }

    this.savePlayers(players, div);
    return {
      success: true,
      player,
      team: targetTeam,
      count: currentCount + 1,
      total: targetTeam.slotsTotal
    };
  }

  // Remove Player from Team
  unassignPlayer(playerId, division = null) {
    const div = division || this.getActiveDivision();
    const players = this.getPlayers(div);
    const player = players.find(p => p.id === playerId);
    if (!player) return false;

    player.teamId = null;
    this.savePlayers(players, div);
    return true;
  }

  // Bulk update or add players
  bulkImportPlayers(playerList, division = null) {
    const div = division || this.getActiveDivision();
    const existing = this.getPlayers(div);
    const merged = [...playerList];
    this.savePlayers(merged, div);
  }

  // Reset Everything to fresh default state
  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.TEAMS_MALE, JSON.stringify(DEFAULT_MALE_TEAMS));
    localStorage.setItem(STORAGE_KEYS.TEAMS_FEMALE, JSON.stringify(DEFAULT_FEMALE_TEAMS));
    localStorage.setItem(STORAGE_KEYS.PLAYERS_MALE, JSON.stringify(INITIAL_MALE_PLAYERS));
    localStorage.setItem(STORAGE_KEYS.PLAYERS_FEMALE, JSON.stringify(INITIAL_FEMALE_PLAYERS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(INITIAL_SCHEDULE));
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(OFFICIAL_RULES));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_DIVISION, 'male');
    this.notify();
  }

  // Export all tournament state as JSON
  exportAllData() {
    return {
      version: '1.0',
      timestamp: new Date().toISOString(),
      league: 'JSG-PC BOX CRICKET LEAGUE 2026',
      teamsMale: this.getTeams('male'),
      teamsFemale: this.getTeams('female'),
      playersMale: this.getPlayers('male'),
      playersFemale: this.getPlayers('female'),
      categories: this.getCategories(),
      schedule: this.getSchedule(),
      rules: this.getRules()
    };
  }

  // Import tournament state from JSON
  importAllData(data) {
    if (!data) return false;
    if (data.teamsMale) localStorage.setItem(STORAGE_KEYS.TEAMS_MALE, JSON.stringify(data.teamsMale));
    if (data.teamsFemale) localStorage.setItem(STORAGE_KEYS.TEAMS_FEMALE, JSON.stringify(data.teamsFemale));
    if (data.playersMale) localStorage.setItem(STORAGE_KEYS.PLAYERS_MALE, JSON.stringify(data.playersMale));
    if (data.playersFemale) localStorage.setItem(STORAGE_KEYS.PLAYERS_FEMALE, JSON.stringify(data.playersFemale));
    if (data.categories) localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data.categories));
    if (data.schedule) localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(data.schedule));
    if (data.rules) localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(data.rules));
    this.notify();
    return true;
  }
}

export const storage = new LeagueStorage();

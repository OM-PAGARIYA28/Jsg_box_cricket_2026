// Tournament Rules & Court Layout Infographic Module
import { storage } from './storage.js';
import { sound } from './audio.js';
import { showToast } from './draft.js';

export function initRulesModule() {
  renderRulesView();
  setupRulesEventListeners();
}

export function renderRulesView() {
  const container = document.getElementById('rules-view-content');
  if (!container) return;

  const rules = storage.getRules();
  const customImages = storage.getCustomImages();

  container.innerHTML = `
    <!-- Rules Hero Banner -->
    <div class="rules-hero-banner glass-panel">
      <div class="rules-hero-text">
        <span class="pill-gold"><i data-lucide="shield-check"></i> OFFICIAL TOURNAMENT CODE</span>
        <h2>JSG-PC BOX CRICKET LEAGUE 2026 - RULES & ARENA</h2>
        <p>Comprehensive guidelines, scoring rules, court layout specifications, and fair play regulations.</p>
        
        <div class="rules-quick-stats">
          <div class="stat-bubble">
            <strong>8 Overs</strong>
            <span>Per Match</span>
          </div>
          <div class="stat-bubble">
            <strong>8 / 10 Players</strong>
            <span>Men's / Women's</span>
          </div>
          <div class="stat-bubble">
            <strong>Top Net = OUT</strong>
            <span>Ceiling Rule</span>
          </div>
          <div class="stat-bubble">
            <strong>Side Nets = 1</strong>
            <span>Contact Run</span>
          </div>
        </div>
      </div>

      <div class="rules-hero-actions">
        <button id="btn-print-rules" class="btn btn-secondary">
          <i data-lucide="printer"></i>
          <span>Print Rulebook</span>
        </button>
        <button id="btn-upload-flyer" class="btn btn-primary">
          <i data-lucide="image-plus"></i>
          <span>Upload Custom Flyer</span>
        </button>
      </div>
    </div>

    <!-- Arena Layout Visual Diagram Section -->
    <div class="arena-diagram-section glass-panel">
      <div class="section-title-row">
        <div class="title-with-icon">
          <i data-lucide="layout"></i>
          <h3>Official Box Cricket Court Layout & Scoring Zones</h3>
        </div>
        <button id="btn-zoom-diagram" class="btn btn-sm btn-outline">
          <i data-lucide="maximize-2"></i>
          <span>Expand View</span>
        </button>
      </div>

      <div class="arena-diagram-wrapper">
        <img id="rules-arena-img" src="/images/rules-diagram.jpg" alt="JSG Box Cricket Court Rules Diagram" class="arena-diagram-image" />
        <div class="diagram-overlay-caption">
          <span>💡 Tap or click image to view full high-resolution diagram</span>
        </div>
      </div>
    </div>

    <!-- Custom Uploaded Tournament Posters / Flyers (if any) -->
    ${customImages.length > 0 ? `
      <div class="custom-flyers-section glass-panel">
        <div class="section-title-row">
          <div class="title-with-icon">
            <i data-lucide="images"></i>
            <h3>Uploaded League Posters & Announcements</h3>
          </div>
        </div>
        <div class="flyers-gallery-grid">
          ${customImages.map(img => `
            <div class="flyer-card">
              <img src="${img.url}" alt="${img.caption || 'Tournament Flyer'}" class="flyer-img" />
              <div class="flyer-info">
                <span>${img.caption || 'Uploaded Document'}</span>
                <button class="btn-delete-flyer" data-img-id="${img.id}" title="Remove image">×</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- Detailed Rule Cards Grid -->
    <div class="rules-cards-grid">
      ${rules.map(rule => `
        <div class="rule-card glass-panel">
          <div class="rule-card-header">
            <div class="rule-icon-box">
              <i data-lucide="${rule.icon || 'file-text'}"></i>
            </div>
            <div class="rule-header-content">
              <div class="rule-badges">
                <span class="badge-cat">${rule.category}</span>
                <span class="badge-status">${rule.badge}</span>
              </div>
              <h4 class="rule-title">${rule.title}</h4>
            </div>
          </div>

          <div class="rule-summary-box">
            <p>${rule.summary}</p>
          </div>

          <ul class="rule-details-list">
            ${rule.details.map(pt => `
              <li>
                <i data-lucide="check-circle-2"></i>
                <span>${pt}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      `).join('')}
    </div>

    <!-- Hidden file input for flyer upload -->
    <input type="file" id="flyer-file-input" accept="image/*" style="display: none;" />
  `;

  if (window.lucide) window.lucide.createIcons();
}

function setupRulesEventListeners() {
  const container = document.getElementById('rules-view-content');
  if (!container) return;

  container.addEventListener('click', (e) => {
    // Zoom court diagram
    if (e.target.closest('#btn-zoom-diagram') || e.target.closest('#rules-arena-img')) {
      openImageLightbox('/images/rules-diagram.jpg', 'JSG Box Cricket Court Layout & Scoring Zones');
      return;
    }

    // Print rules
    if (e.target.closest('#btn-print-rules')) {
      window.print();
      return;
    }

    // Upload custom flyer
    if (e.target.closest('#btn-upload-flyer')) {
      const fileInput = document.getElementById('flyer-file-input');
      if (fileInput) fileInput.click();
      return;
    }

    // Delete flyer
    const delFlyerBtn = e.target.closest('.btn-delete-flyer');
    if (delFlyerBtn) {
      const imgId = delFlyerBtn.dataset.imgId;
      if (confirm('Delete this uploaded flyer?')) {
        storage.deleteCustomImage(imgId);
        showToast('Flyer removed.', 'info');
        renderRulesView();
      }
      return;
    }

    // Click on custom flyer
    const flyerImg = e.target.closest('.flyer-img');
    if (flyerImg) {
      openImageLightbox(flyerImg.src, flyerImg.alt);
      return;
    }
  });

  // Handle flyer file upload via base64 dataURL
  container.addEventListener('change', (e) => {
    if (e.target.id === 'flyer-file-input' && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const caption = prompt('Enter a title or caption for this flyer/rules image:', file.name.replace(/\.[^/.]+$/, '')) || 'Tournament Flyer';
        storage.addCustomImage({
          id: `flyer-${Date.now()}`,
          url: event.target.result,
          caption,
          timestamp: new Date().toISOString()
        });
        sound.playDraftSuccess();
        showToast('Flyer uploaded and saved!', 'success');
        renderRulesView();
      };
      reader.readAsDataURL(file);
    }
  });
}

// Lightbox modal for high-res images
function openImageLightbox(imgSrc, title) {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop lightbox-backdrop';
  modal.id = 'lightbox-modal';

  modal.innerHTML = `
    <div class="lightbox-content animate-scale-up">
      <div class="lightbox-header">
        <h4>${title}</h4>
        <button class="btn-close-modal" id="btn-close-lightbox">×</button>
      </div>
      <div class="lightbox-body">
        <img src="${imgSrc}" alt="${title}" class="lightbox-img" />
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target.id === 'lightbox-modal' || e.target.id === 'btn-close-lightbox') {
      modal.remove();
    }
  });
}

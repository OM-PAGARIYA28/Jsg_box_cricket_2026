// Tournament Rules & Match Regulations Module
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
        <span class="pill-gold"><i data-lucide="shield-check"></i> TOURNAMENT DIRECTIVES</span>
        <h2>JSG-PC BOX CRICKET LEAGUE 2026 - RULES</h2>
        <p>Official match regulations, playing conditions, and league code of conduct. (Will be updated once finalized by the committee).</p>
      </div>

      <div class="rules-hero-actions">
        <button id="btn-print-rules" class="btn btn-secondary">
          <i data-lucide="printer"></i>
          <span>Print Rules</span>
        </button>
        <button id="btn-upload-flyer" class="btn btn-primary">
          <i data-lucide="image-plus"></i>
          <span>Upload Rules Flyer / Document</span>
        </button>
      </div>
    </div>

    <!-- Official Notice / Waiting for committee release banner -->
    <div class="rules-notice-box glass-panel">
      <div class="notice-icon">
        <i data-lucide="clipboard-list"></i>
      </div>
      <div class="notice-text">
        <h4>Official Rules Being Finalized</h4>
        <p>The organizing committee is finalizing the tournament playing conditions and turf guidelines. Any newly updated rules or flyers will appear right here.</p>
      </div>
    </div>

    <!-- Custom Uploaded Tournament Posters / Flyers (if any) -->
    ${customImages.length > 0 ? `
      <div class="custom-flyers-section glass-panel">
        <div class="section-title-row">
          <div class="title-with-icon">
            <i data-lucide="images"></i>
            <h3>Uploaded Rules & League Documents</h3>
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

    <!-- Hidden file input for flyer upload -->
    <input type="file" id="flyer-file-input" accept="image/*" style="display: none;" />
  `;

  if (window.lucide) window.lucide.createIcons();
}

function setupRulesEventListeners() {
  const container = document.getElementById('rules-view-content');
  if (!container) return;

  container.addEventListener('click', (e) => {
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
        showToast('Document removed.', 'info');
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
        const caption = prompt('Enter a title or caption for this rules document:', file.name.replace(/\.[^/.]+$/, '')) || 'Official Tournament Rules';
        storage.addCustomImage({
          id: `flyer-${Date.now()}`,
          url: event.target.result,
          caption,
          timestamp: new Date().toISOString()
        });
        sound.playDraftSuccess();
        showToast('Rules document uploaded and saved!', 'success');
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

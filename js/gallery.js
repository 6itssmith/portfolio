// ============================================
// GALLERY FILTERING
// ============================================

function setupGalleryFilters() {
    const filterButtons = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!filterButtons.length || !galleryItems.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.classList.remove('filtered-out');
                } else {
                    item.classList.add('filtered-out');
                }
            });

            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        });
    });
}

// ============================================
// GALLERY LIGHTBOX
// ============================================

function setupGalleryLightbox() {
    const modalEl = document.getElementById('galleryModal');
    if (!modalEl) return;

    const modalTitle = document.getElementById('galleryModalTitle');
    const modalDesc = document.getElementById('galleryModalDesc');
    const modalMedia = document.getElementById('galleryModalMedia');
    const modal = new bootstrap.Modal(modalEl);

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const title = item.getAttribute('data-title') || 'Untitled';
            const desc = item.getAttribute('data-desc') || '';
            const mediaMarkup = item.querySelector('.gallery-item-media').innerHTML;

            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modalMedia.innerHTML = mediaMarkup;

            modal.show();
        });
    });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    setupGalleryFilters();
    setupGalleryLightbox();
});

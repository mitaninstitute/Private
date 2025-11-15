document.getElementById('startBtn').addEventListener('click', () => {
    location.href = 'index.html';
  });


   // === RENDER FUNCTION ===
    const grid = document.getElementById('bookGrid');
    const deptButtons = document.querySelectorAll('.filter-btn');
    const stageButtons = document.querySelectorAll('.stage-btn');

    let currentDept = 'all';
    let currentStage = 'all';

    function renderBooks() {
      grid.innerHTML = '';
      const filtered = books.filter(b =>
        (currentDept === 'all' || b.department === currentDept) &&
        (currentStage === 'all' || b.stage === currentStage)
      );

      if (filtered.length === 0) {
        grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;font-size:1.2em;color:#666;">No books found for this selection.</p>`;
        return;
      }

      filtered.forEach(book => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <div class="thumb" style="background-image:url('${book.thumb}')"></div>
          <div class="info">
            <div class="title">${book.title}</div>
            <div class="author">${book.author}</div>
            <div class="tags">Dept: ${book.department.replace('-', ' ')} | Stage ${book.stage}</div>
          </div>
          <div class="buttons">
            <a href="${book.pdf}" class="btn download-btn">Download</a>
          </div>
        `;
        grid.appendChild(card);

        // Wire up the download button to use a programmatic fetch+blob download.
        // This is more reliable for cross-origin URLs (requires CORS on the storage bucket).
        const downloadEl = card.querySelector('.download-btn');
        if (downloadEl) {
          downloadEl.addEventListener('click', async (e) => {
            e.preventDefault();
            // suggested filename from book.title or fallback
            const suggested = (book.title || 'download').trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_.]/g, '') + '.pdf';
            await programmaticDownload(book.pdf.trim(), suggested);
          });
        }
      });
    }


// --- Programmatic download helper ---
// Fetches the resource, converts to blob and triggers a download with the desired filename.
// Notes: Requires the remote server to allow CORS for your origin. On failure, falls back to opening the URL.
async function programmaticDownload(url, suggestedFilename) {
  try {
    if (!url) throw new Error('No URL provided');
    const resp = await fetch(url, { method: 'GET', mode: 'cors' });
    if (!resp.ok) throw new Error('Network response was not ok: ' + resp.status);
    const blob = await resp.blob();

    // Attempt to get filename from Content-Disposition header
    const disposition = resp.headers.get('content-disposition');
    let filename = suggestedFilename || 'download.pdf';
    if (disposition) {
      const m = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition);
      if (m && m[1]) filename = decodeURIComponent(m[1]);
    }

    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    // Some browsers require the anchor to be in the document
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Revoke after a short delay
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  } catch (err) {
    console.error('Programmatic download failed:', err);
    // Fallback: open in new tab (user can manually download)
    try {
      window.open(url, '_blank', 'noopener');
    } catch (openErr) {
      console.error('Fallback open failed:', openErr);
    }
  }
}

    deptButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        deptButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentDept = btn.dataset.dept;
        renderBooks();
      });
    });

    stageButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        stageButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentStage = btn.dataset.stage;
        renderBooks();
      });
    });

    renderBooks();
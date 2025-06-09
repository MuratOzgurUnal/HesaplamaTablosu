document.addEventListener('DOMContentLoaded', () => {
    const selectionScreen = document.getElementById('selection-screen');
    const contentArea = document.getElementById('content-area');
    const toolCards = document.querySelectorAll('.tool-card');
    const backButton = document.getElementById('back-to-menu');
    const headerTitle = document.querySelector('header h1');
    const originalTitle = headerTitle.textContent;

    toolCards.forEach(card => {
        card.addEventListener('click', () => {
            const tool = card.dataset.tool;
            const toolTitle = card.querySelector('h2').textContent;
            loadTool(tool, toolTitle);
        });
    });

    backButton.addEventListener('click', () => {
        contentArea.innerHTML = '';
        contentArea.classList.add('hidden');
        selectionScreen.classList.remove('hidden');
        backButton.classList.add('hidden');
        headerTitle.textContent = originalTitle;
    });

    async function loadTool(toolName, toolTitle) {
        try {
            const response = await fetch(`hesap_araclari/${toolName}.html`);
            if (!response.ok) {
                throw new Error(`Dosya yüklenemedi: ${response.statusText}`);
            }
            const html = await response.text();
            
            selectionScreen.classList.add('hidden');
            contentArea.innerHTML = html;
            contentArea.classList.remove('hidden');
            backButton.classList.remove('hidden');
            headerTitle.textContent = toolTitle;

            // Yüklenen HTML içindeki script'i çalıştırmak için
            const scriptTag = contentArea.querySelector('script');
            if (scriptTag) {
                // Yeni bir script elementi oluşturup içeriğini kopyalıyoruz
                // Bu, tarayıcının script'i çalıştırmasını tetikler
                const newScript = document.createElement('script');
                newScript.textContent = scriptTag.textContent;
                contentArea.appendChild(newScript);
                scriptTag.remove(); // Orijinal (ama çalışmayan) script'i kaldır
            }

        } catch (error) {
            console.error('Hesaplama aracı yüklenirken hata oluştu:', error);
            contentArea.innerHTML = `<p style="color: red;">"${toolName}" hesaplama aracı yüklenirken bir hata oluştu. Lütfen konsolu kontrol edin.</p>`;
            contentArea.classList.remove('hidden');
            backButton.classList.remove('hidden');
        }
    }
});
async function listFiles() {
    const filesList = document.getElementById('filesList');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    try {
        const response = await fetch('http://localhost:3000/allFiles');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const files = await response.json();

        filesList.innerHTML = files.map(file => `
            <li class="p-4 rounded-lg flex items-center justify-between space-x-4" style="background-color: var(--surface-container-high);">
                <div class="flex items-center space-x-4">
                    <div style="color: var(--primary);">
                        <i class="material-icons">insert_drive_file</i>
                    </div>
                    <div class="font-semibold" style="color: var(--on-surface-variant);">${file}</div>
                </div>
                <a href="http://localhost:3000/${file}" download style="background-color: var(--secondary); color: var(--on-secondary);" class="px-3 py-1 rounded-lg shadow-sm hover:opacity-80 transition-opacity flex items-center space-x-2">
                    <span class="material-icons text-sm">download</span>
                    <span>Download</span>
                </a>
            </li>
        `).join('');
    } catch (error) {
        errorText.textContent = 'Failed to fetch files.';
        errorMessage.style.display = 'flex';
        console.error('There has been a problem with your fetch operation:', error);
    }
}

document.getElementById('downloadAllButton').addEventListener('click', () => {
    window.location.href = 'http://localhost:3000/download';
});

listFiles();

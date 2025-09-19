async function listFiles() {
    const filesList = document.getElementById('filesList');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    try {
        const response = await fetch('/allFiles');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const files = await response.json();

        filesList.innerHTML = files.map(file => `
            <li class="p-4 rounded-lg flex items-center space-x-4" style="background-color: var(--surface-container-high);">
                <div style="color: var(--primary);">
                    <i class="material-icons">insert_drive_file</i>
                </div>
                <div class="flex-grow">
                    <div class="font-semibold" style="color: var(--on-surface-variant);">${file}</div>
                </div>
            </li>
        `).join('');
    } catch (error) {
        errorText.textContent = 'Failed to fetch files.';
        errorMessage.style.display = 'flex';
        console.error('There has been a problem with your fetch operation:', error);
    }
}

listFiles();

class FileUploader {
            constructor() {
                this.files = [];
                this.uploading = false;

                this.initElements();
                this.bindEvents();
                this.checkFiles();
            }

            initElements() {
                this.uploadArea = document.getElementById('uploadArea');
                this.fileInput = document.getElementById('fileInput');
                this.progressContainer = document.getElementById('progressContainer');
                this.progressFill = document.getElementById('progressFill');
                this.progressText = document.getElementById('progressText');
                this.errorMessage = document.getElementById('errorMessage');
                this.errorText = document.getElementById('errorText');
                this.filesSection = document.getElementById('filesSection');
                this.filesList = document.getElementById('filesList');
                this.downloadAllBtn = document.getElementById('downloadAllBtn');
                this.endpointUrl = document.getElementById('endpoint-url');
                this.endpointUrl.textContent = import.meta.env.VITE_API_ENDPOINT;
            }

            bindEvents() {
                this.uploadArea.addEventListener('click', () => this.fileInput.click());
                this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
                this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
                this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
                this.downloadAllBtn.addEventListener('click', () => this.downloadAll());
            }

            async checkFiles() {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/checkFiles`);
                    if (!response.ok) throw new Error('Network response was not ok');
                    const files = await response.json();

                    this.files = files.map(file => ({
                        id: file.name, // Assuming name is unique, or backend provides an id
                        file: null,
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        status: 'success'
                    }));

                    this.showFilesSection();
                } catch (error) {
                    this.showError('Failed to check files.');
                    console.error('There has been a problem with your fetch operation:', error);
                }
            }

            handleFileSelect(event) {
                const files = Array.from(event.target.files);
                if (files.length > 0) {
                    this.processFiles(files);
                }
            }

            handleDragOver(event) {
                event.preventDefault();
            }

            handleDrop(event) {
                event.preventDefault();
                const files = Array.from(event.dataTransfer.files);
                if (files.length > 0) {
                    this.processFiles(files);
                }
            }

            processFiles(files) {
                this.files = files.map(file => ({
                    id: Date.now() + Math.random(),
                    file: file,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    status: 'pending'
                }));

                this.showFilesSection();
                this.uploadFiles();
            }

            async uploadFiles() {
                this.uploading = true;
                this.progressContainer.style.display = 'block';
                this.progressText.textContent = 'Preparing files...';

                // Simulate upload progress
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 10;
                    this.progressFill.style.width = `${progress}%`;
                    this.progressText.textContent = `Uploading files... ${progress}%`;

                    if (progress >= 100) {
                        clearInterval(interval);
                        this.onUploadComplete();
                    }
                }, 200);
            }

            onUploadComplete() {
                this.progressText.textContent = 'Upload complete!';
                this.uploading = false;
                this.checkFiles();
            }

            showFilesSection() {
                this.filesSection.style.display = 'block';
                this.updateFilesList();
            }

            updateFilesList() {
                this.filesList.innerHTML = '';

                this.files.forEach(file => {
                    const fileItem = document.createElement('div');
                    fileItem.className = 'p-4 rounded-lg flex items-center space-x-4';
                    fileItem.style.backgroundColor = 'var(--surface-container-high)';
                    fileItem.innerHTML = `
                        <div style="color: var(--primary);">
                            ${this.getFileIcon(file.type)}
                        </div>
                        <div class="flex-grow">
                            <div class="font-semibold" style="color: var(--on-surface-variant);">${file.name}</div>
                            <div class="text-sm" style="color: var(--on-surface-variant);">${this.formatFileSize(file.size)}</div>
                        </div>
                        <div class="flex items-center space-x-2">
                            ${file.status === 'success' ?
                                '<i class="material-icons" style="color: var(--primary);">check_circle</i>' :
                                '<i class="material-icons animate-spin" style="color: var(--on-surface-variant);">autorenew</i>'
                            }
                            <button style="color: var(--on-surface-variant);" class="hover:text-red-500 transition-all" onclick="uploader.removeFile(${file.id})">
                                <i class="material-icons">close</i>
                            </button>
                        </div>
                    `;
                    this.filesList.appendChild(fileItem);
                });
            }

            getFileIcon(type) {
                if (type.includes('image')) return '<i class="material-icons">image</i>';
                if (type.includes('pdf')) return '<i class="material-icons">picture_as_pdf</i>';
                if (type.includes('word')) return '<i class="material-icons">description</i>';
                if (type.includes('excel')) return '<i class="material-icons">table_chart</i>';
                if (type.includes('zip') || type.includes('rar')) return '<i class="material-icons">folder_zip</i>';
                return '<i class="material-icons">insert_drive_file</i>';
            }

            formatFileSize(bytes) {
                if (bytes === 0) return '0 Bytes';
                const k = 1024;
                const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
            }

            removeFile(id) {
                this.files = this.files.filter(file => file.id !== id);
                this.updateFilesList();

                if (this.files.length === 0) {
                    this.filesSection.style.display = 'none';
                }
            }

            async downloadAll() {
                try {
                    this.downloadAllBtn.disabled = true;
                    this.downloadAllBtn.innerHTML = '<i class="material-icons">autorenew</i> Downloading...';

                    // Simulate download from localhost:3000
                    const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/downloadAll`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    if (response.ok) {
                        // Create download link
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'all-files.zip';
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                    } else {
                        throw new Error('Download failed');
                    }
                } catch (error) {
                    this.showError('Failed to download all files');
                } finally {
                    this.downloadAllBtn.disabled = false;
                    this.downloadAllBtn.innerHTML = '<i class="material-icons">download</i> Download All';
                }
            }

            showError(message) {
                this.errorText.textContent = message;
                this.errorMessage.style.display = 'flex';
                setTimeout(() => {
                    this.errorMessage.style.display = 'none';
                }, 5000);
            }
        }

        // Initialize the uploader when the page loads
        const uploader = new FileUploader();

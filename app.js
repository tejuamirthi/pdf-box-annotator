class PDFAnnotator {
    constructor() {
        this.pdfDoc = null;
        this.currentPage = 1;
        this.totalPages = 0;
        this.canvas = null;
        this.ctx = null;
        this.rectangles = new Map(); // Map of pageNumber -> Array of rectangles
        this.isDrawing = false;
        this.isResizing = false;
        this.startX = 0;
        this.startY = 0;
        this.currentRect = null;
        this.selectedRect = null;
        this.scale = 1;
        this.pageWidth = 0;
        this.pageHeight = 0;
        
        this.init();
    }
    
    init() {
        // Set up PDF.js worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const pdfInput = document.getElementById('pdfInput');
        const prevButton = document.getElementById('prevPage');
        const nextButton = document.getElementById('nextPage');
        const clearRectangles = document.getElementById('clearRectangles');
        const clearLogs = document.getElementById('clearLogs');
        
        pdfInput.addEventListener('change', (e) => this.handleFileSelect(e));
        prevButton.addEventListener('click', () => this.goToPrevPage());
        nextButton.addEventListener('click', () => this.goToNextPage());
        clearRectangles.addEventListener('click', () => this.clearAllRectangles());
        clearLogs.addEventListener('click', () => this.clearLogs());
    }
    
    async handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (file.type !== 'application/pdf') {
            this.showError('Please select a valid PDF file.');
            return;
        }
        
        this.hideError();
        
        try {
            const arrayBuffer = await file.arrayBuffer();
            this.pdfDoc = await pdfjsLib.getDocument(arrayBuffer).promise;
            this.totalPages = this.pdfDoc.numPages;
            this.currentPage = 1;
            this.rectangles.clear();
            
            await this.renderPage(this.currentPage);
            this.showControls();
            this.updatePageInfo();
        } catch (error) {
            console.error('Error loading PDF:', error);
            this.showError('Error loading PDF file. Please try again.');
        }
    }
    
    async renderPage(pageNumber) {
        if (!this.pdfDoc) return;
        
        const page = await this.pdfDoc.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.5 });
        
        this.scale = 1.5;
        this.pageWidth = viewport.width;
        this.pageHeight = viewport.height;
        
        // Create or update canvas
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.className = 'pdf-canvas';
            this.ctx = this.canvas.getContext('2d');
            document.getElementById('pdfViewer').appendChild(this.canvas);
            this.setupCanvasEvents();
        }
        
        this.canvas.width = viewport.width;
        this.canvas.height = viewport.height;
        
        const renderContext = {
            canvasContext: this.ctx,
            viewport: viewport
        };
        
        await page.render(renderContext).promise;
        
        // Clear existing rectangles from DOM
        this.clearRectanglesFromDOM();
        
        // Render rectangles for current page
        this.renderRectangles(pageNumber);
    }
    
    setupCanvasEvents() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
    }
    
    getCanvasCoordinates(event) {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);
        
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }
    
    handleMouseDown(event) {
        if (event.target.classList.contains('resize-handle')) {
            this.isResizing = true;
            this.currentRect = event.target.parentElement;
            return;
        }
        
        this.isDrawing = true;
        const coords = this.getCanvasCoordinates(event);
        this.startX = coords.x;
        this.startY = coords.y;
        
        this.deselectAllRectangles();
    }
    
    handleMouseMove(event) {
        if (this.isResizing && this.currentRect) {
            const coords = this.getCanvasCoordinates(event);
            const rect = this.currentRect;
            const rectData = JSON.parse(rect.dataset.rect);
            
            const newWidth = Math.max(10, coords.x - rectData.x);
            const newHeight = Math.max(10, coords.y - rectData.y);
            
            rect.style.width = newWidth + 'px';
            rect.style.height = newHeight + 'px';
            
            // Update rectangle data
            rectData.width = newWidth;
            rectData.height = newHeight;
            rect.dataset.rect = JSON.stringify(rectData);
            
            this.updateRectangleInStorage(rectData);
            return;
        }
        
        if (!this.isDrawing) return;
        
        const coords = this.getCanvasCoordinates(event);
        
        if (this.currentRect) {
            const width = Math.abs(coords.x - this.startX);
            const height = Math.abs(coords.y - this.startY);
            const x = Math.min(this.startX, coords.x);
            const y = Math.min(this.startY, coords.y);
            
            this.currentRect.style.left = x + 'px';
            this.currentRect.style.top = y + 'px';
            this.currentRect.style.width = width + 'px';
            this.currentRect.style.height = height + 'px';
        } else {
            this.currentRect = this.createRectangleElement(this.startX, this.startY, 0, 0);
        }
    }
    
    handleMouseUp(event) {
        if (this.isResizing) {
            this.isResizing = false;
            this.currentRect = null;
            return;
        }
        
        if (!this.isDrawing) return;
        
        this.isDrawing = false;
        
        if (this.currentRect) {
            const coords = this.getCanvasCoordinates(event);
            const width = Math.abs(coords.x - this.startX);
            const height = Math.abs(coords.y - this.startY);
            
            if (width > 5 && height > 5) {
                const x = Math.min(this.startX, coords.x);
                const y = Math.min(this.startY, coords.y);
                
                const rectData = {
                    id: Date.now(),
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    page: this.currentPage
                };
                
                this.currentRect.dataset.rect = JSON.stringify(rectData);
                this.addRectangleToStorage(rectData);
            } else {
                this.currentRect.remove();
            }
        }
        
        this.currentRect = null;
    }
    
    handleCanvasClick(event) {
        // This will be handled by rectangle click events
    }
    
    handleTouchStart(event) {
        event.preventDefault();
        this.handleMouseDown(event);
    }
    
    handleTouchMove(event) {
        event.preventDefault();
        this.handleMouseMove(event);
    }
    
    handleTouchEnd(event) {
        event.preventDefault();
        this.handleMouseUp(event);
    }
    
    createRectangleElement(x, y, width, height) {
        const rect = document.createElement('div');
        rect.className = 'rectangle';
        rect.style.left = x + 'px';
        rect.style.top = y + 'px';
        rect.style.width = width + 'px';
        rect.style.height = height + 'px';
        
        // Add resize handle
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';
        rect.appendChild(resizeHandle);
        
        // Add click event for coordinate logging
        rect.addEventListener('click', (e) => this.handleRectangleClick(e));
        
        document.getElementById('pdfViewer').appendChild(rect);
        return rect;
    }
    
    handleRectangleClick(event) {
        event.stopPropagation();
        
        this.deselectAllRectangles();
        event.currentTarget.classList.add('selected');
        this.selectedRect = event.currentTarget;
        
        const rectData = JSON.parse(event.currentTarget.dataset.rect);
        this.logRectangleCoordinates(rectData);
    }
    
    logRectangleCoordinates(rectData) {
        const pageWidthPoints = this.pageWidth / this.scale * 72 / 96; // Convert to points
        const pageHeightPoints = this.pageHeight / this.scale * 72 / 96;
        
        const xPoints = (rectData.x / this.scale) * 72 / 96;
        const yPoints = (rectData.y / this.scale) * 72 / 96;
        const widthPoints = (rectData.width / this.scale) * 72 / 96;
        const heightPoints = (rectData.height / this.scale) * 72 / 96;
        
        const logMessage = `Page Number: ${rectData.page}\n` +
                          `Page Size: Width=${pageWidthPoints.toFixed(1)}, Height=${pageHeightPoints.toFixed(1)} (points)\n` +
                          `Rectangle Coordinates: X=${xPoints.toFixed(1)}, Y=${yPoints.toFixed(1)}, Width=${widthPoints.toFixed(1)}, Height=${heightPoints.toFixed(1)} (points)\n\n`;
        
        const logOutput = document.getElementById('logOutput');
        logOutput.textContent += logMessage;
        logOutput.classList.remove('hidden');
        
        // Scroll to bottom
        logOutput.scrollTop = logOutput.scrollHeight;
    }
    
    addRectangleToStorage(rectData) {
        const pageRectangles = this.rectangles.get(rectData.page) || [];
        pageRectangles.push(rectData);
        this.rectangles.set(rectData.page, pageRectangles);
    }
    
    updateRectangleInStorage(updatedRectData) {
        const pageRectangles = this.rectangles.get(updatedRectData.page) || [];
        const index = pageRectangles.findIndex(r => r.id === updatedRectData.id);
        if (index !== -1) {
            pageRectangles[index] = updatedRectData;
        }
    }
    
    renderRectangles(pageNumber) {
        const pageRectangles = this.rectangles.get(pageNumber) || [];
        
        pageRectangles.forEach(rectData => {
            const rect = this.createRectangleElement(rectData.x, rectData.y, rectData.width, rectData.height);
            rect.dataset.rect = JSON.stringify(rectData);
        });
    }
    
    clearRectanglesFromDOM() {
        const rectangles = document.querySelectorAll('.rectangle');
        rectangles.forEach(rect => rect.remove());
    }
    
    deselectAllRectangles() {
        const rectangles = document.querySelectorAll('.rectangle');
        rectangles.forEach(rect => rect.classList.remove('selected'));
        this.selectedRect = null;
    }
    
    clearAllRectangles() {
        this.rectangles.clear();
        this.clearRectanglesFromDOM();
    }
    
    clearLogs() {
        const logOutput = document.getElementById('logOutput');
        logOutput.textContent = 'Rectangle Coordinates Log:\n';
        logOutput.classList.add('hidden');
    }
    
    goToPrevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderPage(this.currentPage);
            this.updatePageInfo();
        }
    }
    
    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.renderPage(this.currentPage);
            this.updatePageInfo();
        }
    }
    
    updatePageInfo() {
        const pageInfo = document.getElementById('pageInfo');
        pageInfo.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
        
        const prevButton = document.getElementById('prevPage');
        const nextButton = document.getElementById('nextPage');
        
        prevButton.disabled = this.currentPage === 1;
        nextButton.disabled = this.currentPage === this.totalPages;
    }
    
    showControls() {
        document.getElementById('controls').classList.remove('hidden');
        document.getElementById('pageInfo').classList.remove('hidden');
        document.getElementById('pdfViewer').classList.remove('hidden');
    }
    
    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }
    
    hideError() {
        document.getElementById('errorMessage').classList.add('hidden');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new PDFAnnotator();
});
// Set default date to today
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateCreated').value = today;
});

// Rich Text Editor Variables
let currentEditor = null;

// Format text (bold, italic, underline)
function formatText(command) {
    if (currentEditor) {
        document.execCommand(command, false, null);
        updateToolbarState();
    }
}

// Change font family
function changeFont(fontName) {
    if (currentEditor) {
        document.execCommand('fontName', false, fontName);
        updateToolbarState();
    }
}

// Change font size
function changeSize(size) {
    if (currentEditor) {
        document.execCommand('fontSize', false, size);
        updateToolbarState();
    }
}

// Change text color
function changeColor(color) {
    if (currentEditor) {
        document.execCommand('foreColor', false, color);
        updateToolbarState();
    }
}

// Clear formatting
function clearFormat() {
    if (currentEditor) {
        document.execCommand('removeFormat', false, null);
        updateToolbarState();
    }
}

// Update toolbar state based on current selection
function updateToolbarState() {
    if (!currentEditor) return;
    
    const toolbar = currentEditor.closest('.rich-editor-container').querySelector('.editor-toolbar');
    const buttons = toolbar.querySelectorAll('.toolbar-btn');
    
    buttons.forEach(btn => {
        const command = btn.getAttribute('onclick')?.match(/formatText\('(\w+)'\)/)?.[1];
        if (command) {
            if (document.queryCommandState(command)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
    });
}

// Handle editor focus
function handleEditorFocus(editor) {
    currentEditor = editor;
    updateToolbarState();
}

// Handle editor blur
function handleEditorBlur() {
    currentEditor = null;
}

// Initialize rich text editors
function initRichEditors() {
    const editors = document.querySelectorAll('.rich-editor');
    editors.forEach(editor => {
        editor.addEventListener('focus', () => handleEditorFocus(editor));
        editor.addEventListener('blur', handleEditorBlur);
        editor.addEventListener('keyup', updateToolbarState);
        editor.addEventListener('mouseup', updateToolbarState);
    });
}

// Get rich editor content as HTML
function getRichEditorContent(editor) {
    return editor.innerHTML;
}

// Set rich editor content
function setRichEditorContent(editor, content) {
    editor.innerHTML = content;
}

// Image preview functionality
function previewImage(input) {
    const file = input.files[0];
    const preview = input.parentElement.querySelector('.image-preview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Step image">`;
            preview.classList.add('show');
        };
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '';
        preview.classList.remove('show');
    }
}

// Add new step
function addStep() {
    const container = document.getElementById('stepsContainer');
    const stepCount = container.children.length + 1;
    
    const stepItem = document.createElement('div');
    stepItem.className = 'step-item';
    stepItem.innerHTML = `
        <div class="step-header">
            <span class="step-number">${stepCount}</span>
            <button type="button" class="remove-step" onclick="removeStep(this)"><i class="fas fa-trash"></i></button>
        </div>
        <div class="form-group">
            <label>Step Description</label>
            <div class="rich-editor-container">
                <div class="editor-toolbar">
                    <button type="button" class="toolbar-btn" onclick="formatText('bold')" title="Bold">
                        <i class="fas fa-bold"></i>
                    </button>
                    <button type="button" class="toolbar-btn" onclick="formatText('italic')" title="Italic">
                        <i class="fas fa-italic"></i>
                    </button>
                    <button type="button" class="toolbar-btn" onclick="formatText('underline')" title="Underline">
                        <i class="fas fa-underline"></i>
                    </button>
                    <select class="toolbar-select" onchange="changeFont(this.value)" title="Font">
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Calibri">Calibri</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Verdana">Verdana</option>
                    </select>
                    <select class="toolbar-select" onchange="changeSize(this.value)" title="Size">
                        <option value="1">Small</option>
                        <option value="3" selected>Normal</option>
                        <option value="5">Large</option>
                        <option value="7">Extra Large</option>
                    </select>
                    <input type="color" class="toolbar-color" onchange="changeColor(this.value)" title="Text Color">
                    <button type="button" class="toolbar-btn" onclick="clearFormat()" title="Clear Formatting">
                        <i class="fas fa-eraser"></i>
                    </button>
                </div>
                <div class="rich-editor" contenteditable="true" data-field="stepDescriptions[]" placeholder="Describe what needs to be done in this step"></div>
            </div>
        </div>
        <div class="form-group">
            <label>Expected Outcome</label>
            <div class="rich-editor-container">
                <div class="editor-toolbar">
                    <button type="button" class="toolbar-btn" onclick="formatText('bold')" title="Bold">
                        <i class="fas fa-bold"></i>
                    </button>
                    <button type="button" class="toolbar-btn" onclick="formatText('italic')" title="Italic">
                        <i class="fas fa-italic"></i>
                    </button>
                    <button type="button" class="toolbar-btn" onclick="formatText('underline')" title="Underline">
                        <i class="fas fa-underline"></i>
                    </button>
                    <select class="toolbar-select" onchange="changeFont(this.value)" title="Font">
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Calibri">Calibri</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Verdana">Verdana</option>
                    </select>
                    <select class="toolbar-select" onchange="changeSize(this.value)" title="Size">
                        <option value="1">Small</option>
                        <option value="3" selected>Normal</option>
                        <option value="5">Large</option>
                        <option value="7">Extra Large</option>
                    </select>
                    <input type="color" class="toolbar-color" onchange="changeColor(this.value)" title="Text Color">
                    <button type="button" class="toolbar-btn" onclick="clearFormat()" title="Clear Formatting">
                        <i class="fas fa-eraser"></i>
                    </button>
                </div>
                <div class="rich-editor" contenteditable="true" data-field="stepOutcomes[]" placeholder="What should happen after this step is completed"></div>
            </div>
        </div>
        <div class="form-group">
            <label>Step Image (Optional)</label>
            <div class="image-upload-container">
                <input type="file" name="stepImages[]" accept="image/*" class="image-upload" onchange="previewImage(this)">
                <div class="image-preview"></div>
            </div>
        </div>
    `;
    
    container.appendChild(stepItem);
    updateStepNumbers();
    initRichEditors();
}

// Remove step
function removeStep(button) {
    const stepItem = button.closest('.step-item');
    stepItem.remove();
    updateStepNumbers();
}

// Update step numbers
function updateStepNumbers() {
    const steps = document.querySelectorAll('.step-item');
    steps.forEach((step, index) => {
        const numberSpan = step.querySelector('.step-number');
        numberSpan.textContent = index + 1;
    });
}

// Add new troubleshooting item
function addTroubleshooting() {
    const container = document.getElementById('troubleshootingContainer');
    const itemCount = container.children.length + 1;
    
    const troubleshootingItem = document.createElement('div');
    troubleshootingItem.className = 'troubleshooting-item';
    troubleshootingItem.innerHTML = `
        <div class="troubleshooting-header">
            <span class="troubleshooting-number">${itemCount}</span>
            <button type="button" class="remove-troubleshooting" onclick="removeTroubleshooting(this)"><i class="fas fa-trash"></i></button>
        </div>
        <div class="form-group">
            <label>Problem</label>
            <input type="text" name="problems[]" placeholder="Describe the problem">
        </div>
        <div class="form-group">
            <label>Solution</label>
            <div class="rich-editor-container">
                <div class="editor-toolbar">
                    <button type="button" class="toolbar-btn" onclick="formatText('bold')" title="Bold">
                        <i class="fas fa-bold"></i>
                    </button>
                    <button type="button" class="toolbar-btn" onclick="formatText('italic')" title="Italic">
                        <i class="fas fa-italic"></i>
                    </button>
                    <button type="button" class="toolbar-btn" onclick="formatText('underline')" title="Underline">
                        <i class="fas fa-underline"></i>
                    </button>
                    <select class="toolbar-select" onchange="changeFont(this.value)" title="Font">
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Calibri">Calibri</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Verdana">Verdana</option>
                    </select>
                    <select class="toolbar-select" onchange="changeSize(this.value)" title="Size">
                        <option value="1">Small</option>
                        <option value="3" selected>Normal</option>
                        <option value="5">Large</option>
                        <option value="7">Extra Large</option>
                    </select>
                    <input type="color" class="toolbar-color" onchange="changeColor(this.value)" title="Text Color">
                    <button type="button" class="toolbar-btn" onclick="clearFormat()" title="Clear Formatting">
                        <i class="fas fa-eraser"></i>
                    </button>
                </div>
                <div class="rich-editor" contenteditable="true" data-field="solutions[]" placeholder="Describe the solution"></div>
            </div>
        </div>
    `;
    
    container.appendChild(troubleshootingItem);
    updateTroubleshootingNumbers();
    initRichEditors();
}

// Remove troubleshooting item
function removeTroubleshooting(button) {
    const troubleshootingItem = button.closest('.troubleshooting-item');
    troubleshootingItem.remove();
    updateTroubleshootingNumbers();
}

// Update troubleshooting numbers
function updateTroubleshootingNumbers() {
    const items = document.querySelectorAll('.troubleshooting-item');
    items.forEach((item, index) => {
        const numberSpan = item.querySelector('.troubleshooting-number');
        numberSpan.textContent = index + 1;
    });
}

// Clear form
function clearForm() {
    if (confirm('Are you sure you want to clear all form data?')) {
        document.getElementById('jobAidForm').reset();
        document.getElementById('dateCreated').value = new Date().toISOString().split('T')[0];
        
        // Remove all steps except the first one
        const stepsContainer = document.getElementById('stepsContainer');
        while (stepsContainer.children.length > 1) {
            stepsContainer.removeChild(stepsContainer.lastChild);
        }
        
        // Remove all troubleshooting items except the first one
        const troubleshootingContainer = document.getElementById('troubleshootingContainer');
        while (troubleshootingContainer.children.length > 1) {
            troubleshootingContainer.removeChild(troubleshootingContainer.lastChild);
        }
        
        // Clear rich editors
        document.querySelectorAll('.rich-editor').forEach(editor => {
            editor.innerHTML = '';
        });
        
        // Clear image previews
        document.querySelectorAll('.image-preview').forEach(preview => {
            preview.innerHTML = '';
            preview.classList.remove('show');
        });
        
        updateStepNumbers();
        updateTroubleshootingNumbers();
    }
}

// Preview job aid
function previewJobAid() {
    const formData = new FormData(document.getElementById('jobAidForm'));
    const data = Object.fromEntries(formData.entries());
    
    // Get all step descriptions and outcomes from rich editors
    const stepDescriptions = Array.from(document.querySelectorAll('.rich-editor[data-field="stepDescriptions[]"]')).map(el => el.innerHTML);
    const stepOutcomes = Array.from(document.querySelectorAll('.rich-editor[data-field="stepOutcomes[]"]')).map(el => el.innerHTML);
    
    // Get all troubleshooting problems and solutions
    const problems = Array.from(document.querySelectorAll('input[name="problems[]"]')).map(el => el.value);
    const solutions = Array.from(document.querySelectorAll('.rich-editor[data-field="solutions[]"]')).map(el => el.innerHTML);
    
    const previewContent = document.getElementById('previewContent');
    previewContent.innerHTML = generatePreviewHTML(data, stepDescriptions, stepOutcomes, problems, solutions);
    
    document.getElementById('previewContainer').style.display = 'block';
    document.querySelector('.form-container').style.display = 'none';
}

// Close preview
function closePreview() {
    document.getElementById('previewContainer').style.display = 'none';
    document.querySelector('.form-container').style.display = 'block';
}

// Generate preview HTML
function generatePreviewHTML(data, stepDescriptions, stepOutcomes, problems, solutions) {
    let html = `
        <h1>Job Aid: ${data.jobTitle || 'Job Aid Title'}</h1>
        
        <div class="contact-info">
            <h3>Document Information</h3>
            <p><strong>Job-Aid Title:</strong> ${data.jobTitle || 'Not specified'}</p>
            <p><strong>Version:</strong> ${data.version || '1.0'}</p>
            <p><strong>Date Created:</strong> ${data.dateCreated || 'Not specified'}</p>
            <p><strong>Author:</strong> ${data.author || 'Not specified'}</p>
            ${data.contactInfo ? `<p><strong>Contact:</strong> ${data.contactInfo}</p>` : ''}
        </div>
    `;
    
    // Process Steps
    if (stepDescriptions.some(desc => desc.trim())) {
        html += '<h2>Process Steps</h2>';
        stepDescriptions.forEach((description, index) => {
            if (description.trim()) {
                const stepElement = document.querySelectorAll('.step-item')[index];
                const imagePreview = stepElement ? stepElement.querySelector('.image-preview img') : null;
                const imageHtml = imagePreview ? `<img src="${imagePreview.src}" alt="Step ${index + 1} image">` : '';
                
                html += `
                    <div class="step">
                        <h3>Step ${index + 1}</h3>
                        <div><strong>Description:</strong> ${description}</div>
                        ${stepOutcomes[index] && stepOutcomes[index].trim() ? 
                            `<div><strong>Expected Outcome:</strong> ${stepOutcomes[index]}</div>` : ''}
                        ${imageHtml}
                    </div>
                `;
            }
        });
    }
    
    // Important Notes
    const importantNotesEditor = document.querySelector('.rich-editor[data-field="importantNotes"]');
    const importantNotes = importantNotesEditor ? importantNotesEditor.innerHTML : '';
    if (importantNotes && importantNotes.trim()) {
        html += `
            <h2>Important Notes</h2>
            <div class="important-notes">
                <div>${importantNotes}</div>
            </div>
        `;
    }
    
    // Troubleshooting
    if (problems.some(problem => problem.trim())) {
        html += '<h2>Troubleshooting</h2>';
        problems.forEach((problem, index) => {
            if (problem.trim() && solutions[index] && solutions[index].trim()) {
                html += `
                    <div class="troubleshooting-item">
                        <h3>Problem ${index + 1}</h3>
                        <p><strong>Problem:</strong> ${problem}</p>
                        <div><strong>Solution:</strong> ${solutions[index]}</div>
                    </div>
                `;
            }
        });
    }
    
    return html;
}

// Form submission
document.getElementById('jobAidForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    
    // Get all step descriptions and outcomes from rich editors
    const stepDescriptions = Array.from(document.querySelectorAll('.rich-editor[data-field="stepDescriptions[]"]')).map(el => el.innerHTML);
    const stepOutcomes = Array.from(document.querySelectorAll('.rich-editor[data-field="stepOutcomes[]"]')).map(el => el.innerHTML);
    
    // Get all troubleshooting problems and solutions
    const problems = Array.from(document.querySelectorAll('input[name="problems[]"]')).map(el => el.value);
    const solutions = Array.from(document.querySelectorAll('.rich-editor[data-field="solutions[]"]')).map(el => el.innerHTML);
    
    // Generate and download the Word document
    generateWordDocument(data, stepDescriptions, stepOutcomes, problems, solutions);
});

// Generate Word document using docx library
async function generateWordDocument(data, stepDescriptions, stepOutcomes, problems, solutions) {
    try {
        // Load the docx library dynamically
        const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = await import('https://cdn.jsdelivr.net/npm/docx@8.5.0/+esm');
        
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    // Title
                    new Paragraph({
                        text: `Job Aid: ${data.jobTitle || 'Job Aid Title'}`,
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 }
                    }),
                    
                    // Document Information
                    new Paragraph({
                        text: "Document Information",
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 400, after: 200 }
                    }),
                    new Paragraph({ text: `Job-Aid Title: ${data.jobTitle || 'Not specified'}` }),
                    new Paragraph({ text: `Version: ${data.version || '1.0'}` }),
                    new Paragraph({ text: `Date Created: ${data.dateCreated || 'Not specified'}` }),
                    new Paragraph({ text: `Author: ${data.author || 'Not specified'}` }),
                    ...(data.contactInfo ? [new Paragraph({ text: `Contact: ${data.contactInfo}` })] : []),
                    
                    // Process Steps
                    ...(stepDescriptions.some(desc => desc.trim()) ? [
                        new Paragraph({
                            text: "Process Steps",
                            heading: HeadingLevel.HEADING_2,
                            spacing: { before: 400, after: 200 }
                        }),
                        ...stepDescriptions.map((description, index) => {
                            if (description.trim()) {
                                return [
                                    new Paragraph({
                                        text: `Step ${index + 1}`,
                                        heading: HeadingLevel.HEADING_3,
                                        spacing: { before: 300, after: 100 }
                                    }),
                                    new Paragraph({ text: `Description: ${stripHtml(description)}` }),
                                    ...(stepOutcomes[index] && stepOutcomes[index].trim() ? 
                                        [new Paragraph({ text: `Expected Outcome: ${stripHtml(stepOutcomes[index])}` })] : [])
                                ];
                            }
                            return [];
                        }).flat()
                    ] : []),
                    
                    // Important Notes
                    ...(data.importantNotes && data.importantNotes.trim() ? [
                        new Paragraph({
                            text: "Important Notes",
                            heading: HeadingLevel.HEADING_2,
                            spacing: { before: 400, after: 200 }
                        }),
                        new Paragraph({ text: stripHtml(data.importantNotes) })
                    ] : []),
                    
                    // Troubleshooting
                    ...(problems.some(problem => problem.trim()) ? [
                        new Paragraph({
                            text: "Troubleshooting",
                            heading: HeadingLevel.HEADING_2,
                            spacing: { before: 400, after: 200 }
                        }),
                        ...problems.map((problem, index) => {
                            if (problem.trim() && solutions[index] && solutions[index].trim()) {
                                return [
                                    new Paragraph({
                                        text: `Problem ${index + 1}`,
                                        heading: HeadingLevel.HEADING_3,
                                        spacing: { before: 300, after: 100 }
                                    }),
                                    new Paragraph({ text: `Problem: ${problem}` }),
                                    new Paragraph({ text: `Solution: ${stripHtml(solutions[index])}` })
                                ];
                            }
                            return [];
                        }).flat()
                    ] : [])
                ]
            }]
        });
        
        // Generate and download the document
        const blob = await Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Use the job title as the filename
        const filename = data.jobTitle ? 
            data.jobTitle.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') : 
            'Job_Aid';
        a.download = `${filename}_${new Date().toISOString().split('T')[0]}.docx`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Show success message
        alert('Word document generated successfully! The file has been downloaded.');
        
    } catch (error) {
        console.error('Error generating Word document:', error);
        alert('Error generating Word document. Please try again or check your browser console for details.');
    }
}

// Strip HTML tags for Word document
function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

// Initialize rich text editors on page load
document.addEventListener('DOMContentLoaded', function() {
    initRichEditors();
}); 
// Set default date to today
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateCreated').value = today;
});

// Speech Recognition Variables
let recognition = null;
let currentTarget = null;

// Initialize Speech Recognition
function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = function() {
            showSpeechStatus('Listening...');
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            if (currentTarget) {
                if (currentTarget.tagName === 'TEXTAREA') {
                    currentTarget.value = transcript;
                } else if (currentTarget.tagName === 'INPUT') {
                    currentTarget.value = transcript;
                }
            }
            hideSpeechStatus();
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            hideSpeechStatus();
        };
        
        recognition.onend = function() {
            hideSpeechStatus();
        };
    } else {
        alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
    }
}

// Start speech recognition for specific field
function startSpeechRecognition(fieldId) {
    if (!recognition) {
        initSpeechRecognition();
    }
    
    currentTarget = document.getElementById(fieldId);
    if (currentTarget) {
        recognition.start();
        updateMicButton(fieldId, true);
    }
}

// Start speech recognition for textarea
function startSpeechRecognitionForTextarea(button) {
    if (!recognition) {
        initSpeechRecognition();
    }
    
    currentTarget = button.parentElement.querySelector('textarea');
    if (currentTarget) {
        recognition.start();
        updateMicButton(button, true);
    }
}

// Start speech recognition for input
function startSpeechRecognitionForInput(button) {
    if (!recognition) {
        initSpeechRecognition();
    }
    
    currentTarget = button.parentElement.querySelector('input');
    if (currentTarget) {
        recognition.start();
        updateMicButton(button, true);
    }
}

// Stop speech recognition
function stopSpeechRecognition() {
    if (recognition) {
        recognition.stop();
    }
    hideSpeechStatus();
    updateAllMicButtons(false);
}

// Show speech status
function showSpeechStatus(message) {
    const status = document.getElementById('speechStatus');
    const statusText = document.getElementById('speechStatusText');
    statusText.textContent = message;
    status.style.display = 'block';
}

// Hide speech status
function hideSpeechStatus() {
    const status = document.getElementById('speechStatus');
    status.style.display = 'none';
    updateAllMicButtons(false);
}

// Update microphone button state
function updateMicButton(target, isRecording) {
    const micBtn = target.querySelector ? target.querySelector('.mic-btn') : target;
    if (micBtn) {
        if (isRecording) {
            micBtn.classList.add('recording');
        } else {
            micBtn.classList.remove('recording');
        }
    }
}

// Update all microphone buttons
function updateAllMicButtons(isRecording) {
    const micBtns = document.querySelectorAll('.mic-btn');
    micBtns.forEach(btn => {
        if (isRecording) {
            btn.classList.add('recording');
        } else {
            btn.classList.remove('recording');
        }
    });
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
            <div class="textarea-with-mic">
                <textarea name="stepDescriptions[]" required placeholder="Describe what needs to be done in this step"></textarea>
                <button type="button" class="mic-btn" onclick="startSpeechRecognitionForTextarea(this)">
                    <i class="fas fa-microphone"></i>
                </button>
            </div>
        </div>
        <div class="form-group">
            <label>Expected Outcome</label>
            <div class="textarea-with-mic">
                <textarea name="stepOutcomes[]" placeholder="What should happen after this step is completed"></textarea>
                <button type="button" class="mic-btn" onclick="startSpeechRecognitionForTextarea(this)">
                    <i class="fas fa-microphone"></i>
                </button>
            </div>
        </div>
    `;
    
    container.appendChild(stepItem);
    updateStepNumbers();
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
            <div class="input-with-mic">
                <input type="text" name="problems[]" placeholder="Describe the problem">
                <button type="button" class="mic-btn" onclick="startSpeechRecognitionForInput(this)">
                    <i class="fas fa-microphone"></i>
                </button>
            </div>
        </div>
        <div class="form-group">
            <label>Solution</label>
            <div class="textarea-with-mic">
                <textarea name="solutions[]" placeholder="Describe the solution"></textarea>
                <button type="button" class="mic-btn" onclick="startSpeechRecognitionForTextarea(this)">
                    <i class="fas fa-microphone"></i>
                </button>
            </div>
        </div>
    `;
    
    container.appendChild(troubleshootingItem);
    updateTroubleshootingNumbers();
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
        
        updateStepNumbers();
        updateTroubleshootingNumbers();
    }
}

// Preview job aid
function previewJobAid() {
    const formData = new FormData(document.getElementById('jobAidForm'));
    const data = Object.fromEntries(formData.entries());
    
    // Get all step descriptions and outcomes
    const stepDescriptions = Array.from(document.querySelectorAll('textarea[name="stepDescriptions[]"]')).map(el => el.value);
    const stepOutcomes = Array.from(document.querySelectorAll('textarea[name="stepOutcomes[]"]')).map(el => el.value);
    
    // Get all troubleshooting problems and solutions
    const problems = Array.from(document.querySelectorAll('input[name="problems[]"]')).map(el => el.value);
    const solutions = Array.from(document.querySelectorAll('textarea[name="solutions[]"]')).map(el => el.value);
    
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
        <h1>Job Aid: ${data.processName || 'Process Name'}</h1>
        
        <div class="contact-info">
            <h3>Document Information</h3>
            <p><strong>Job Title:</strong> ${data.jobTitle || 'Not specified'}</p>
            <p><strong>Department:</strong> ${data.department || 'Not specified'}</p>
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
                html += `
                    <div class="step">
                        <h3>Step ${index + 1}</h3>
                        <p><strong>Description:</strong> ${description}</p>
                        ${stepOutcomes[index] && stepOutcomes[index].trim() ? 
                            `<p><strong>Expected Outcome:</strong> ${stepOutcomes[index]}</p>` : ''}
                    </div>
                `;
            }
        });
    }
    
    // Important Notes
    if (data.importantNotes && data.importantNotes.trim()) {
        html += `
            <h2>Important Notes</h2>
            <div class="important-notes">
                <p>${data.importantNotes.replace(/\n/g, '<br>')}</p>
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
                        <p><strong>Solution:</strong> ${solutions[index]}</p>
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
    
    // Get all step descriptions and outcomes
    const stepDescriptions = Array.from(document.querySelectorAll('textarea[name="stepDescriptions[]"]')).map(el => el.value);
    const stepOutcomes = Array.from(document.querySelectorAll('textarea[name="stepOutcomes[]"]')).map(el => el.value);
    
    // Get all troubleshooting problems and solutions
    const problems = Array.from(document.querySelectorAll('input[name="problems[]"]')).map(el => el.value);
    const solutions = Array.from(document.querySelectorAll('textarea[name="solutions[]"]')).map(el => el.value);
    
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
                        text: `Job Aid: ${data.processName || 'Process Name'}`,
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
                    new Paragraph({ text: `Job Title: ${data.jobTitle || 'Not specified'}` }),
                    new Paragraph({ text: `Department: ${data.department || 'Not specified'}` }),
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
                                    new Paragraph({ text: `Description: ${description}` }),
                                    ...(stepOutcomes[index] && stepOutcomes[index].trim() ? 
                                        [new Paragraph({ text: `Expected Outcome: ${stepOutcomes[index]}` })] : [])
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
                        new Paragraph({ text: data.importantNotes })
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
                                    new Paragraph({ text: `Solution: ${solutions[index]}` })
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
        a.download = `Job_Aid_${data.processName?.replace(/[^a-zA-Z0-9]/g, '_') || 'Process'}_${new Date().toISOString().split('T')[0]}.docx`;
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
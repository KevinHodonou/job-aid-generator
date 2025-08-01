// Set default date to today
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateCreated').value = today;
});

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
            <textarea name="stepDescriptions[]" required placeholder="Describe what needs to be done in this step"></textarea>
        </div>
        <div class="form-group">
            <label>Expected Outcome</label>
            <textarea name="stepOutcomes[]" placeholder="What should happen after this step is completed"></textarea>
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
            <input type="text" name="problems[]" placeholder="Describe the problem">
        </div>
        <div class="form-group">
            <label>Solution</label>
            <textarea name="solutions[]" placeholder="Describe the solution"></textarea>
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
    
    // Generate and download the job aid
    generateJobAid(data, stepDescriptions, stepOutcomes, problems, solutions);
});

// Generate and download job aid
function generateJobAid(data, stepDescriptions, stepOutcomes, problems, solutions) {
    // Create a new document
    const doc = document.implementation.createHTMLDocument();
    const html = generateJobAidHTML(data, stepDescriptions, stepOutcomes, problems, solutions);
    doc.body.innerHTML = html;
    
    // Add CSS styles for the document
    const style = doc.createElement('style');
    style.textContent = `
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #2d3748;
            text-align: center;
            border-bottom: 3px solid #667eea;
            padding-bottom: 15px;
            margin-bottom: 30px;
        }
        h2 {
            color: #4a5568;
            border-left: 4px solid #667eea;
            padding-left: 15px;
            margin: 25px 0 15px 0;
        }
        h3 {
            color: #2d3748;
            margin: 20px 0 10px 0;
        }
        .info-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .step {
            background: #f8fafc;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 15px 0;
            border-radius: 0 8px 8px 0;
        }
        .troubleshooting-item {
            background: #fff5f5;
            border-left: 4px solid #f56565;
            padding: 15px;
            margin: 15px 0;
            border-radius: 0 8px 8px 0;
        }
        .important-notes {
            background: #fffaf0;
            border: 2px solid #f6ad55;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .contact-info {
            background: #f0fff4;
            border: 2px solid #68d391;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
    `;
    doc.head.appendChild(style);
    
    // Convert to HTML string
    const htmlString = '<!DOCTYPE html>' + doc.documentElement.outerHTML;
    
    // Create blob and download
    const blob = new Blob([htmlString], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Job_Aid_${data.processName?.replace(/[^a-zA-Z0-9]/g, '_') || 'Process'}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    alert('Job Aid generated successfully! The file has been downloaded.');
}

// Generate job aid HTML
function generateJobAidHTML(data, stepDescriptions, stepOutcomes, problems, solutions) {
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
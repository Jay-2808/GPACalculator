// Define grade points
const gradePoints = {
    'O': 10,
    'A+': 9,
    'A': 8,
    'B+': 7,
    'B': 6,
    'C': 5,
    'U': 0
};
// Define default credits for each course type
// Motivational quotes array
const motivationalQuotes = [
    "The future belongs to those who believe in the beauty of their dreams.",
    "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The only way to do great work is to love what you do.",
    "Believe you can and you're halfway there.",
    "The beautiful thing about learning is that no one can take it away from you.",
    "Your time is limited, don't waste it living someone else's life.",
    "Don't watch the clock; do what it does. Keep going.",
    "If you can dream it, you can do it.",
    "The secret of getting ahead is getting started."
];

// Study tips array
const studyTips = [
    "Break your study sessions into 25-minute blocks with 5-minute breaks in between (Pomodoro Technique).",
    "Create mind maps to visualize complex concepts and their relationships.",
    "Teach what you've learned to someone else to reinforce your understanding.",
    "Review your notes within 24 hours of taking them to improve retention.",
    "Use mnemonic devices to memorize lists or sequences.",
    "Study in a quiet, well-lit environment to minimize distractions.",
    "Get 7-8 hours of sleep before exams to improve memory and cognitive function.",
    "Use different colored highlighters for different types of information.",
    "Create flashcards for key concepts and review them regularly.",
    "Take brief walks between study sessions to refresh your mind."
];

// Generate random motivational quote and study tip
function updateMotivation() {
    const quoteIndex = Math.floor(Math.random() * motivationalQuotes.length);
    const tipIndex = Math.floor(Math.random() * studyTips.length);
    
    document.getElementById('motivationalQuote').textContent = `"${motivationalQuotes[quoteIndex]}"`;
    document.getElementById('studyTip').textContent = studyTips[tipIndex];
}

// Call this function on page load
updateMotivation();

// Set interval to change motivation every 30 seconds
setInterval(updateMotivation, 30000);

// Add a single course row to the table
function addCourseRow(sno, defaultName, credits) {
    const tableBody = document.getElementById('courseTableBody');
    const row = document.createElement('tr');
    
    const gradeSelect = document.createElement('select');
    gradeSelect.className = 'course-grade';
    
    // Add grade options
    for (const grade in gradePoints) {
        const option = document.createElement('option');
        option.value = grade;
        option.textContent = grade;
        gradeSelect.appendChild(option);
    }
    
    // Create the credit input field instead of select
    const creditInput = document.createElement('input');
    creditInput.className = 'course-credits';
    creditInput.type = 'number';
    creditInput.step = '0.5';  // Allows for values like 1.5, 2.5
    creditInput.min = '0.5';   // Minimum credit value
    creditInput.value = credits;
    creditInput.style.width = '60px'; // Set an appropriate width
    
    row.innerHTML = `
        <td>${sno}</td>
        <td><input type="text" class="course-name" value="${defaultName}"></td>
        <td></td>
        <td></td>
        <td>0</td>
        <td>0</td>
        <td>
            <button class="delete-btn">🗑️</button>
        </td>
    `;
    
    // Insert form elements
    row.cells[2].appendChild(creditInput);
    row.cells[3].appendChild(gradeSelect);
    
    tableBody.appendChild(row);
    
    // Add event listeners for changes
    row.querySelector('.course-name').addEventListener('input', calculateGPA);
    
    const creditInputElement = row.querySelector('.course-credits');
    creditInputElement.addEventListener('input', function() {
        // Validate input
        if (this.value < 0.5) {
            this.value = 0.5;
        }
        calculateGPA();
        updateRowCalculations(row);
    });
    
    const gradeSelectElement = row.querySelector('.course-grade');
    gradeSelectElement.addEventListener('change', function() {
        calculateGPA();
        updateRowCalculations(row);
    });
    
    // Add delete functionality
    row.querySelector('.delete-btn').addEventListener('click', function() {
        row.remove();
        updateSerialNumbers();
        calculateGPA();
    });
    
    // Initialize row calculations
    updateRowCalculations(row);
}

// Update calculations for a specific row
function updateRowCalculations(row) {
    const credits = parseFloat(row.querySelector('.course-credits').value) || 0;
    const grade = row.querySelector('.course-grade').value;
    const points = gradePoints[grade];
    const weightedPoints = credits * points;
    
    // Update grade points cell
    row.cells[4].textContent = points;
    
    // Update weighted points cell
    row.cells[5].textContent = weightedPoints.toFixed(2);
}

// Update serial numbers after deletion
function updateSerialNumbers() {
    const rows = document.querySelectorAll('#courseTableBody tr');
    rows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
}

// Calculate GPA based on table data
function calculateGPA() {
    const rows = document.querySelectorAll('#courseTableBody tr');
    let totalCredits = 0;
    let totalWeightedPoints = 0;
    
    rows.forEach(row => {
        const credits = parseFloat(row.querySelector('.course-credits').value);
        const grade = row.querySelector('.course-grade').value;
        const points = gradePoints[grade];
        
        totalCredits += credits;
        totalWeightedPoints += credits * points;
    });
    
    // Update total credits display
    document.getElementById('totalCredits').textContent = totalCredits;
    document.getElementById('totalCreditsInTable').textContent = totalCredits;
    document.getElementById('calcTotalCredits').textContent = totalCredits;
    
    // Update total weighted points
    document.getElementById('totalWeightedPointsInTable').textContent = totalWeightedPoints;
    document.getElementById('calcWeightedPoints').textContent = totalWeightedPoints;
    
    // Calculate and display GPA
    let gpa = 0;
    if (totalCredits > 0) {
        gpa = totalWeightedPoints / totalCredits;
    }
    
    document.getElementById('gpaResult').textContent = gpa.toFixed(2);
    document.getElementById('calcResult').textContent = gpa.toFixed(2);
    
    // Apply different colors based on GPA
    const gpaDisplay = document.getElementById('gpaResult');
    if (gpa >= 9) {
        gpaDisplay.style.color = '#4361ee'; // Primary blue for excellent
    } else if (gpa >= 8) {
        gpaDisplay.style.color = '#4cc9f0'; // Accent blue for very good
    } else if (gpa >= 7) {
        gpaDisplay.style.color = '#3cb371'; // Green for good
    } else if (gpa >= 6) {
        gpaDisplay.style.color = '#ff9f1c'; // Orange for average
    } else {
        gpaDisplay.style.color = '#e63946'; // Red for below average
    }
}

// Generate table based on input values
document.getElementById('generateTable').addEventListener('click', function() {
    const theory3Count = parseInt(document.getElementById('theory3').value) || 0;
    const theory4Count = parseInt(document.getElementById('theory4').value) || 0;
    const theory1Count = parseInt(document.getElementById('theory1').value) || 0;
    const lab2Count = parseInt(document.getElementById('lab2').value) || 0;
    const lab1Count = parseInt(document.getElementById('lab1').value) || 0;
    
    const tableBody = document.getElementById('courseTableBody');
    tableBody.innerHTML = '';
    
    let courseCount = 1;
    
    // Add theory courses with 3 credits
    for (let i = 0; i < theory3Count; i++) {
        addCourseRow(courseCount++, `Theory Course ${courseCount-1}`, 3);
    }
    
    // Add theory courses with 4 credits
    for (let i = 0; i < theory4Count; i++) {
        addCourseRow(courseCount++, `Theory Course ${courseCount-1}`, 4);
    }
    
    // Add theory courses with 1 credit
    for (let i = 0; i < theory1Count; i++) {
        addCourseRow(courseCount++, `Theory Course ${courseCount-1}`, 1.5);
    }
    
    // Add lab courses with 2 credits
    for (let i = 0; i < lab2Count; i++) {
        addCourseRow(courseCount++, `Lab Course ${courseCount-1}`, 2);
    }
    
    // Add lab courses with 1 credit
    for (let i = 0; i < lab1Count; i++) {
        addCourseRow(courseCount++, `Lab Course ${courseCount-1}`, 1);
    }
    
    calculateGPA();
});

// Add new row button
document.getElementById('addRowBtn').addEventListener('click', function() {
    const rows = document.querySelectorAll('#courseTableBody tr');
    addCourseRow(rows.length + 1, `Course ${rows.length + 1}`, 3);
    calculateGPA();
});

// Download marksheet as PDF
document.getElementById('downloadBtn').addEventListener('click', function() {
    // Collect data for the marksheet
    const rows = document.querySelectorAll('#courseTableBody tr');
    const courseData = [];
    
    rows.forEach(row => {
        const name = row.querySelector('.course-name').value;
        const credits = row.querySelector('.course-credits').value;
        const grade = row.querySelector('.course-grade').value;
        const points = gradePoints[grade];
        const weightedPoints = credits * points;
        
        courseData.push({name, credits, grade, points, weightedPoints});
    });
    
    // Calculate total credits and GPA
    const totalCredits = parseFloat(document.getElementById('totalCredits').textContent);
    const gpa = parseFloat(document.getElementById('gpaResult').textContent);
    
    // Create marksheet content
    const marksheetContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Academic Marksheet</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #4361ee;
                    padding-bottom: 20px;
                }
                .student-info {
                    margin-bottom: 30px;
                }
                .student-info p {
                    margin: 5px 0;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 30px;
                }
                th, td {
                    padding: 12px 15px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                th {
                    background-color: #4361ee;
                    color: white;
                }
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                .summary {
                    background-color: #f1f1f1;
                    padding: 15px;
                    border-radius: 5px;
                    margin-bottom: 30px;
                }
                .gpa {
                    font-size: 24px;
                    font-weight: bold;
                    color: #4361ee;
                    text-align: center;
                    margin: 20px 0;
                }
                .footer {
                    text-align: center;
                    margin-top: 50px;
                    border-top: 1px solid #ddd;
                    padding-top: 20px;
                    font-size: 12px;
                    color: #777;
                }
                .signature {
                    margin-top: 70px;
                    display: flex;
                    justify-content: space-between;
                }
                .signature div {
                    width: 200px;
                    text-align: center;
                    border-top: 1px solid #333;
                    padding-top: 10px;
                }
                .calc-section {
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Academic Marksheet</h1>
                <p>Generated on ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="student-info">
                <p><strong>Student Name:</strong> Student</p>
                <p><strong>Student ID:</strong> Please update</p>
                <p><strong>Program:</strong> Please update</p>
                <p><strong>Semester:</strong> Please update</p>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Course Name</th>
                        <th>Credits</th>
                        <th>Grade</th>
                        <th>Grade Points</th>
                        <th>Weighted Points</th>
                    </tr>
                </thead>
                <tbody>
                    ${courseData.map((course, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${course.name}</td>
                            <td>${course.credits}</td>
                            <td>${course.grade}</td>
                            <td>${course.points}</td>
                            <td>${course.weightedPoints}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2"><strong>Totals</strong></td>
                        <td>${totalCredits}</td>
                        <td></td>
                        <td></td>
                        <td>${courseData.reduce((sum, course) => sum + parseFloat(course.weightedPoints), 0)}</td>
                    </tr>
                </tfoot>
            </table>
            
            <div class="calc-section">
                <h3>GPA Calculation</h3>
                <p>GPA = Total Weighted Points / Total Credits</p>
                <p>GPA = ${courseData.reduce((sum, course) => sum + parseFloat(course.weightedPoints), 0)} / ${totalCredits} = ${gpa}</p>
            </div>
            
            <div class="summary">
                <h3>Summary</h3>
                <p><strong>Total Courses:</strong> ${courseData.length}</p>
                <p><strong>Total Credits:</strong> ${totalCredits}</p>
                <div class="gpa">GPA: ${gpa}</div>
                <p><strong>Performance Analysis:</strong> 
                    ${gpa >= 9 ? 'Excellent Performance' : 
                      gpa >= 8 ? 'Very Good Performance' : 
                      gpa >= 7 ? 'Good Performance' : 
                      gpa >= 6 ? 'Satisfactory Performance' : 
                      'Needs Improvement'}
                </p>
            </div>
            
            <div class="signature">
                <div>
                    <p>Student Signature</p>
                </div>
                <div>
                    <p>Academic Advisor</p>
                </div>
            </div>
            
            <div class="footer">
                <p>This marksheet was generated by the Student GPA Calculator. For any discrepancies, please contact your academic advisor.</p>
                <p>&copy; 2025 Student GPA Calculator. All rights reserved.</p>
            </div>
        </body>
        </html>
    `;
    
    // Create a blob from the HTML content
    const blob = new Blob([marksheetContent], { type: 'text/html' });
    
    // Create a link to download the HTML file and click it
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Academic_Marksheet.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    alert('Marksheet downloaded successfully! Please open the HTML file in a browser and use the browser\'s print function to save as PDF.');
});

// Initialize with a default course row
addCourseRow(1, 'Course 1', 3);
calculateGPA();

// Add animation to the GPA display when it changes
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            const gpaDisplay = document.getElementById('gpaResult');
            gpaDisplay.classList.add('gpa-updated');
            setTimeout(() => {
                gpaDisplay.classList.remove('gpa-updated');
            }, 500);
        }
    });
});

observer.observe(document.getElementById('gpaResult'), { childList: true });



// Add this JavaScript code
document.getElementById('pdfButton').addEventListener('click', function() {
    const element = document.body; // or a specific div containing your marksheet
    const opt = {
        margin:       [0.5, 0.5, 0.5, 0.5],
        filename:     'academic_marksheet.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
});
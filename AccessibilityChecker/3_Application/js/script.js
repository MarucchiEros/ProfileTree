function openInfo(id) {
    document.getElementById(id).style.display = 'block';
}

function closeInfo(id) {
    document.getElementById(id).style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('accessibility-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevents default form submit behavior

        const urlInput = document.getElementById('url-input');
        const url = urlInput.value.trim(); // Get the entered URL and trim whitespace

        if (!url) {
            alert('Please enter a URL');
            return;
        }

        try {
            const response = await fetch('/check-accessibility', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();

            // Hide the input form
            document.querySelector('.form-container').style.display = 'none';

            // Show the accessibility stats section
            const accessibilityStats = document.getElementById('accessibility-stats');
            accessibilityStats.style.display = 'flex';

            // Show the page title in the report header
            const pageTitleElement = document.getElementById('page-title');
            pageTitleElement.innerHTML = `Accessibility Report for <b>${url}</b>`;

            let resultPass = `<div id="accessibility-report">`;
            let resultErr = `<div id="accessibility-report">`;
            const passedTests = [];
            const failedTests = [];

            const tests = {
                colorContrast: 'Color Contrast',
                linkNames: 'Link Names',
                htmlStructure: 'HTML Structure',
                roleValues: 'Role Values',
                ariaHidden: 'Aria Hidden',
                hasTitle: 'Document Title',
                sequentialHeadings: 'Sequential Headings',
                formLabels: 'Form Labels',
                userScalable: 'User Scalable',
                altTextImages: 'Alt Text For Image',
                tabIndexOrder: 'Tab Index Order',
                ariaRoles: 'ARIA Role',
                descriptiveHeadings: 'Descriptive Headings',
                landmarkRegions: 'Landmark Regions',
                formValidation: 'Form Validation',
                dynamicContentUpdates: 'Dynamic Content Updates'
            };

            for (const [key, label] of Object.entries(tests)) {
                if (data[key] === 'Passed') {
                    passedTests.push(`<td onmouseover="openInfo('${key}')" onmouseleave="closeInfo('${key}')">${label}
                        <p class="info" style="display: none" id="${key}">
                            Description of ${label}.
                        </p></td>`);
                } else {
                    failedTests.push(`<td onmouseover="openInfo('${key}')" onmouseleave="closeInfo('${key}')">${label}
                        <p class="info" style="display: none" id="${key}">
                            Description of ${label}.
                        </p></td>`);
                }
            }

            // Build the passed tests table
            if (passedTests.length > 0) {
                resultPass += `<br><div id="passed-tests"><table class="results-table">`;
                passedTests.forEach(test => {
                    resultPass += `<tr>${test}<td style="color: #198754">Passed</td></tr>`;
                });
                resultPass += `</table></div>`;
            }

            // Build the failed tests table
            if (failedTests.length > 0) {
                resultErr += `<br><div id="failed-tests"><table class="results-table">`;
                failedTests.forEach(test => {
                    resultErr += `<tr>${test}<td style="color: #871919">Failed</td></tr>`;
                });
                resultErr += `</table></div>`;
            }

            // Calculate accessibility percentage
            const totalTests = passedTests.length + failedTests.length;
            const accessibilityScore = (totalTests > 0) ? ((passedTests.length / totalTests) * 100).toFixed(1) : 0;

            // Show the accessibility percentage with pie chart
            const accessibilityPercentage = document.getElementById('accessibility-percentage');
            if (accessibilityScore >= 90) {
                accessibilityPercentage.innerHTML = `<p style="color: #4CAF50; font-size: 150%; margin-bottom: 5px;">Accessibility Score: ${accessibilityScore}%</p>`;
            } else if (accessibilityScore >= 60) {
                accessibilityPercentage.innerHTML = `<p style="color: #FFC107; font-size: 150%; margin-bottom: 5px;">Accessibility Score: ${accessibilityScore}%</p>`;
            } else if (accessibilityScore >= 40) {
                accessibilityPercentage.innerHTML = `<p style="color: #FFA500; font-size: 150%; margin-bottom: 5px;">Accessibility Score: ${accessibilityScore}%</p>`;
            } else {
                accessibilityPercentage.innerHTML = `<p style="color: #F44336; font-size: 150%; margin-bottom: 5px;">Accessibility Score: ${accessibilityScore}%</p>`;
            }
            drawPieChart(accessibilityScore);

            document.getElementById('resultPass').innerHTML = resultPass;
            document.getElementById('resultErr').innerHTML = resultErr;

            const screenshot = document.getElementById('screenshot');
            if (data.screenshot) {
                const screenshotImg = document.createElement('img');
                screenshotImg.src = `data:image/png;base64,${data.screenshot}`;
                screenshotImg.alt = `Screenshot of ${url}`;
                screenshotImg.style.cssText = 'max-width: 100%; height: auto; box-shadow: 0 0 8px rgba(0, 0, 0, 0.1); border-radius: 5px;';
                screenshot.innerHTML = '';
                screenshot.appendChild(screenshotImg);
            } else {
                screenshot.innerHTML = '<p>No screenshot available</p>';
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to fetch data. Please try again later.');
        }
    });

    function drawPieChart(percent) {
        const canvas = document.getElementById('pie-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const x = canvas.width / 2;
        const y = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) / 2.1;
        const startAngle = -0.5 * Math.PI;
        const endAngle = (percent / 100) * 2 * Math.PI;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the gray background for the pie chart
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius, 0, 2 * Math.PI);  
        ctx.closePath();
        ctx.fillStyle = '#e0e0e0';
        ctx.fill();

        // Draw the portion of the pie chart corresponding to the score
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius, startAngle, startAngle + endAngle);
        ctx.closePath();
        ctx.fillStyle = getColorForPercent(percent);
        ctx.fill();

        // Draw the border of the pie chart
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    function getColorForPercent(percent) {
        if (percent >= 90) return '#4CAF50';
        else if (percent >= 60) return '#FFC107';
        else if (percent >= 40) return '#FFA500';
        else return '#F44336';
    }
});

function closeNavbar() {
    document.getElementById("navbar1").style.display = "none";
}

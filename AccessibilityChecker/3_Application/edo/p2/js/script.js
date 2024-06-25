document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('accessibility-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const urlInput = document.getElementById('url-input');
        const url = urlInput.value.trim();

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

            // Nascondi il form di input
            document.querySelector('.form-container').style.display = 'none';

            // Mostra la sezione di statistiche sull'accessibilità
            const accessibilityStats = document.getElementById('accessibility-stats');
            accessibilityStats.style.display = 'flex'; // Usa flex invece di block

            // Mostra il titolo della pagina nell'header del report
            const pageTitleElement = document.getElementById('page-title');
            pageTitleElement.innerText = `Accessibility Report for ${url}`;

            // Calcolo percentuale di accessibilità
            let accessibilityScore = data.accessibilityScore < 0 ? 0 : data.accessibilityScore;

            // Mostra la percentuale di accessibilità con il grafico a torta
            const accessibilityPercentage = document.getElementById('accessibility-percentage');
            accessibilityPercentage.innerHTML = `<p>Accessibility Score: ${accessibilityScore}%</p>`;
            drawPieChart(accessibilityScore);

            let resultHTML = `<div id="accessibility-report"><p>Accessibility Report for <strong>${url}</strong></p>`;

            const passedTests = [];
            const failedTests = [];

            // Raccogli i risultati dei test
            if (data.colorContrast === 'Passed') passedTests.push('Color Contrast');
            else failedTests.push('Color Contrast');

            if (data.grammar === 'Passed') passedTests.push('Grammar');
            else failedTests.push('Grammar');

            if (data.linkNames === 'Passed') passedTests.push('Link Names');
            else failedTests.push('Link Names');

            if (data.htmlStructure === 'Passed') passedTests.push('HTML Structure');
            else failedTests.push('HTML Structure');

            if (data.roleValues === 'Passed') passedTests.push('Role Values');
            else failedTests.push('Role Values');

            if (data.ariaHidden === 'Passed') passedTests.push('Aria Hidden');
            else failedTests.push('Aria Hidden');

            if (data.accessibleButtons === 'Passed') passedTests.push('Accessible Buttons');
            else failedTests.push('Accessible Buttons');

            if (data.hasTitle === 'Passed') passedTests.push('Document Title');
            else failedTests.push('Document Title');

            if (data.sequentialHeadings === 'Passed') passedTests.push('Sequential Headings');
            else failedTests.push('Sequential Headings');

            if (data.formLabels === 'Passed') passedTests.push('Form Labels');
            else failedTests.push('Form Labels');

            if (data.userScalable === 'Passed') passedTests.push('User Scalable');
            else failedTests.push('User Scalable');

            // Costruisci la tabella dei test passati
            if (passedTests.length > 0) {
                resultHTML += `<div id="passed-tests"><h3>Tests Passed</h3><table>`;
                passedTests.forEach(test => {
                    resultHTML += `<tr><td>${test}</td><td>Passed</td></tr>`;
                });
                resultHTML += `</table></div>`;
            }

            // Costruisci la tabella dei test non passati
            if (failedTests.length > 0) {
                resultHTML += `<div id="failed-tests"><h3>Tests Failed</h3><table>`;
                failedTests.forEach(test => {
                    resultHTML += `<tr><td>${test}</td><td>Failed</td></tr>`;
                });
                resultHTML += `</table></div>`;
            }

            resultHTML += `</div>`;

            document.getElementById('result').innerHTML = resultHTML;

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
        const radius = canvas.width / 3;
        const startAngle = -0.5 * Math.PI;
        const endAngle = (percent / 100) * 2 * Math.PI;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius, startAngle, startAngle + endAngle);
        ctx.closePath();
        ctx.fillStyle = getColorForPercent(percent);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 10;
        ctx.stroke();
    }

    function getColorForPercent(percent) {
        if (percent >= 90) return '#4CAF50';
        else if (percent >= 70) return '#FFC107';
        else return '#F44336';
    }
});

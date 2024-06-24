document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('accessibility-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita il comportamento di default del submit del form

        const urlInput = document.getElementById('url-input');
        const url = urlInput.value.trim(); // Ottieni l'URL inserito e rimuovi eventuali spazi bianchi

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
            const formContainer = document.querySelector('.form-container');
            if (formContainer) {
                formContainer.style.display = 'none';
            }

            // Mostra la sezione di statistiche sull'accessibilità
            const accessibilityStats = document.getElementById('accessibility-stats');
            if (accessibilityStats) {
                accessibilityStats.style.display = 'block';
            }

            // Mostra il titolo della pagina nell'header del report
            const pageTitle = document.getElementById('page-title');
            if (pageTitle) {
                pageTitle.innerText = `Accessibility Report for ${url}`;
            }

            // Calcolo percentuale di accessibilità
            let accessibilityScore = data.accessibilityScore;
            if (accessibilityScore < 0) {
                accessibilityScore = 0; // Assicura che la percentuale non scenda sotto lo 0
            }

            // Mostra la percentuale di accessibilità con il grafico a torta
            const accessibilityPercentage = document.getElementById('accessibility-percentage');
            if (accessibilityPercentage) {
                accessibilityPercentage.innerHTML = `<p>Accessibility Score: ${accessibilityScore}%</p>`;
                drawPieChart(accessibilityScore);
            }

            let resultHTML = '';

            // Costruisci il contenuto del report
            resultHTML += `<div id="accessibility-report">`;
            resultHTML += `<p>Accessibility Report for <strong>${url}</strong></p>`; // Aggiungi il nome del sito nel report

            // Raggruppa le statistiche in categorie di test superati e non superati
            const passedTests = [];
            const failedTests = [];

            // Color Contrast
            if (data.colorContrast === 'Passed') {
                passedTests.push('Color Contrast');
            } else {
                failedTests.push('Color Contrast');
            }

            // Grammar
            if (data.grammar === 'Passed') {
                passedTests.push('Grammar');
            } else {
                failedTests.push('Grammar');
            }

            // Link Names
            if (data.linkNames === 'Passed') {
                passedTests.push('Link Names');
            } else {
                failedTests.push('Link Names');
            }

            // HTML Structure
            if (data.htmlStructure === 'Passed') {
                passedTests.push('HTML Structure');
            } else {
                failedTests.push('HTML Structure');
            }

            // Role Values
            if (data.roleValues === 'Passed') {
                passedTests.push('Role Values');
            } else {
                failedTests.push('Role Values');
            }

            // Nuovi Test
            if (data.ariaHidden === 'Passed') {
                passedTests.push('Aria Hidden');
            } else {
                failedTests.push('Aria Hidden');
            }

            if (data.accessibleButtons === 'Passed') {
                passedTests.push('Accessible Buttons');
            } else {
                failedTests.push('Accessible Buttons');
            }

            if (data.hasTitle === 'Passed') {
                passedTests.push('Document Title');
            } else {
                failedTests.push('Document Title');
            }

            if (data.sequentialHeadings === 'Passed') {
                passedTests.push('Sequential Headings');
            } else {
                failedTests.push('Sequential Headings');
            }

            if (data.formLabels === 'Passed') {
                passedTests.push('Form Labels');
            } else {
                failedTests.push('Form Labels');
            }

            if (data.userScalable === 'Passed') {
                passedTests.push('User Scalable');
            } else {
                failedTests.push('User Scalable');
            }

            // Costruisci la tabella dei test passati
            if (passedTests.length > 0) {
                resultHTML += `<div id="passed-tests"><h3>Tests Passed</h3>`;
                resultHTML += `<table>`;
                passedTests.forEach(test => {
                    if (test === 'HTML Structure') {
                        resultHTML += `<tr class="html-structure-row"><td>${test}</td><td>Passed <a href="#" class="show-lang-alt">Show Details</a><ul class="lang-alt-list" style="display:none;">`;
                        if (data.htmlLang) {
                            resultHTML += `<li>HTML Lang Attribute: ${data.htmlLang}</li>`;
                        } else {
                            resultHTML += `<li>HTML Lang Attribute: Not Found</li>`;
                        }
                        if (data.imageAlt) {
                            resultHTML += `<li>Image Alt Attributes: ${data.imageAlt}</li>`;
                        } else {
                            resultHTML += `<li>Image Alt Attributes: Not Found or Incomplete</li>`;
                        }
                        resultHTML += `</ul></td></tr>`;
                    } else {
                        resultHTML += `<tr><td>${test}</td><td>Passed</td></tr>`;
                    }
                });
                resultHTML += `</table></div>`;
            }

            // Costruisci la tabella dei test non passati
            if (failedTests.length > 0) {
                resultHTML += `<div id="failed-tests"><h3>Tests Failed</h3>`;
                resultHTML += `<table>`;
                failedTests.forEach(test => {
                    resultHTML += `<tr><td>${test}</td><td>Failed</td></tr>`;
                });
                resultHTML += `</table></div>`;
            }

            resultHTML += `</div>`; // Chiudi #accessibility-report

            // Inserisci il report nella pagina
            const result = document.getElementById('result');
            if (result) {
                result.innerHTML = resultHTML;
            }

            // Gestisci il click sul link "Show Details"
            const showLangAltLinks = document.querySelectorAll('.show-lang-alt');
            showLangAltLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const langAltList = link.nextElementSibling;
                    if (langAltList && langAltList.classList.contains('lang-alt-list')) {
                        langAltList.style.display = langAltList.style.display === 'none' ? 'block' : 'none';
                    }
                });
            });

            // Mostra lo screenshot se disponibile
            const screenshot = document.getElementById('screenshot');
            if (screenshot && data.screenshot) {
                const screenshotImg = document.createElement('img');
                screenshotImg.src = `data:image/png;base64,${data.screenshot}`;
                screenshotImg.alt = `Screenshot of ${url}`;
                screenshotImg.style.maxWidth = '100%';
                screenshotImg.style.height = 'auto';
                screenshotImg.style.boxShadow = '0 0 8px rgba(0, 0, 0, 0.1)';
                screenshotImg.style.borderRadius = '5px';
                screenshot.innerHTML = ''; // Rimuove eventuali contenuti precedenti
                screenshot.appendChild(screenshotImg);
            } else if (screenshot) {
                screenshot.innerHTML = '<p>No screenshot available</p>';
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to fetch data. Please try again later.');
        }
    });

    // Funzione per disegnare il grafico a torta
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

        // Disegna il segmento colorato del grafico
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius, startAngle, startAngle + endAngle);
        ctx.closePath();
        ctx.fillStyle = getColorForPercent(percent);
        ctx.fill();

        // Disegna il bordo del cerchio
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 10;
        ctx.stroke();
    }

    // Funzione ausiliaria per ottenere il colore in base alla percentuale
    function getColorForPercent(percent) {
        if (percent >= 90) {
            return '#4CAF50'; // Verde
        } else if (percent >= 70) {
            return '#FFC107'; // Giallo
        } else {
            return '#F44336'; // Rosso
        }
    }
});

function openInfo(id) {
    document.getElementById(id).style.display = 'block';
}

function closeInfo(id) {
    document.getElementById(id).style.display = 'none';
}

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
            document.querySelector('.form-container').style.display = 'none';

            // Mostra la sezione di statistiche sull'accessibilità
            const accessibilityStats = document.getElementById('accessibility-stats');
            accessibilityStats.style.display = 'flex'; // Usa flex invece di block

            // Mostra il titolo della pagina nell'header del report
            const pageTitleElement = document.getElementById('page-title');
            pageTitleElement.innerHTML = `Accessibility Report for <b>${url}</b>`;

            let resultPass = `<div id="accessibility-report">`;
            let resultErr = `<div id="accessibility-report">`;
            const passedTests = [];
            const failedTests = [];




            // Raccogli i risultati dei test                           
            if (data.colorContrast === 'Passed') passedTests.push(`<td onmouseover="openInfo('color')" onmouseleave="closeInfo('color')">Color Contrast 
                <p class="info" style="display: none" id="color">
                    Check whether the contrast between the text and the background is sufficient to be readable by people with visual impairments, such as colour blindness or reduced vision. Good contrast helps all users read text more easily.                </p></td>`);
            else failedTests.push(`<td onmouseover="openInfo('color')" onmouseleave="closeInfo('color')">Color Contrast 
                <p class="info" style="display: none" id="color">
                    Check whether the contrast between the text and the background is sufficient to be readable by people with visual impairments, such as colour blindness or reduced vision. Good contrast helps all users read text more easily.                </p></td>`);
            if (data.grammar === 'Passed') passedTests.push(`<td onmouseover="openInfo('grammar')" onmouseleave="closeInfo('grammar')">Grammar 
                <p class="info" style="display: none" id="grammar">
                    Checks if the website content is grammatically correct. Well-written and error-free text is easier to understand for all users.
                </p></td>`);
            else failedTests.push(`<td onmouseover="openInfo('grammar')" onmouseleave="closeInfo('grammar')">Grammar 
                <p class="info" style="display: none" id="grammar">
                    Checks if the website content is grammatically correct. Well-written and error-free text is easier to understand for all users.
                </p></td>`);
            if (data.linkNames === 'Passed') passedTests.push(`<td onmouseover="openInfo('link')" onmouseleave="closeInfo('link')">Link Names 
                <p class="info" style="display: none" id="link">
                    Ensures that links have descriptive names that clearly indicate their destination or action. Links like "click here" are not very useful; it is better to use descriptions like "read our article on accessibility standards".
                </p></td>`);
            else failedTests.push(`<td onmouseover="openInfo('link')" onmouseleave="closeInfo('link')">Link Names 
                <p class="info" style="display: none" id="link">
                    Ensures that links have descriptive names that clearly indicate their destination or action. Links like "click here" are not very useful; it is better to use descriptions like "read our article on accessibility standards".
                </p></td>`);
            if (data.htmlStructure === 'Passed') passedTests.push(`<td onmouseover="openInfo('structure')" onmouseleave="closeInfo('structure')"> HTML Structure 
                <p class="info" style="display: none" id="structure">
                    ciao
                </p></td>`);
            else failedTests.push(`<td onmouseover="openInfo('structure')" onmouseleave="closeInfo('structure')"> HTML Structure 
                <p class="info" style="display: none" id="structure">
                    ciao
                </p></td>`);
            if (data.roleValues === 'Passed') passedTests.push(`<td onmouseover="openInfo('role')" onmouseleave="closeInfo('role')"> Role Values 
                <p class="info" style="display: none" id="role">
                    Ensures that the page elements have correct ARIA roles. These attributes help assistive tools better understand the structure and functionality of the page elements.
                </p></td>`);
            else failedTests.push(`<td onmouseover="openInfo('role')" onmouseleave="closeInfo('role')"> Role Values
                <p class="info" style="display: none" id="role">
                    Ensures that the page elements have correct ARIA roles. These attributes help assistive tools better understand the structure and functionality of the page elements.iao
                </p></td>`);
            if (data.ariaHidden === 'Passed') passedTests.push(`<td onmouseover="openInfo('aria')" onmouseleave="closeInfo('aria')"> Aria Hidden
                <p class="info" style="display: none" id="aria">
                    Checks if elements that should not be read by screen readers have the aria-hidden="true" attribute. This is useful for hiding decorative or non-relevant content from screen reader users.
                </p></td>`);
            else failedTests.push(`<td onmouseover="openInfo('aria')" onmouseleave="closeInfo('aria')"> Aria Hidden
                <p class="info" style="display: none" id="aria">
                    Checks if elements that should not be read by screen readers have the aria-hidden="true" attribute. This is useful for hiding decorative or non-relevant content from screen reader users.
                </p></td>`);
            if (data.accessibleButtons === 'Passed') passedTests.push(`<td onmouseover="openInfo('buttons')" onmouseleave="closeInfo('buttons')"> Accessible Buttons
                <p class="info" style="display: none" id="buttons">
                    Checks if buttons are accessible via keyboard and if they have descriptive labels. Buttons must be usable by everyone, including those who cannot use a mouse.
                </p></td>`);
            else failedTests.push(`<td onmouseover="openInfo('buttons')" onmouseleave="closeInfo('buttons')"> Accesible Buttons
                <p class="info" style="display: none" id="buttons">
                    Checks if buttons are accessible via keyboard and if they have descriptive labels. Buttons must be usable by everyone, including those who cannot use a mouse.
                </p></td>`);
            if (data.hasTitle === 'Passed') passedTests.push(`<td onmouseover="openInfo('title')" onmouseleave="closeInfo('title')"> Document Title
                <p class="info" style="display: none" id="title">
                    Checks if the page has a meaningful and descriptive title. The document title appears in the browser tab and helps users quickly understand the content of the page. It is also important for search engines and users who use assistive tools.
                </p></td>`);
            else failedTests.push(`<td onmouseover="openInfo('title')" onmouseleave="closeInfo('title')"> Document title
                <p class="info" style="display: none" id="title">
                    Checks if the page has a meaningful and descriptive title. The document title appears in the browser tab and helps users quickly understand the content of the page. It is also important for search engines and users who use assistive tools.
                </p></td>`);
            if (data.sequentialHeadings === 'Passed') passedTests.push(`<td onmouseover="openInfo('sequential')" onmouseleave="closeInfo('sequential')"> Sequential Headings
                <p class="info" style="display: none" id="sequential">
                    Ensures that page headings follow a logical sequential order. This helps users better understand the page structure.
                </p></td>`);
            else failedTests.push(`<td onmouseover="openInfo('sequential')" onmouseleave="closeInfo('sequential')"> Sequential Headings
                <p class="info" style="display: none" id="sequential">
                    Ensures that page headings follow a logical sequential order. This helps users better understand the page structure.
                </p></td>`);
            if (data.formLabels === 'Passed') passedTests.push(`<td onmouseover="openInfo('label')" onmouseleave="closeInfo('label')"> Form Labels
                <p class="info" style="display: none" id="label">
                    Verifies if all form fields have descriptive labels that clearly explain what needs to be entered. Labels help users, especially those using assistive tools, understand the content and function of the fields.
                </p></td>`);
            else failedTests.push(`<td onmouseover="openInfo('label')" onmouseleave="closeInfo('label')"> Form Labels
                <p class="info" style="display: none" id="label">
                    Verifies if all form fields have descriptive labels that clearly explain what needs to be entered. Labels help users, especially those using assistive tools, understand the content and function of the fields.
                </p></td>`);
            if (data.userScalable === 'Passed') passedTests.push(`<td onmouseover="openInfo('user')" onmouseleave="closeInfo('user')"> User Scalable
                <p class="info" style="display: none" id="user">
                    Verifies if users can zoom and resize the page text. Users with visual impairments need to be able to enlarge the text to read it comfortably.
                </p></td>`);
            else failedTests.push(`<td onmouseover="openInfo('user')" onmouseleave="closeInfo('user')"> User Scalable
                <p class="info" style="display: none" id="user">
                    Verifies if users can zoom and resize the page text. Users with visual impairments need to be able to enlarge the text to read it comfortably.
                </p></td>`);
            if (data.altTextImages === 'Passed') passedTests.push(`<td onmouseover="openInfo('text')" onmouseleave="closeInfo('text')"> Alt Text For Image
                <p class="info" style="display: none" id="text">
                    Checks if all images have alternative text (alt). The alt text describes the image for users who cannot see it, including those using screen readers.
                </p></td>`);
            else failedTests.push(`<td onmouseover="openInfo('text')" onmouseleave="closeInfo('text')"> Alt Text For Image
                <p class="info" style="display: none" id="text">
                    Checks if all images have alternative text (alt). The alt text describes the image for users who cannot see it, including those using screen readers.
                </p></td>`);
            if (data.tabIndexOrder === 'Passed') passedTests.push(`<td onmouseover="openInfo('index')" onmouseleave="closeInfo('index')"> Tab Index Order
                <p class="info" style="display: none" id="index">
                    Ensures that the tab order is logical and follows the visual sequence of the page. Users must be able to easily navigate through content using the keyboard.
                </p></td>`);
            else failedTests.push(`<td onmouseover="openInfo('index')" onmouseleave="closeInfo('index')"> Tab Index Order
                <p class="info" style="display: none" id="index">
                    Ensures that the tab order is logical and follows the visual sequence of the page. Users must be able to easily navigate through content using the keyboard.
                </p></td>`);
            if (data.ariaRoles === 'Passed') passedTests.push(`<td onmouseover="openInfo('Arole')" onmouseleave="closeInfo('Arole')"> ARIA Role
                <p class="info" style="display: none" id="Arole">
                    Similar to role values, this check ensures that elements have appropriate ARIA roles to describe their function, such as button, navigation, main, etc.
                </p></td>`);
            else failedTests.push(`<td onmouseover="openInfo('Arole')" onmouseleave="closeInfo('Arole')"> ARIA Role
                <p class="info" style="display: none" id="Arole">
                    Similar to role values, this check ensures that elements have appropriate ARIA roles to describe their function, such as button, navigation, main, etc.
                </p></td>`);
            if (data.descriptiveHeadings === 'Passed') passedTests.push(`<td onmouseover="openInfo('descriptive')" onmouseleave="closeInfo('descriptive')"> Descriptive Headings
                <p class="info" style="display: none" id="descriptive">
                    Ensures that the page headings are descriptive and hierarchically organized. Descriptive headings help users navigate and understand the page structure.
                </p></td>`);
            else failedTests.push(`<td onmouseover="openInfo('descriptive')" onmouseleave="closeInfo('descriptive')"> Descriptive Headings
                <p class="info" style="display: none" id="descriptive">
                    Ensures that the page headings are descriptive and hierarchically organized. Descriptive headings help users navigate and understand the page structure.
                </p></td>`);
            if (data.landmarkRegions === 'Passed') passedTests.push(`<td onmouseover="openInfo('landmark')" onmouseleave="closeInfo('landmark')"> Landmark Regions
                <p class="info" style="display: none" id="landmark">
                    Checks if the page correctly uses landmark regions (such as nav, main, footer) to clearly define different parts of the page. This helps assistive tools provide more efficient navigation.
                </p></td>`);
            else failedTests.push(`<td onmouseover="openInfo('landmark')" onmouseleave="closeInfo('landmark')"> Landmark Regions
                <p class="info" style="display: none" id="landmark">
                    Checks if the page correctly uses landmark regions (such as nav, main, footer) to clearly define different parts of the page. This helps assistive tools provide more efficient navigation.
                </p></td>`);
            if (data.formValidation === 'Passed') passedTests.push(`<td onmouseover="openInfo('from')" onmouseleave="closeInfo('from')"> Form Validation
                <p class="info" style="display: none" id="from">
                    Checks if forms have proper validation mechanisms and if errors are clearly communicated to users. Users need to know when they have made an error and how to correct it.
                </p></td>`);
            else failedTests.push(`<td onmouseover="openInfo('from')" onmouseleave="closeInfo('from')"> Form Validation
                <p class="info" style="display: none" id="from">
                    Checks if forms have proper validation mechanisms and if errors are clearly communicated to users. Users need to know when they have made an error and how to correct it.
                </p></td>`);
            if (data.focusableElements === 'Passed') passedTests.push(`<td onmouseover="openInfo('focusable')" onmouseleave="closeInfo('focusable')"> Focusable Elements
                <p class="info" style="display: none" id="focusable">
                    Verifies if all interactive elements (like links, buttons, form fields) can be focused and used via keyboard. Users who cannot use a mouse must be able to access all interactive elements.
                </p></td>`);
            else failedTests.push(`<td onmouseover="openInfo('focusable')" onmouseleave="closeInfo('focusable')"> Focusable Elements
                <p class="info" style="display: none" id="focusable">
                    Verifies if all interactive elements (like links, buttons, form fields) can be focused and used via keyboard. Users who cannot use a mouse must be able to access all interactive elements.
                </p></td>`);
            if (data.dynamicContentUpdates === 'Passed') passedTests.push(`<td onmouseover="openInfo('dynamic')" onmouseleave="closeInfo('dynamic')"> Dynamic Content Updates
                <p class="info" style="display: none" id="dynamic">
                    Verifies if dynamic content updates are properly communicated to users, especially those using screen readers. Dynamic updates should not surprise or confuse users.
                </p></td>`);
            else failedTests.push(`<td onmouseover="openInfo('dynamic')" onmouseleave="closeInfo('dynamic')"> Dynamic Content Updates
                <p class="info" style="display: none" id="dynamic">
                    Verifies if dynamic content updates are properly communicated to users, especially those using screen readers. Dynamic updates should not surprise or confuse users.
                </p></td>`);

            // Costruisci la tabella dei test passati
            if (passedTests.length > 0) {
                resultPass += `<br><div id="passed-tests"><table class="results-table">`;
                passedTests.forEach(test => {
                    resultPass += `<tr>${test}<td style="color: #198754">Passed</td></tr>`;
                });
                resultPass += `</table></div>`;
            }

            // Costruisci la tabella dei test non passati
            if (failedTests.length > 0) {
                resultErr += `<br><div id="failed-tests"><table class="results-table">`;
                failedTests.forEach(test => {
                    resultErr += `<tr>${test}<td style="color: #871919">Failed</td></tr>`;
                });
                resultErr += `</table></div>`;
            }

            // Calcolo percentuale di accessibilità
            const totalTests = passedTests.length + failedTests.length;
            const accessibilityScore = (totalTests > 0) ? ((passedTests.length / totalTests) * 100).toFixed(1) : 0;

            // Mostra la percentuale di accessibilità con il grafico a torta
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

        // Disegna lo sfondo grigio per il grafico a torta
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius, 0, 2 * Math.PI);  
        ctx.closePath();
        ctx.fillStyle = '#e0e0e0';
        ctx.fill();

        // Disegna la parte del grafico a torta corrispondente al punteggio
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius, startAngle, startAngle + endAngle);
        ctx.closePath();
        ctx.fillStyle = getColorForPercent(percent);
        ctx.fill();

        // Disegna il bordo del grafico a torta
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

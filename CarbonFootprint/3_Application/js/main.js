/* this function retrieves and prints website details */
async function getPageDetails() {
    let url = document.getElementById('url').value;
    url = cleanUrl(url);
    if (!url) {
        alert('Please enter a valid URL.');
        return;
    }
    try {
        document.querySelector('.custom-loader').style.display = 'inline-block';
        document.getElementById('result').style.display = 'none';
        document.getElementById('firstResult').style.display = 'none';

        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        if (!response.ok) {
            throw new Error('An error occurred during information retrieval. Please try again.');
        }

        const data = await response.json();
        const pageSizeBytes = new Blob([data.contents]).size;
        const pageSizeMB = pageSizeBytes / (1024 * 1024);
        const energyConsumption = calculateEnergyConsumption(pageSizeBytes);
        const carbonEmissions = calculateCarbonEmissions(energyConsumption);
        const httpRequests = getHttpRequests(data.contents);
        const externalResources = getExternalResources(data.contents);
        const contentType = getContentType(data.contents);
        const responseTime = calculateResponseTime();
        const maxCarbonEmissions = 2;
        const carbonEmissionsPercentage = (carbonEmissions / maxCarbonEmissions) * 100;

        document.getElementById('site-name').innerText = getSiteName(url);
        document.getElementById('page-size').innerText = `Web page weight: ${pageSizeMB.toFixed(2)} MB`;
        document.getElementById('energy-consumption').innerText = `Estimated electricity consumption: ${energyConsumption.toFixed(2)} kWh`;
        document.getElementById('response-time').innerText = `Response time: ${responseTime} ms`;
        document.getElementById('carbon-emissions').innerText = `Carbon emissions: ${carbonEmissions.toFixed(2)} g CO2 `;

        var letter = `${getLetterFromEmissions(carbonEmissions)}`;
        echoLetter(letter);

        document.getElementById('carbon-emissions-bar').style.width = `0%`;
        document.getElementById('carbon-emissions-bar-red').style.width = `0%`;
        setTimeout(() => {
            document.getElementById('carbon-emissions-bar-red').style.width = `${carbonEmissionsPercentage}%`;
            document.getElementById('carbon-emissions-bar').style.width = `${100 - carbonEmissionsPercentage}%`;
        }, 100);

        document.querySelector('.custom-loader').style.display = 'none';
        document.getElementById('result').style.display = 'block';
        document.getElementById('firstResult').style.display = 'block';
    } catch (error) {
        console.error('Error during information retrieval:', error);
        alert('An error occurred during information retrieval. Please try again.');
        document.querySelector('.custom-loader').style.display = 'none';
    }
}

/* this function decrees the carbon emission letter for each website */
function getLetterFromEmissions(emissions) {
    if (emissions >= 1.5) {
        return 'F';
    } else if (emissions >= 1.2) {
        return 'E';
    } else if (emissions >= 0.9) {
        return 'D';
    } else if (emissions >= 0.6) {
        return 'C';
    } else if (emissions >= 0.3) {
        return 'B';
    } else {
        return 'A';
    }
}

/* this function is used to print the image of the letter depending on the level of emission */
function echoLetter(letter) {
    if (letter == `A`) {
        document.getElementById('letterCarbonEmission').innerHTML = `<img width="80" height="80" src="https://img.icons8.com/dotty/80/40C057/circled-a.png" alt="circled-a"/>`;
    } else if (letter == `B`) {
        document.getElementById('letterCarbonEmission').innerHTML = `<img width="80" height="80" src="https://img.icons8.com/dotty/80/FAB005/circled-b.png" alt="circled-b"/>`;
    } else if (letter == `C`) {
        document.getElementById('letterCarbonEmission').innerHTML = `<img width="80" height="80" src="https://img.icons8.com/dotty/80/FD7E14/circled-c.png" alt="circled-c"/>`;
    } else if (letter == `D`) {
        document.getElementById('letterCarbonEmission').innerHTML = `<img width="80" height="80" src="https://img.icons8.com/dotty/80/7950F2/circled-d.png" alt="circled-d"/>`;
    } else if (letter == `E`) {
        document.getElementById('letterCarbonEmission').innerHTML = `<img width="80" height="80" src="https://img.icons8.com/ios/50/228BE6/circled-e.png" alt="circled-e"/>`;
    } else if (letter == `F`) {
        document.getElementById('letterCarbonEmission').innerHTML = `<img width="80" height="80" src="https://img.icons8.com/dotty/80/FA5252/circled-f.png" alt="circled-f"/>`;
    }
}

/* This function is for cleaning URLs */
function cleanUrl(url) {
    try {
        const parsedUrl = new URL(url);
        return `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    } catch (error) {
        console.error('Invalid URL:', error);
        return null;
    }
}

/* this function is used to calculate carbon emissions */
function calculateCarbonEmissions(energyConsumption) {
    const conversionFactor = 0.12;
    const carbonEmissions = energyConsumption * conversionFactor;
    return carbonEmissions;
}

/* this function performs the calculation for the response time of the website */
function calculateResponseTime() {
    const pageLoadTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    return pageLoadTime;
}

/* this function performs the calculation for the energy consumption of a website */
function calculateEnergyConsumption(pageSizeBytes) {
    const energyPerByte = 0.000015;
    const totalEnergyConsumption = pageSizeBytes * energyPerByte;
    return totalEnergyConsumption;
}

/* this function calculates how many http requests there are */
function getHttpRequests(pageContent) {
    const httpMatches = pageContent.match(/http/gi);
    return httpMatches ? httpMatches.length : 0;
}

/* this function calculates how many external resources there are */
function getExternalResources(pageContent) {
    const externalResourceMatches = pageContent.match(/<(img|link|script|audio|video|iframe)\s/gi);
    return externalResourceMatches ? externalResourceMatches.length : 0;
}

/* this function obtains the content of the page */
function getContentType(pageContent) {
    const contentTypeMatch = pageContent.match(/<meta\s+.*?http-equiv=["']?content-type["']?\s+.*?>/gi);
    if (contentTypeMatch) {
        const contentTypeValueMatch = contentTypeMatch[0].match(/content=["']?([^"'>]+)["']?/i);
        if (contentTypeValueMatch && contentTypeValueMatch[1]) {
            return contentTypeValueMatch[1];
        }
    }
    return 'Not available';
}

/* this function gets the name of the page */
function getSiteName(url) {
    const hostname = new URL(url).hostname;
    return hostname;
}

/* this function is used to display additional information on the page */
function showMoreInfo() {
    const carbonEmissionsText = document.getElementById('carbon-emissions').innerText;
    const carbonEmissions = parseFloat(carbonEmissionsText.split(' ')[2]);

    let monthlyVisits = parseInt(document.getElementById('monthlyVisits').value);
    if (isNaN(monthlyVisits) || monthlyVisits < 1) {
        alert('Please enter a valid number of monthly visits.');
        monthlyVisits = 10000;
        document.getElementById('monthlyVisits').value = monthlyVisits;
        return;
    }

    const annualVisits = monthlyVisits * 12;
    const annualCO2 = (carbonEmissions / 1000) * annualVisits;

    if (isNaN(annualCO2)) {
        alert('Error calculating annual CO2 emissions.');
        return;
    }

    const teaCups = (annualCO2 / 0.00736).toFixed(0);
    const smartphoneCharges = (annualCO2 / 0.0053).toFixed(0);
    const kWhEnergy = (annualCO2 / 0.128).toFixed(2);

    if (isNaN(teaCups) || isNaN(smartphoneCharges) || isNaN(kWhEnergy)) {
        alert('Error converting CO2 emissions.');
        return;
    }

    document.getElementById('carbon-emission-examples').innerHTML = `
        <p>With this visits per month, this page emits approximately ${annualCO2.toFixed(2)} kg of CO2, which is equivalent to:</p>
        <ul>
            <li>Boiling water for ${teaCups} cups of tea</li>
            <li>Charging an average smartphone ${smartphoneCharges} times</li>
            <li>Consuming ${kWhEnergy} kWh of energy</li>
        </ul>
    `;

    document.getElementById('secondResult').style.display = 'block';
    document.getElementById('moreInformation').style.display = 'none';
    document.getElementById('lessInformation').style.display = 'inline-block';
}

/* this function is used to hide additional information once a button is clicked */
function showLessInfo() {
    document.getElementById('secondResult').style.display = 'none';
    document.getElementById('moreInformation').style.display = 'inline-block';
    document.getElementById('lessInformation').style.display = 'none';
}

/* Function to update CO2 emission examples based on monthly visits */
function updateExamples() {
    const carbonEmissionsText = document.getElementById('carbon-emissions').innerText;
    const carbonEmissions = parseFloat(carbonEmissionsText.split(' ')[2]);

    const monthlyVisits = parseInt(document.getElementById('monthlyVisits').value);
    if (isNaN(monthlyVisits) || monthlyVisits < 1) {
        alert('Please enter a valid number of monthly visits.');
        return;
    }

    const annualVisits = monthlyVisits * 12;
    const annualCO2 = (carbonEmissions / 1000) * annualVisits;

    if (isNaN(annualCO2)) {
        alert('Error calculating annual CO2 emissions.');
        return;
    }

    const teaCups = (annualCO2 / 0.00736).toFixed(0);
    const smartphoneCharges = (annualCO2 / 0.0053).toFixed(0);
    const kWhEnergy = (annualCO2 / 0.128).toFixed(2);

    if (isNaN(teaCups) || isNaN(smartphoneCharges) || isNaN(kWhEnergy)) {
        monthlyVisits = 10000;
        alert('Error converting CO2 emissions.');
        return;
    }

    document.getElementById('carbon-emission-examples').innerHTML = `
        <p>With this visits per month, this page emits approximately ${annualCO2.toFixed(2)} kg of CO2, which is equivalent to:</p>
        <ul>
            <li>Boiling water for ${teaCups} cups of tea</li>
            <li>Charging an average smartphone ${smartphoneCharges} times</li>
            <li>Consuming ${kWhEnergy} kWh of energy</li>
        </ul>
    `;
}

// Download the contents of the page
function downloadPDF() {
    const doc = new jsPDF();

    const element = document.getElementById('pdf-content');

    const options = {
        margin: { top: 10, left: 10, right: 10, bottom: 10 },
        html2canvas: { scale: 0.8 },
        filename: 'carbon_footprint_report.pdf',
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: 'avoid-all' }
    };

    html2pdf().from(element).set(options).save();
}

// Prints the contents of the page
function customPrint() {
    window.scrollTo(0, 0);
    setTimeout(function () {
        window.print();
        document.body.removeChild(printContainer);
    }, 300);
}








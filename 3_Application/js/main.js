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
        const pageSizeKB = pageSizeBytes / 1024;
        const pageSizeMB = pageSizeKB / 1024;
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
        /*document.getElementById('http-requests').innerText = `Number of HTTP requests: ${httpRequests}`;*/
        /*document.getElementById('external-resources').innerText = `Number of external resources: ${externalResources}`;*/
        /*document.getElementById('content-type').innerText = `content type: ${contentType}`;*/
        document.getElementById('response-time').innerText = `Response time: ${responseTime} ms`;
        document.getElementById('carbon-emissions').innerText = `Carbon emissions: ${carbonEmissions.toFixed(2)} g CO2 | Level ${getLetterFromEmissions(carbonEmissions)}`;

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

function getLetterFromEmissions(emissions) {
    if (emissions >= 2) {
        return 'F';
    } else if (emissions >= 0.8) {
        return 'E';
    } else if (emissions >= 0.6) {
        return 'D';
    } else if (emissions >= 0.4) {
        return 'C';
    } else if (emissions >= 0.2) {
        return 'B';
    } else {
        return 'A';
    }
}

function cleanUrl(url) {
    try {
        const parsedUrl = new URL(url);
        return `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    } catch (error) {
        console.error('Invalid URL:', error);
        return null;
    }
}

function calculateCarbonEmissions(energyConsumption) {
    const conversionFactor = 0.12; 
    const carbonEmissions = energyConsumption * conversionFactor;
    return carbonEmissions;
}

function calculateResponseTime() {
    const pageLoadTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    return pageLoadTime;
}

function calculateEnergyConsumption(pageSizeBytes) {
    const energyPerByte = 0.000015; 
    const totalEnergyConsumption = pageSizeBytes * energyPerByte;
    return totalEnergyConsumption;
}
function getHttpRequests(pageContent) {
    const httpMatches = pageContent.match(/http/gi);
    return httpMatches ? httpMatches.length : 0;
}
function getExternalResources(pageContent) {
    const externalResourceMatches = pageContent.match(/<(img|link|script|audio|video|iframe)\s/gi);
    return externalResourceMatches ? externalResourceMatches.length : 0;
}
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
function getSiteName(url) {
    const hostname = new URL(url).hostname;
    return hostname;
}

function showMoreInfo() {
    document.getElementById('secondResult').style.display = 'block';
    document.getElementById('moreInformation').style.display = 'none';
    document.getElementById('lessInformation').style.display = 'inline-block';

}
function showLessInfo() {
    document.getElementById('secondResult').style.display = 'none';
    document.getElementById('moreInformation').style.display = 'inline-block';
    document.getElementById('lessInformation').style.display = 'none';
}



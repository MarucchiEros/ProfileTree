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

        /* library to obtain data from websites */
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        if (!response.ok) {
            throw new Error('An error occurred during information retrieval. Please try again.');
        }

        /* constant declaration */
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


        /* emission bar animation */
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

/* this function is used to show additional information once a button is clicked */
function showMoreInfo() {
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



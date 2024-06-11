async function getPageDetails() {
    let url = document.getElementById('url').value;
    url = cleanUrl(url);
    if (!url) {
        alert('Per favore, inserisci un URL valido.');
        return;
    }
    try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        if (!response.ok) {
            throw new Error('Errore nel recupero dei dati della pagina');
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
        document.getElementById('page-size').innerText = `Peso della pagina web: ${pageSizeMB.toFixed(2)} MB`;
        document.getElementById('energy-consumption').innerText = `Consumo di elettricità stimato: ${energyConsumption.toFixed(2)} kWh`;
        document.getElementById('http-requests').innerText = `Numero di richieste HTTP: ${httpRequests}`;
        document.getElementById('external-resources').innerText = `Numero di risorse esterne: ${externalResources}`;
        document.getElementById('content-type').innerText = `Tipo di contenuto: ${contentType}`;
        document.getElementById('response-time').innerText = `Tempo di risposta: ${responseTime} ms`;
        document.getElementById('carbon-emissions').innerText = `Emissioni di carbonio: ${carbonEmissions.toFixed(2)} g CO2 (${getLetterFromEmissions(carbonEmissions)})`;
        
        document.getElementById('carbon-emissions-bar').style.width = `0%`;
        document.getElementById('carbon-emissions-bar-red').style.width = `0%`;
        setTimeout(() => {
            document.getElementById('carbon-emissions-bar-red').style.width = `${carbonEmissionsPercentage}%`;
            document.getElementById('carbon-emissions-bar').style.width = `${100 - carbonEmissionsPercentage}%`;
        }, 100); 

        document.getElementById('result').style.display = 'block';
    } catch (error) {
        console.error('Errore durante il recupero delle informazioni:', error);
        alert('Si è verificato un errore durante il recupero delle informazioni. Per favore, riprova.');
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
        console.error('URL non valido:', error);
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
    return 'Non disponibile';
}

function getSiteName(url) {
    const hostname = new URL(url).hostname;
    return hostname;
}
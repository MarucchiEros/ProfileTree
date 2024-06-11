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
        document.getElementById('firstResult').style.display = 'block';
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
    // Utilizzare un fattore di conversione per calcolare le emissioni di carbonio
    const conversionFactor = 0.12; // kg CO2 emesse per ogni kWh di energia consumata
    const carbonEmissions = energyConsumption * conversionFactor;
    return carbonEmissions;
}



function calculateResponseTime() {
    // Utilizzare performance.timing per ottenere il tempo di risposta della pagina
    const pageLoadTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    return pageLoadTime;
}

function calculateEnergyConsumption(pageSizeBytes) {
    // Utilizzare dati reali per il consumo di energia per byte trasferito
    // Ad esempio, 0.000015 kWh per byte (valore ipotetico)
    const energyPerByte = 0.000015; // Consumo energetico per byte trasferito (kWh)
    // Calcolo del consumo di energia totale (kWh)
    const totalEnergyConsumption = pageSizeBytes * energyPerByte;
    return totalEnergyConsumption;
}
function getHttpRequests(pageContent) {
    // Conta il numero di occorrenze di 'http' nel contenuto della pagina
    const httpMatches = pageContent.match(/http/gi);
    return httpMatches ? httpMatches.length : 0;
}
function getExternalResources(pageContent) {
    // Conta il numero di occorrenze di tag per le risorse esterne (img, link, script, ecc.)
    const externalResourceMatches = pageContent.match(/<(img|link|script|audio|video|iframe)\s/gi);
    return externalResourceMatches ? externalResourceMatches.length : 0;
}
function getContentType(pageContent) {
    // Estrai il tipo di contenuto dalla stringa dei metadati
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
    // Estrae il nome del sito dall'URL
    const hostname = new URL(url).hostname;
    return hostname;
}

function showMoreInfo(){
    document.getElementById('secondResult').style.display = 'block';
    document.getElementById('moreInformation').style.display = 'none';
    document.getElementById('lessInformation').style.display = 'inline-block';  

}
function showLessInfo(){
    document.getElementById('secondResult').style.display = 'none';
    document.getElementById('moreInformation').style.display = 'inline-block';
    document.getElementById('lessInformation').style.display = 'none';  
}
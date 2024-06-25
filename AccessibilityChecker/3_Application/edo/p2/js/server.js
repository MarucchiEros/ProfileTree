const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const axeCore = require('axe-core');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..')));

app.post('/check-accessibility', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).send({ error: 'URL is required' });
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' });

        // Screenshot
        const screenshot = await page.screenshot({ encoding: 'base64' });

        // Inject and run Axe for accessibility testing
        await page.addScriptTag({ content: axeCore.source });
        const accessibilityReport = await page.evaluate(() => {
            return new Promise((resolve) => {
                axe.run((err, results) => {
                    if (err) throw err;
                    resolve(results);
                });
            });
        });

        // Check for additional accessibility issues
        const ariaHidden = await page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('[aria-hidden="true"]'));
            return elements.every(el => el.hasAttribute('aria-hidden')) ? 'Passed' : 'Failed';
        });

        const accessibleButtons = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            return buttons.every(button => button.getAttribute('aria-label') || button.textContent.trim() !== '') ? 'Passed' : 'Failed';
        });

        const hasTitle = await page.evaluate(() => {
            return document.title.trim() !== '' ? 'Passed' : 'Failed';
        });

        const sequentialHeadings = await page.evaluate(() => {
            const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
            let isSequential = true;
            headings.reduce((prev, current) => {
                const prevLevel = parseInt(prev.tagName[1]);
                const currentLevel = parseInt(current.tagName[1]);
                if (currentLevel > prevLevel + 1) {
                    isSequential = false;
                }
                return current;
            });
            return isSequential ? 'Passed' : 'Failed';
        });

        const formLabels = await page.evaluate(() => {
            const labels = Array.from(document.querySelectorAll('label'));
            const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
            const labeledInputs = inputs.filter(input => {
                const id = input.getAttribute('id');
                return labels.some(label => label.getAttribute('for') === id);
            });
            return labeledInputs.length === inputs.length ? 'Passed' : 'Failed';
        });

        const userScalable = await page.evaluate(() => {
            const metaViewport = document.querySelector('meta[name="viewport"]');
            if (!metaViewport) return 'Failed';
            const content = metaViewport.getAttribute('content');
            if (!content) return 'Failed';
            const scalable = !content.includes('user-scalable=no');
            return scalable ? 'Passed' : 'Failed';
        });

        // Check for lang attribute in HTML
        const htmlLang = await page.evaluate(() => {
            const lang = document.querySelector('html').getAttribute('lang');
            return lang ? lang : null;
        });

        // Check for alt attributes in images
        const imageAlt = await page.evaluate(() => {
            const images = Array.from(document.querySelectorAll('img'));
            const altAttributes = images.map(img => img.getAttribute('alt'));
            return altAttributes.every(alt => alt !== null && alt.trim() !== '') ? 'All images have alt attributes' : null;
        });

        await browser.close();

        // Analyze the accessibility report
        const colorContrast = accessibilityReport.violations.find(violation => violation.id === 'color-contrast') ? 'Failed' : 'Passed';
        const grammar = 'Not Checked';  // Puppeteer alone cannot check grammar.
        const linkNames = accessibilityReport.violations.find(violation => violation.id === 'link-name') ? 'Failed' : 'Passed';
        const htmlStructure = accessibilityReport.violations.find(violation => violation.id === 'html-has-lang') ? 'Failed' : 'Passed';
        const roleValues = accessibilityReport.violations.find(violation => violation.id === 'aria-valid-attr-value') ? 'Failed' : 'Passed';

        const accessibilityScore = Math.round(((11 - accessibilityReport.violations.length) / 11) * 100);

        res.send({
            colorContrast,
            grammar,
            linkNames,
            htmlStructure,
            roleValues,
            ariaHidden,
            accessibleButtons,
            hasTitle,
            sequentialHeadings,
            formLabels,
            userScalable,
            accessibilityScore,
            screenshot,
            htmlLang,
            imageAlt
        });
    } catch (error) {
        console.error('Error occurred while checking accessibility:', error);
        res.status(500).send({ error: 'An error occurred while checking accessibility' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

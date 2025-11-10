const patterns = [
    {
        name: 'Urgency',
        type: 'high-risk',
        
        regex: /(limited time only|offer ends (in|today|soon)|hurry|don't miss out|(\d{1,2}:\d{2}:\d{2}))/gi,
        explanation: 'Creates a false sense of a limited timeframe to pressure you into acting quickly.',
        score: 10
    },
    {
        name: 'Scarcity',
        type: 'high-risk',
       
        regex: /(only (\d+|a few) left|low in stock|selling fast|almost gone)/gi,
        explanation: 'Makes you believe a product is in short supply to rush your purchase.',
        score: 10
    },
    {
        name: 'Emotional Pressure',
        type: 'medium-risk',
        
        regex: /(no thanks, i|i don't want|i hate (saving|deals)|i want to pay full price|rnicrosoft@gmail.com)/gi,
        explanation: 'Uses guilt or shame to make you opt-in to something you might not want.',
        score: 5
    },
    {
        name: 'Forced Consent',
        type: 'medium-risk',
        
        regex: /(by (using|continuing|visiting) this (site|service), you agree)/gi,
        explanation: 'Forces you to agree to terms (like cookie tracking or newsletters) just by browsing the site.',
        score: 5
    },
    {
        name: 'Pre-selection',
        type: 'medium-risk',
        
        
        regex: /(you agree to our newsletter|pre-selected for you|we've signed you up)/gi,
        explanation: 'Automatically opts you into services or subscriptions, hoping you won\'t notice.',
        score: 5
    }
];


const textInput = document.getElementById('text-input');
const analyzeButton = document.getElementById('analyze-button');
const clearButton = document.getElementById('clear-button');
const summaryContainer = document.getElementById('summary-container');
const patternsContainer = document.getElementById('patterns-container');
const highlightedOutput = document.getElementById('highlighted-output');


analyzeButton.addEventListener('click', handleAnalysis);
clearButton.addEventListener('click', clearAll);



function handleAnalysis() {
    const text = textInput.value;
    if (!text) {
        alert("Please paste some text to analyze.");
        return;
    }

    
    summaryContainer.innerHTML = '';
    patternsContainer.innerHTML = '';
    
    let totalScore = 0;
    let foundPatterns = [];
    let highlightedText = text;

    
    patterns.forEach(pattern => {
        const matches = [...text.matchAll(pattern.regex)];

        if (matches.length > 0) {
            matches.forEach(match => {
                const snippet = match[0]; 
                
                
                foundPatterns.push({
                    ...pattern, 
                    snippet: snippet
                });
                
                totalScore += pattern.score;
            });

            
            highlightedText = highlightedText.replace(
                pattern.regex, 
                `<span class="highlight ${pattern.name.toLowerCase()}">$&</span>`
            );
        }
    });

    
    displaySummary(totalScore);
    displayHighlightedText(highlightedText);
    displayPatternCards(foundPatterns);
}



function displaySummary(score) {
    let riskLevel = 'low-risk';
    let title = 'Low Risk';
    let message = 'This text shows no or few signs of manipulative patterns.';

    if (score > 30) {
        riskLevel = 'high-risk';
        title = 'High Risk';
        message = 'This text shows significant signs of dark patterns. Proceed with caution.';
    } else if (score > 10) {
        riskLevel = 'medium-risk';
        title = 'Medium Risk';
        message = 'This text shows some signs of manipulative language. Be aware.';
    }

    const summaryCard = `
        <div class="summary-card ${riskLevel}">
            <h2>${title} (Score: ${score})</h2>
            <p>${message}</p>
        </div>
    `;
    summaryContainer.innerHTML = summaryCard;
}

function displayHighlightedText(html) {
    highlightedOutput.innerHTML = html;
}

function displayPatternCards(foundPatterns) {
    if (foundPatterns.length === 0) {
        patternsContainer.innerHTML = '<p>No specific dark patterns were detected.</p>';
        return;
    }

    
    const uniquePatternTypes = new Map();
    foundPatterns.forEach(p => {
        if (!uniquePatternTypes.has(p.name)) {
            uniquePatternTypes.set(p.name, p);
        }
    });

    uniquePatternTypes.forEach(pattern => {
        const card = `
            <div class="pattern-card ${pattern.type}">
                <h4>${pattern.name}</h4>
                <p class="snippet">Example: "${pattern.snippet}"</p>
                <p class="explanation">${pattern.explanation}</p>
            </div>
        `;
        patternsContainer.innerHTML += card;
    });
}



function clearAll() {
    textInput.value = '';
    summaryContainer.innerHTML = '';
    patternsContainer.innerHTML = '';
    highlightedOutput.innerHTML = '<p class="placeholder">Your analyzed text will appear here...</p>';
}

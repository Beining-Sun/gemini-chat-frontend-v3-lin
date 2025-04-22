// 在 script.js 最顶部添加 ↓
const GEMINI_API_KEY = "AIzaSyCo1NhsZBJg5Yloi5HcrdeMnkNGrSloJ9E";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;


document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const welcomeScreen = document.getElementById('welcomeScreen');
    const simulatorScreen = document.getElementById('simulatorScreen');
    const resultsScreen = document.getElementById('resultsScreen');
    const startBtn = document.getElementById('startBtn');
    const nextBtn = document.getElementById('nextBtn');
    const restartBtn = document.getElementById('restartBtn');
    const fundingInfo = document.getElementById('fundingInfo');
    const fundingTooltip = document.getElementById('fundingTooltip');
    const blackSwanToggle = document.getElementById('blackSwanToggle');
    const blackSwanFrequency = document.getElementById('blackSwanFrequency');
    const difficultySlider = document.getElementById('difficulty');
    const difficultyValue = document.getElementById('difficultyValue');
    const frequencySlider = document.getElementById('frequency');
    const frequencyValue = document.getElementById('frequencyValue');
    const resultsContent = document.getElementById('resultsContent');
    const chatScreen = document.getElementById('chatScreen');
    const backToStartBtn = document.getElementById('backToStartBtn');
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');

    // Event Listeners
    startBtn.addEventListener('click', startSimulation);
    nextBtn.addEventListener('click', showResults);
    restartBtn.addEventListener('click', restartSimulation);
    fundingInfo.addEventListener('click', toggleFundingTooltip);
    document.querySelector('.close-tooltip').addEventListener('click', closeTooltip);
    blackSwanToggle.addEventListener('change', toggleBlackSwanFrequency);
    difficultySlider.addEventListener('input', updateDifficultyValue);
    frequencySlider.addEventListener('input', updateFrequencyValue);
    backToStartBtn.addEventListener('click', function() {
    chatScreen.style.display = 'none';
    welcomeScreen.style.display = 'block';
    // Clear chat messages when going back
    chatMessages.innerHTML = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

    // Update slider values initially
    updateDifficultyValue();
    updateFrequencyValue();

    
    // Functions

    function startSimulation() {
        welcomeScreen.style.display = 'none';
        simulatorScreen.style.display = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showResults() {
        
        // Gather all selected values
        const marketSize = document.querySelector('input[name="marketSize"]:checked').value;
        const fundingStatus = document.querySelector('input[name="fundingStatus"]:checked').value;
        const teamSize = document.querySelector('input[name="teamSize"]:checked').value;
        const pricingStrategy = document.querySelector('input[name="pricing"]:checked').value;
        const difficulty = difficultySlider.value;
        const blackSwanEnabled = blackSwanToggle.checked;
        const blackSwanFreq = blackSwanToggle.checked ? frequencySlider.value : '0%';
        
        // Generate results content
        let html = `
            <h3>Your Business Configuration:</h3>
            <ul>
                <li><strong>Market Size:</strong> ${getLabelText('marketSize', marketSize)}</li>
                <li><strong>Funding Status:</strong> ${getLabelText('fundingStatus', fundingStatus)}</li>
                <li><strong>Team Size:</strong> ${getLabelText('teamSize', teamSize)}</li>
                <li><strong>Pricing Strategy:</strong> ${getLabelText('pricing', pricingStrategy)}</li>
                <li><strong>Industry Difficulty:</strong> ${difficulty}/1.0</li>
                <li><strong>Black Swan Events:</strong> ${blackSwanEnabled ? 'Enabled (' + blackSwanFreq + '%)' : 'Disabled'}</li>
            </ul>
            
            <h3>Simulation Analysis:</h3>
            <p>${generateAnalysis(marketSize, fundingStatus, teamSize, pricingStrategy, difficulty, blackSwanEnabled, blackSwanFreq)}</p>
            
            <h3>Recommendations:</h3>
            <p>${generateRecommendations(marketSize, fundingStatus, teamSize, pricingStrategy)}</p>
        `;
        
        resultsContent.innerHTML = html;

        simulatorScreen.style.display = 'none';
        resultsScreen.style.display = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

     function restartSimulation() {
        resultsScreen.style.display = 'none';
        chatScreen.style.display = 'block';
    // Add welcome message from AI
    addAIMessage("Welcome back! I'm your AI Entrepreneur Advisor. How can I help you with your business strategy today?");
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

    function toggleFundingTooltip() {
        fundingTooltip.style.display = fundingTooltip.style.display === 'block' ? 'none' : 'block';
    }

    function closeTooltip() {
        fundingTooltip.style.display = 'none';
    }

    function toggleBlackSwanFrequency() {
        blackSwanFrequency.style.display = blackSwanToggle.checked ? 'block' : 'none';
    }

    function updateDifficultyValue() {
        difficultyValue.textContent = difficultySlider.value;
    }

    function updateFrequencyValue() {
        frequencyValue.textContent = frequencySlider.value + '%';
    }

    // Helper functions
    function getLabelText(name, value) {
        const label = document.querySelector(`input[name="${name}"][value="${value}"]`).parentElement.textContent;
        return label.trim();
    }

    function generateAnalysis(marketSize, fundingStatus, teamSize, pricingStrategy, difficulty, blackSwanEnabled, blackSwanFreq) {
        let analysis = [];
        
        // Market size analysis
        if (marketSize === 'small') {
            analysis.push("Your target market is relatively small, which may allow for easier customer acquisition but limits growth potential.");
        } else if (marketSize === 'medium') {
            analysis.push("You're targeting a substantial market with good growth potential while still being manageable for a startup.");
        } else {
            analysis.push("A large market offers significant opportunities but comes with intense competition and higher customer acquisition costs.");
        }
        
        // Funding analysis
        if (fundingStatus === 'self') {
            analysis.push("Bootstrapping gives you full control but may limit your growth speed. You'll need to focus on profitability early.");
        } else {
            analysis.push("With secured funding, you have more resources to grow quickly, but you'll have pressure to deliver returns to investors.");
        }
        
        // Team size analysis
        if (teamSize === 'small') {
            analysis.push("A small team is agile and cost-effective but may struggle with workload as the business grows.");
        } else if (teamSize === 'medium') {
            analysis.push("A medium-sized team can handle more complex operations while maintaining good communication.");
        } else {
            analysis.push("A large team allows for specialization but requires strong management and higher overhead costs.");
        }
        
        // Pricing analysis
        if (pricingStrategy === 'cost') {
            analysis.push("Cost-based pricing ensures profitability but may not reflect the true market value of your product.");
        } else if (pricingStrategy === 'market') {
            analysis.push("Market-based pricing helps you stay competitive but requires thorough competitor analysis.");
        } else if (pricingStrategy === 'penetration') {
            analysis.push("Penetration pricing can help you gain market share quickly but may be difficult to raise prices later.");
        } else {
            analysis.push("Premium pricing positions you as a high-quality option but requires strong differentiation and marketing.");
        }
        
        // Difficulty analysis
        if (parseFloat(difficulty) > 0.7) {
            analysis.push("The high industry difficulty means you'll face significant challenges and competition. Differentiation will be key.");
        } else if (parseFloat(difficulty) > 0.4) {
            analysis.push("Moderate industry difficulty suggests a balanced competitive landscape with opportunities for growth.");
        } else {
            analysis.push("The low industry difficulty indicates favorable conditions, but beware of potential new entrants.");
        }
        
        // Black swan analysis
        if (blackSwanEnabled) {
            analysis.push(`With Black Swan events enabled (${blackSwanFreq}% frequency), your business may face unexpected challenges that test your resilience.`);
        }
        
        return analysis.join(' ');
    }

    function generateRecommendations(marketSize, fundingStatus, teamSize, pricingStrategy) {
        let recommendations = [];
        
        // Market size recommendations
        if (marketSize === 'small') {
            recommendations.push("Consider niche marketing strategies to dominate your segment.");
        } else if (marketSize === 'medium') {
            recommendations.push("Focus on scalable customer acquisition channels to capture market share.");
        } else {
            recommendations.push("Develop a strong USP and consider strategic partnerships to stand out in a crowded market.");
        }
        
        // Funding recommendations
        if (fundingStatus === 'self') {
            recommendations.push("Maintain lean operations and focus on generating revenue quickly.");
        } else {
            recommendations.push("Set clear milestones for your funding and track progress rigorously.");
        }
        
        // Team recommendations
        if (teamSize === 'small') {
            recommendations.push("Consider outsourcing non-core functions to keep your team focused.");
        } else if (teamSize === 'medium') {
            recommendations.push("Invest in team development and clear role definitions.");
        } else {
            recommendations.push("Implement strong communication systems and culture-building activities.");
        }
        
        // Pricing recommendations
        if (pricingStrategy === 'cost') {
            recommendations.push("Regularly review your costs and adjust prices accordingly.");
        } else if (pricingStrategy === 'market') {
            recommendations.push("Monitor competitors but don't get drawn into price wars.");
        } else if (pricingStrategy === 'penetration') {
            recommendations.push("Plan your pricing roadmap for when you need to increase prices.");
        } else {
            recommendations.push("Invest in branding and customer experience to justify premium prices.");
        }
        
        return recommendations.join(' ');
    }

function addAIMessage(text) {
    const div = document.createElement('div');
    div.classList.add('chat-message', 'system-message'); // A 页中的气泡样式
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
}

function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', 'user-message'); // A 页中的气泡样式
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addUserMessage(message);
    userInput.value = '';
    
    const thinkingMsg = addAIMessage("AI is thinking...");
    
    try {
        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Respond in English ONLY, do not use any other language: ${message}`
                    }]
                }],
                safetySettings: [ // 增加安全设置
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_ONLY_HIGH"
                    }
                ],
                generationConfig: { // 增加生成配置
                    temperature: 0.5,
                    maxOutputTokens: 200
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        // 更健壮的数据检查
        if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error("Invalid API response structure");
        }
        
        thinkingMsg.textContent = data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("API error details:", error);
        thinkingMsg.textContent = `Service temporarily unavailable (${error.message})`;
    }
}
    
});

const searchInput = document.getElementById('pokemon-search');
const searchBtn = document.getElementById('search-btn');
const pokemonContainer = document.getElementById('pokemon-container');
const metricsContainer = document.getElementById('metrics');
const jsonOutput = document.getElementById('json-output');
const codeOutput = document.getElementById('code-output');

const API_URL = 'https://pokeapi.co/api/v2/pokemon/';


async function fetchPokemonAsync(pokemonName) {
    const startTime = performance.now();
    try {
        const response = await fetch(`${API_URL}${pokemonName}`);
        const endTime = performance.now();
        
        handleMetrics(response, endTime - startTime);

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        showError(error);
    }
}

function fetchPokemonPromise(pokemonName) {
    const startTime = performance.now();
    fetch(`${API_URL}${pokemonName}`)
        .then(response => {
            const endTime = performance.now();
            handleMetrics(response, endTime - startTime);
            
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return response.json();
        })
        .then(data => updateUI(data))
        .catch(error => showError(error));
}


function handleMetrics(response, latency) {
    metricsContainer.classList.remove('hidden');
    document.getElementById('metric-status').textContent = `Status: ${response.status} ${response.statusText}`;
    document.getElementById('metric-time').textContent = `Latencia: ${latency.toFixed(2)} ms`;
    document.getElementById('metric-type').textContent = `Tipo: ${response.headers.get('content-type').split(';')[0]}`;
}


function updateUI(data) {
    
    jsonOutput.textContent = JSON.stringify(data, null, 2);

    
    const spriteAltaRes = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
    const tipos = data.types.map(t => t.type.name).join(', ');
    
    
    const requiredStats = ['hp', 'attack', 'defense', 'speed'];
    const statsHtml = data.stats
        .filter(s => requiredStats.includes(s.stat.name))
        .map(s => `
            <div class="stat-row">
                <div class="stat-name">${s.stat.name}</div>
                <div class="stat-bar-bg">
                    <div class="stat-bar-fill" style="width: ${Math.min(s.base_stat, 100)}%"></div>
                </div>
                <div class="stat-val">${s.base_stat}</div>
            </div>
        `).join('');

    pokemonContainer.innerHTML = `
        <div class="pokemon-card">
            <img src="${spriteAltaRes}" alt="${data.name}">
            <h2>${data.name} (#${data.id})</h2>
            <p><strong>Tipo:</strong> ${tipos} | <strong>Peso:</strong> ${data.weight / 10}kg</p>
            <div class="stats-container">
                ${statsHtml}
            </div>
        </div>
    `;
}

function showError(error) {
    pokemonContainer.innerHTML = `<p class="error-msg">${error.message}</p>`;
    jsonOutput.textContent = `// Error de petición\n${error.message}`;
}


function executeSearch() {
    const value = searchInput.value.trim().toLowerCase();
    if (!value) return;

    pokemonContainer.innerHTML = '<p>Buscando...</p>';
    
    const method = document.querySelector('input[name="fetch-method"]:checked').value;
    
    if (method === 'async') {
        codeOutput.textContent = fetchPokemonAsync.toString();
        fetchPokemonAsync(value);
    } else {
        codeOutput.textContent = fetchPokemonPromise.toString();
        fetchPokemonPromise(value);
    }
}


searchBtn.addEventListener('click', executeSearch);
searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') executeSearch(); });


document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(`tab-${button.dataset.tab}`).classList.add('active');
    });
});
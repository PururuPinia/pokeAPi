const searchInput = document.getElementById('pokemon-search');
const searchBtn = document.getElementById('search-btn');
const pokemonContainer = document.getElementById('pokemon-container');

const API_URL = 'https://pokeapi.co/api/v2/pokemon/';

// Función principal para consultar la API
async function fetchPokemon(pokemonName) {
    try {
        pokemonContainer.innerHTML = '<p>Buscando...</p>';
        
        
        const response = await fetch(`${API_URL}${pokemonName.toLowerCase()}`);
        
        if (!response.ok) {
            throw new Error('No se encontró ningún Pokémon con ese nombre o ID.');
        }
        
        const data = await response.json();
        renderPokemon(data);
    } catch (error) {
        pokemonContainer.innerHTML = `<p class="error-msg">${error.message}</p>`;
    }
}


function renderPokemon(pokemon) {
   
    const tipos = pokemon.types.map(tipo => tipo.type.name).join(', ');
    
    const html = `
        <div class="pokemon-card">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h2>${pokemon.name} (#${pokemon.id})</h2>
            <p><strong>Tipo:</strong> ${tipos}</p>
            <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
            <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
        </div>
    `;
    pokemonContainer.innerHTML = html;
}


searchBtn.addEventListener('click', () => {
    const value = searchInput.value.trim();
    if (value) fetchPokemon(value);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const value = searchInput.value.trim();
        if (value) fetchPokemon(value);
    }
});


document.addEventListener('DOMContentLoaded', () => {
    fetchPokemon('pikachu');
});
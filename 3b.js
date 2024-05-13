const charactersContainer = document.getElementById('characters-container');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');

let nextPage = 'https://swapi.dev/api/people/';

// Funcion para traer datos de los personajes
async function fetchCharacters(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error trayendo los datos:', error);
        return null;
    }
}

// Function para mostrar los personajes
function displayCharacters(characters) {
    characters.results.forEach(character => {
        const characterCard = document.createElement('div');
        characterCard.classList.add('character-card');
        characterCard.style.backgroundColor = getRandomColor();
        characterCard.innerHTML = `
            <h3>${character.name}</h3>
            <img src="${getRandomImage()}" alt="${character.name}">
        `;
        characterCard.addEventListener('click', () => showModal(character));
        charactersContainer.appendChild(characterCard);
    });
}

// Funcion  para mostrar el modal con los detalles
async function showModal(character) {
    const homeworld = await fetchCharacters(character.homeworld);
    const films = await Promise.all(character.films.map(url => fetchCharacters(url)));

    modalContent.innerHTML = `
        <span class="close" onclick="closeModal()">&times;</span>
        <h2>${character.name}</h2>
        <p>Altura: ${character.height} cm</p>
        <p>Masa: ${character.mass} kg</p>
        <p>Agregado a la API: ${new Date(character.created).toLocaleDateString('en-GB')}</p>
        <p>Peliculas: ${films.length}</p>
        <p>Anio de nacimiento: ${character.birth_year}</p>
        <h3>Hogar</h3>
        <p>Nokmbre: ${homeworld.name}</p>
        <p>Terreno: ${homeworld.terrain}</p>
        <p>Clima: ${homeworld.climate}</p>
        <p>Poblacion: ${homeworld.population}</p>
    `;
    
    modal.style.display = 'block';
}

// Funcion para cerrar el modal
function closeModal() {
    modal.style.display = 'none';
}

// Funcion para el color random
function getRandomColor() {
    const colors = ['#ff9999', '#99ff99', '#9999ff', '#ffff99', '#ff99ff', '#99ffff'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Fucnion para trer la imagen de Picsum
function getRandomImage() {
    const width = 200;
    const height = 200;
    const randomId = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/${width}/${height}?random=${randomId}`;
}

// Function para cargar mas personajes cuando se desplaza
window.addEventListener('scroll', async () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        const data = await fetchCharacters(nextPage);
        if (data) {
            nextPage = data.next;
            displayCharacters(data);
        }
    }
});

// Carga inicial
(async () => {
    const initialData = await fetchCharacters(nextPage);
    if (initialData) {
        nextPage = initialData.next;
        displayCharacters(initialData);
    }
})();
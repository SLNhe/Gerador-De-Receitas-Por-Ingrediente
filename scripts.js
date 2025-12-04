/*

LOGICA 

[x] Pegar a informação do Input, quando o botão for clicado
[x] Ir até a API, e trazer as receitas
[x] Colocar as receitas na tela
[x] Saber quando o usuario clicou na receita
[x] Buscar informações da receita individual na API
[x] Colocar a receita individual na tela

*/

//  TABELA DE TRADUÇÃO PT → EN 
const traducaoIngredientes = {
    "tomate": "tomato",
    "banana": "banana",
    "frango": "chicken",
    "carne": "beef",
    "porco": "pork",
    "ovo": "egg",
    "queijo": "cheese",
    "batata": "potato",
    "arroz": "rice",
    "massa": "pasta",
    "macarrão": "pasta",
    "limão": "lemon",
    "cenoura": "carrot",
    "peixe": "fish",
    "sal": "salt",
    "açucar": "sugar",
    "leite": "milk",
    "creme de leite": "cream",
    "manteiga": "butter",
    "alho": "garlic",
    "cebola": "onion"
};


// 01 - Pegar a informação do Input, quando o botão for clicado

const Input = document.querySelector('.search-input');
const form = document.querySelector('.search-form');
const receitaDetalhes = document.querySelector('.receita-detalhes')

form.addEventListener('submit', function (evento) {
    evento.preventDefault() //para nao recarregar a pagina
    const inputValue = evento.target[0].value;


    // Tradução automatica
    const ingredienteAPI = traducaoIngredientes[inputValue] || inputValue;

    BuscarReceitas(ingredienteAPI);
})




// 02 - Ir até a API, e trazer as receitas (www.themealdb.com/api/json/v1/1/filter.php?i=banana)

/*
Toda vez que for acessar uma API
- colocar "async" na frente da função
- colocar "await" na frente do link da api
*/

async function BuscarReceitas(ingrediente) {
    
    try{

    // mostrar lista de receitas e esconder detalhes
    receitaLista.style.display = "grid"; 
    receitaDetalhes.style.display = "none";
    receitaDetalhes.innerHTML = ""; // limpa os detalhes anteriores


    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediente}`); //acessando a API
    const data = await response.json(); // convertendo em JSON


    mostrarReceitas(data.meals); //meals localizei pelo console.log
  }catch(err){
    receitaLista.innerHTML = `<p>Nenhuma receita encontrada</p>`
  }
}



// 03 - Colocar as receitas na tela

const receitaLista = document.querySelector('.receita-lista');

function mostrarReceitas(receitas) {
    receitaLista.innerHTML = receitas.map(item => `
        <div class="recibe-card" onclick="pegarDetalhesReceita(${item.idMeal})">
        <img src="${item.strMealThumb}">
        <h3>${item.strMeal}</h3>
    </div>
    `

    ).join('');
}


// 04 - Saber quando o usuario clicou na receita
// 05 - Saber quando o usuario clicou na receita

async function pegarDetalhesReceita(id) {
    const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
    )//acessando a API

    const data = await response.json(); // convertendo em JSON
    const receita = data.meals[0];

    let ingredientes = ''

    for (let i = 1; i <= 20; i++) {
        if (receita[`strIngredient${i}`]) {
            ingredientes += `<li>${receita[`strIngredient${i}`]} - ${receita[`strMeasure${i}`]}</li>`
        } else {
            break;
        }
    }

    // esconder a lista e mostrar os detalhes
    receitaLista.style.display = "none";
    receitaDetalhes.style.display = "block";


    //exibir na tela os detalhes da receita
    receitaDetalhes.innerHTML = `

    <h2>${receita.strMeal}</h2>
    <img src="${receita.strMealThumb}" alt=${receita.strMeal}>
    <h3>Categoria: ${receita.strCategory}</h3>
    <h3>Origem: ${receita.strArea}</h3>
    <h3>Ingredientes:</h3>
    <ul>${ingredientes}</ul>
    <h3>Instruções:</h3>
    <p>${receita.strInstructions}</p>
    <p>Video: <a href="${receita.strYoutube}" target="_blank">Assista no Youtube</a></p>
    `
}
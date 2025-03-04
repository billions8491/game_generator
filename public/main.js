import { getDailyDeal, getRandomGame, formatPrice } from './helpers.js';

const urlToFetch = window.location.hostname === 'localhost' ? 'http://localhost:3000/steam-deals' : 'https://game-generator.onrender.com/steam-deals';


const nameOfGame = document.createElement('h2')
const h2 = document.createElement('h2')
const btn = document.getElementById('generate-btn');
const imgContainer = document.getElementById("img-container");
const gameInfo = document.getElementById('game-info');
const link = document.createElement('a');
link.target = '_blank'
const img = document.createElement("img");
const original_price = document.createElement('h3');
const discount = document.createElement('h3');
const final_price = document.createElement('h3');


console.log(urlToFetch)

async function getDeals() {
    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log(error.message);
    }
}

getDeals()
.then(response => {
    const dailyDeal = getDailyDeal(response);
    return dailyDeal[0];
})
.then(response => {
    
    h2.innerHTML = 'Today\'s Daily Deal...';
    h2.id = 'dailyDealH2'
    discount.id = 'dailyDealDiscount';
    original_price.id = 'original';
    final_price.id = 'final'

    original_price.innerHTML = `$${formatPrice(response.original_price)}`;
    discount.innerHTML = `${response.discount_percent}% OFF!`
    final_price.innerHTML = `Now $${formatPrice(response.final_price)}`

    gameInfo.append(h2, original_price, discount, final_price)

    const href = `https://store.steampowered.com/app/${response.id}`;
    link.href = `${href}`
    const imgSrc = response.header_image;
    img.src = imgSrc
    img.style.height = '350px'
    imgContainer.appendChild(link);
    link.appendChild(img)
})

btn.addEventListener('click', () => {

    btn.style.color = 'white';
    btn.style.boxShadow = '0px 0px 30px 15px white';
    btn.style.scale = '.97';
    setTimeout(() => {
        btn.style.scale = '1'
    }, 105);


    getDeals().then(response => {
        


    
        let gamesArray = []
    
        Object.keys(response)
        .forEach(key => {
            if(response[key].items && response[key].items.length > 1){
                response[key].items.forEach(game => {
                    game.category = key
                })
            gamesArray.push(...response[key].items);
            }
        })

        const seenIds = new Set();
        
        gamesArray = gamesArray.filter(game => {
            if(seenIds.has(game.id)){
                return false
            }
            seenIds.add(game.id)
            return true
        })

        const randomGame = getRandomGame(gamesArray);
        console.log(gamesArray)
        return randomGame;
    })
    .then(randomGame => { 
        gameInfo.innerHTML = '';
        

        randomGame.original_price = formatPrice(randomGame.original_price);
        randomGame.final_price = formatPrice(randomGame.final_price)

        //   Sets the price of free games to "FREE" instead of "$0"

        if(randomGame.final_price === 0){
            final_price.innerHTML = 'Currently FREE!'
        } else {
            final_price.innerHTML = `Current price: ${randomGame.final_price}`
        }
        


        if(randomGame.category === 'specials'){
            h2.innerHTML = 'Special Offer!';
            original_price.innerHTML = `$${randomGame.original_price}`;
            discount.innerHTML = `${randomGame.discount_percent}% OFF!`
            final_price.innerHTML = `Now $${randomGame.final_price}`
            gameInfo.append(h2, original_price, discount, final_price)
        } 
        else if(randomGame.category === "coming_soon"){
            h2.innerHTML = 'Coming soon...';
            gameInfo.append(h2)
        } 
        else if(randomGame.category === 'top_sellers' && !randomGame.discounted){
            h2.innerHTML = 'One of Steam\'s top selling titles!';
            gameInfo.append(h2, final_price)
        } 
        else if(randomGame.category === "top_sellers" && randomGame.discounted){
            h2.innerHTML = "A SPECIAL DEAL for one of Steam\'s top selling titles!";
            original_price.innerHTML = `$${randomGame.original_price}`;
            discount.innerHTML = `${randomGame.discount_percent}% OFF!`
            final_price.innerHTML = `Now $${randomGame.final_price}`
            gameInfo.append(h2, original_price, discount, final_price)
        } 
        else if(randomGame.category === 'new_releases' && randomGame.discounted){
            h2.innerHTML = "Just released!";
            original_price.innerHTML = `$${randomGame.original_price}`;
            discount.innerHTML = `${randomGame.discount_percent}% OFF!`
            final_price.innerHTML = `Now $${randomGame.final_price}`
            gameInfo.append(h2, original_price, discount, final_price)
        } 
        else if(randomGame.category === 'new_releases' && !randomGame.discounted){
            h2.innerHTML = "Just released!";
            gameInfo.append(h2, final_price)
        }

        
        const href = `https://store.steampowered.com/app/${randomGame.id}`
        link.href = `${href}`
        const imgSrc = randomGame.large_capsule_image;
        img.src = imgSrc
        imgContainer.innerHTML = '';
        imgContainer.appendChild(link);
        link.appendChild(img)
    })
})

btn.addEventListener("mouseover", () => {
    btn.style.boxShadow = '0px 0px 20px 10px cyan';
    btn.style.color = 'rgba(0, 255, 255, 0.7)';
    btn.style.cursor = 'pointer';
})

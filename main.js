function debounce (fn, debounceTime) {
    let timerId;
    return function() {
        clearTimeout(timerId);
        timerId = setTimeout(() => fn.apply(this, arguments), debounceTime);
    }
};

function newSearchItems (repArray) {
    let listFragment = document.createDocumentFragment();

    repArray.forEach(rep => {
        if(typeof rep !== 'undefined') {
           let listItem = document.createElement('button');
            listItem.classList.add('list-group-item');
            listItem.classList.add('list-group-item-action');
            listItem.textContent = rep.name;

            listItem.addEventListener('click', function() {
                newCard(rep);
                searchList.replaceChildren();
                searchLine.value = '';
            });

            listFragment.append(listItem); 
        }
    });

    return listFragment;
}

function newCard (rep) {
    let card = document.querySelector('.card-template').content.cloneNode(true);
    
    card.querySelector('h5').textContent = rep.name;
    card.querySelector('p').textContent = 'Владелец: ' + rep.owner.login;
    card.querySelector('small').textContent = rep.score + "★";

    card.querySelector('a').addEventListener('click', function (event) {
        event.preventDefault();
        window.location = rep.html_url;
    })

    card.querySelector('button').addEventListener('click', function (event) {
        event.target.parentNode.parentNode.remove()
        event.stopPropagation();
    });

    document.querySelector('.card-container').appendChild(card);
}

async function searchRep (element) {
    return await fetch(`https://api.github.com/search/repositories?q=${element.value}`)
    .then(response => {
        if(response.ok) {
            response.json()
            .then(response => {
                const repositories = response.items.slice(0, 5);
                searchList.replaceChildren(newSearchItems(repositories));
            })
        } else {

        }
    })
};

let searchLine = document.querySelector('input[type=search]');
let searchList = document.querySelector('.search-list');

searchLine.addEventListener('input', debounce(function() {
    if(/[A-Za-z0-9]/.test(searchLine.value)) {
        searchRep(searchLine);
    } else {
        searchList.replaceChildren();
    }
}, 400))
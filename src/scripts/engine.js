const state = {
    view: {
        score: document.querySelector('#score'),
        attempts: document.querySelector('#attempts'),
        startButton: document.querySelector('.start'),
        resetButton: document.querySelector('.reset'),
        message: document.querySelector('#message')
    },
    values: {
        result: 0,
        attemptsCounter: 3,
        startCounter: 6,
        openCards: [],
        emojis: [
            '😊', '😊', '🤣', '🤣', '😎', '😎', '🙃', '🙃', '😱', '😱', '🥳', '🥳', '🥸', '🥸', '🤪', '🤪'
        ]
    },
    actions: {
        startCounterId: null
    }
}

function createCards () {
    let shuffleEmojis = state.values.emojis.sort(() => Math.random() > 0.5 ? 2 : -1)
    state.values.emojis.forEach((_, index) => {
        let card = document.createElement('div')
        card.className = 'card'
        card.innerHTML = shuffleEmojis[index]
        document.querySelector('.cards-container').appendChild(card)
    })
}

function countDownToPlay () {
    state.values.startCounter--
    state.view.message.textContent = state.values.startCounter
    let cards = document.querySelectorAll('.card')
    cards.forEach(card => card.classList.add('cardOpened'))

    if(!state.values.startCounter) {

        clearInterval(state.actions.startCounterId)
        state.view.message.textContent = 'GO!'

        cards.forEach(card => {
            card.addEventListener('click', handleClick)
            card.classList.remove('cardOpened')
        })

        state.view.resetButton.addEventListener('click', () => window.location.reload())
        
        state.view.resetButton.removeAttribute('disabled')
    }
}

function startGame () {
    state.view.startButton.setAttribute('disabled','')
    state.view.startButton.classList.add('hide')
    state.view.resetButton.classList.remove('hide')
    state.view.message.textContent = 'GET READY'
    state.actions.startCounterId = setInterval(countDownToPlay, 1000)
}

function handleClick () {
    if(state.values.openCards.length < 2 && !this.classList.contains('cardOpened')) {
        this.classList.add('cardOpened')
        state.values.openCards.push(this)
    }

    if(state.values.openCards.length === 2) {
        setTimeout(checkMatch, 800)
    }
}

function checkMatch () { 
    if(state.values.openCards[0].innerHTML === state.values.openCards[1].innerHTML) {
        state.values.openCards[0].classList.add('cardMatches')
        state.values.openCards[1].classList.add('cardMatches')
        state.values.result++
        state.view.score.textContent = state.values.result
        
    } else {
        state.values.openCards[0].classList.remove('cardOpened')
        state.values.openCards[1].classList.remove('cardOpened')
        
        state.values.attemptsCounter--
        state.view.attempts.textContent = `x${state.values.attemptsCounter}`
        if(!state.values.attemptsCounter) {
            state.view.message.textContent = 'GAME OVER'
            
            let cards = document.querySelectorAll('.card')
            cards.forEach(card => card.removeEventListener('click', handleClick))
        }
    }
    
    state.values.openCards = []

    if(document.querySelectorAll('.cardMatches').length === state.values.emojis.length) {
        state.view.message.textContent = 'Você venceu!'
    }

}

function init () {
    createCards()
    state.view.startButton.addEventListener('click', startGame)
}

init()

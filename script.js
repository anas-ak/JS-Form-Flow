console.clear();

const elApp = document.querySelector("#app");
const elNextButtons = Array.from(document.querySelectorAll("button:not(#submit)"));
const elSubmitButton = document.querySelector("#submit");
const elAnimationHelp = document.querySelector("#animation-help");
const elStep3Button = document.querySelector("#step-3-button");

const flipping = new Flipping();

const { Machine } = xstate;

const insuranceMachine = Machine({
    initial: elApp.dataset.state || 'step-1',
    states: {
        'step-1' : {
            on: {
                NEXT: 'step-2'
            }
        },
        'step-2' : {
            on: {
                NEXT: 'step-3'
            }
        },
        'step-3' : {
            on: {
                NEXT: 'step-4'
            }
        }, 
        'step-4' : {
            on: {
                NEXT: 'step-5'
            }
        },
        'step-5' : {
            on: {
                NEXT: 'step-1'
            }
        },
        finished: {}
    }
});

let currentState = insuranceMachine.initialState;

function setStateAttributes(state) {

    // change data-state attribute
    elApp.dataset.state = state;

    // remove any active data-attribues
    document.querySelectorAll('[data-active]').forEach(el => {
        delete el.dataset.active;
    });

    // add active data-attributes to proper elements
    document.querySelectorAll(`
        [data-show~="${state}"],
        [data-hide]:not([data-hide~="${state}"])`)
        .forEach(el => {
            el.dataset.active = true;
        });
}

function send(event) {
    currentState = insuranceMachine
        .transition(currentState, event);

    setStateAttributes(currentState.value);
}

setStateAttributes(currentState.value);

elNextButtons.forEach(elButton => elButton.addEventListener('click', () => {
    send('NEXT');
}));

elSubmitButton.addEventListener('click', () => {
    send('SUBMIT');
});

elAnimationHelp.addEventListener('change', flipping.wrap((e) => {
    if(e.target.checked) {
        elStep3Button.dataset.clickable = true;
    } else {
        delete elStep3Button.dataset.clickable;
    }
}));
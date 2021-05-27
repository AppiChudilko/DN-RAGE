// Handle events from client
function trigger(eventName, args) { // eslint-disable-line
    try {var handlers = window.EventManager.events[eventName];
        handlers.forEach(handler => handler(JSON.parse(args)));
    } catch (e) {
    }
}

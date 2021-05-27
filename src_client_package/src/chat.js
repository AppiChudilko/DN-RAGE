import ui from './modules/ui';
import user from "./user";
import methods from "./modules/methods";

let chat = {};

chat.clRed = '#f44336';
chat.clBlue = '#03A9F4';
chat.clOrange = '#FFC107';
chat.clWhite = '#FFFFFF';
chat.clBlack = '#000000';

let chatHistory = [];

/*mp.gui.chat = {
    push: (message) => {
        ui.callCef('chat', JSON.stringify({ type: 'push', message: message }));
    },
    activate: (enable) => {
        ui.callCef('chat', JSON.stringify({ type: 'activate', enable: enable }));
    },
    show: (toggle) => {
        ui.callCef('chat', JSON.stringify({ type: 'show', toggle: toggle }));
    },
    clear: () => {
        ui.callCef('chat', JSON.stringify({ type: 'clear' }));
    }
};*/

mp.events.add('client:chat:sendMessage', function(message) {
    chat.sendLocal(message);
});

mp.events.add('client:chatTyping', function(state) {
    user.setVariable('isTyping', state)
});

chat.sendLocal = function(message) {
    message = methods.replaceAll(methods.replaceAll(message, '\'', '`'), '"', '`');
    chatHistory.push(message);
    ui.callCef('chat', JSON.stringify({ type: 'push', message: message }));
};

chat.activate = function(enable) {
    ui.callCef('chat', JSON.stringify({ type: 'activate', enable: enable }));
};

chat.show = function(toggle) {
    ui.callCef('chat', JSON.stringify({ type: 'show', toggle: toggle }));
};

chat.clear = function() {
    chatHistory = [];
    ui.callCef('chat', JSON.stringify({ type: 'clear' }));
};

chat.updateHistory = function() {
    ui.callCef('chat', JSON.stringify({ type: 'clear' }));
    let chatList = chatHistory.reverse();
    if (chatHistory.length > 50)
        chatList.splice(50, chatHistory.length);
    chatList.reverse().forEach(msg => {
        ui.callCef('chat', JSON.stringify({ type: 'push', message: msg }));
    });
};

chat.updateSettings = function() {

    chat.updateHistory();

    let array = [1000, 3000, 5000, 10000, 15000, 20000, 30000, 99999000];

    ui.callCef('chat', JSON.stringify({
        type: 'updateSettings',
        fontFamily: user.getCache('s_chat_font'),
        fontSize: methods.parseInt(user.getCache('s_chat_font_s')),
        lineHeight: methods.parseInt(user.getCache('s_chat_font_l')),
        fontWeight: 400,
        fontOutline: true,
        bgState: user.getCache('s_chat_bg_s'),
        bgOpacity: user.getCache('s_chat_bg_o'),
        opacity: user.getCache('s_chat_opacity'),
        width: user.getCache('s_chat_width'),
        height: user.getCache('s_chat_height'),
        timeoutHidden: array[user.getCache('s_chat_timeout')],
    }));
};

chat.sendBCommand = function(text) {
    mp.events.callRemote('server:chat:sendBCommand', text);
};

chat.sendTryCommand = function(text) {
    mp.events.callRemote('server:chat:sendTryCommand', text);
};

chat.sendDoCommand = function(text) {
    mp.events.callRemote('server:chat:sendDoCommand', text);
};

chat.sendMeCommand = function(text) {
    mp.events.callRemote('server:chat:sendMeCommand', text);
};

chat.sendDiceCommand = function() {
    mp.events.callRemote('server:chat:sendDiceCommand');
};

chat.send = function(text) {
    mp.events.callRemote('server:chat:send', text);
};

chat.sendToAll = function(sender, text, color = '2196F3') {
    mp.events.callRemote('server:chat:sendToAll', sender, text, color);
};

chat.sendToDep = function(sender, text, color = undefined) {
    mp.events.callRemote('server:chat:sendToDep', sender, text, color);
};

chat.sendToFraction = function(sender, text, color = undefined) {
    mp.events.callRemote('server:chat:sendToFraction', sender, text, color);
};

chat.sendToFamily = function(sender, text, color = undefined) {
    mp.events.callRemote('server:chat:sendToFamily', sender, text, color);
};

export default chat;
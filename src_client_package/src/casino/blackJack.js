import Container from '../modules/data';
import methods from '../modules/methods';
import user from '../user';
import blackJackCfg from "./blackJackCfg";

let blackJack = {};

let seatSideAngle = 30;
let bet = 0;
let hand = {};
let splitHand = {};
let timeLeft = 0;
let satDownCallback = null;
let standUpCallback = null;
let leaveCheckCallback = null;
let canSitDownCallback = null;

blackJack.SetSatDownCallback = function(cb) {
    satDownCallback = cb;
};

blackJack.StandUpCallback = function(cb) {
    standUpCallback = cb;
};

blackJack.LeaveCheckCallback = function(cb) {
    leaveCheckCallback = cb;
};

blackJack.CanSitDownCallback = function(cb) {
    canSitDownCallback = cb;
};

blackJack.mathDeg = function(radians) {
    return radians * (180 / Math.PI);
};

blackJack.findRotation = function(x1, y1, x2, y2) {
    let t = -blackJack.mathDeg(Math.atan2(x2 - x1,y2 - y1));
    return t < -180 && t + 180 || t
};

blackJack.cardValue = function(card) {
    let rank = 10;
    for (let i = 2; i <= 11; i++) {
        if (card.search(i))
            rank = i;
    }
    if (card.search('ACE'))
        rank = 11;
    return rank;
};

blackJack.handValue = function(hand) {
    let tmpValue = 0;
    let numAces = 0;

    hand.forEach(item => {
        tmpValue = tmpValue + blackJack.cardValue(item);

        if (item.search('ACE'))
            numAces = numAces + 1;
    });

    do {
        if (tmpValue > 21 && numAces > 0) {
            tmpValue = tmpValue - 10;
            numAces = numAces - 1;
        }
        else break;
    } while (numAces === 0);

    return tmpValue;
};

blackJack.CanSplitHand = function(hand) {
    if (hand[1] && hand[2]) {
        if (hand[1].substring(-3) === hand[2].substring(-3) && hand.length === 2) {
            if (blackJack.cardValue(hand[1]) === blackJack.cardValue(hand[2]))
                return true;
        }
    }
    return false;
};

/*
vw_prop_vw_chips_pile_01a.ydr -- $511,000
vw_prop_vw_chips_pile_02a.ydr -- $3,250,000
vw_prop_vw_chips_pile_03a.ydr -- $1,990,000
* */
blackJack.getChips = function(amount) {
    if (amount < 500000) {
        let props = [];
        let propTypes = [];

        let d = blackJackCfg.chipValues.length;

        for (let i = 1; i <= d; i++) {
            let iter = props.length + 1
        }

        while (amount >= blackJackCfg.chipValues[d]) {

        }
    }
};

export default blackJack;
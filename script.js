
const notes = {
    "C4": 261.63,
    "C#4": 277.18,
    "Db4": 277.18,
    "D4": 293.66,
    "D#4": 311.13,
    "Eb4": 311.13,
    "E4": 329.63,
    "F4": 349.23,
    "F#4": 369.99,
    "Gb4": 369.99,
    "G4": 392.00,
    "G#4": 415.30,
    "Ab4": 415.30,
    "A4": 440.00,
    "A#4": 466.16,
    "Bb4": 466.16,
    "B4": 493.88,

    "C5": 523.25,
    "C#5": 554.37,
    "Db5": 554.37,
    "D5": 587.33,
    "D#5": 622.25,
    "Eb5": 622.25,
    "E5": 659.25,
    "F5": 698.46,
    "F#5": 739.99,
    "Gb5": 739.99,
    "G5": 783.99,
    "G#5": 830.61,
    "Ab5": 830.61,
    "A5": 880.00,
    "A#5": 932.33,
    "Bb5": 932.33,
    "B5": 987.77,

    "C6": 1046.50
};
const numNotes = {
    0: notes["C4"],
    1: notes["C#4"],
    2: notes["D4"],
    3: notes["D#4"],
    4: notes["E4"],
    5: notes["F4"],
    6: notes["F#4"],
    7: notes["G4"],
    8: notes["G#4"],
    9: notes["A4"],
    10: notes["A#4"],
    11: notes["B4"],
    12: notes["C5"],
    13: notes["C#5"],
    14: notes["D5"],
    15: notes["D#5"],
    16: notes["E5"],
    17: notes["F5"],
    18: notes["F#5"],
    19: notes["G5"],
    20: notes["G#5"],
    21: notes["A5"],
    22: notes["A#5"],
    23: notes["B5"],
    24: notes["C6"]
};


//WWHWWWH 8 notes
let major = [0, 2, 4, 5, 7, 9, 11, 12]

let audioCtx;

function randomNum(min, max){
    return Math.random() * (max-min)+min;
}
function randomInt(min, max){
    return Math.floor(randomNum(min,max))
}

function playMelody() {
    
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }

    
    let startTime = audioCtx.currentTime;

    for (let i = 0; i<10; i++){
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "square";
        let noteFreq = numNotes[major[randomInt(0,8)]]
        osc.frequency.value = noteFreq;

        gain.gain.setValueAtTime(0.2, startTime + i * 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + i * 0.4 + 0.35);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(startTime + i * 0.4);
        osc.stop(startTime + i * 0.4 + 0.4);

    }

}

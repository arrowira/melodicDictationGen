
const noteMap = {
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
    0: noteMap["C4"],
    1: noteMap["C#4"],
    2: noteMap["D4"],
    3: noteMap["D#4"],
    4: noteMap["E4"],
    5: noteMap["F4"],
    6: noteMap["F#4"],
    7: noteMap["G4"],
    8: noteMap["G#4"],
    9: noteMap["A4"],
    10: noteMap["A#4"],
    11: noteMap["B4"],
    12: noteMap["C5"],
    13: noteMap["C#5"],
    14: noteMap["D5"],
    15: noteMap["D#5"],
    16: noteMap["E5"],
    17: noteMap["F5"],
    18: noteMap["F#5"],
    19: noteMap["G5"],
    20: noteMap["G#5"],
    21: noteMap["A5"],
    22: noteMap["A#5"],
    23: noteMap["B5"],
    24: noteMap["C6"]
};




//WWHWWWH 8 noteMap
let major = [0, 2, 4, 5, 7, 9, 11, 12]

let beats = 32

let quarterNoteLength = 0.4

let audioCtx;

let tempoWeight = 3;

function randomNumWeighted(min, max, weight = 1) {
    // weight > 1 → favors lower numbers
    // weight < 1 → favors higher numbers
    let t = Math.random();      // uniform [0,1)
    t = Math.pow(t, weight);    // skew it
    return t * (max - min) + min;
}


function randomInt(min, max, weight = 1) {
    return Math.floor(randomNumWeighted(min, max, weight));
}//from min (inclusive) to max (exclusive) AKA: [min,max)

function playMelody() {
    
    quarterNoteLength = Number(document.getElementById("QNlength").value);
    beats = Number(document.getElementById("length").value);
    tempoWeight = Number(document.getElementById("tempo").value);

    

    if (!audioCtx) {
        audioCtx = new AudioContext();
    }

    
    let startTime = audioCtx.currentTime;

    let notes = [];
    let unusedBeats = beats
    notes.push([numNotes[0],1]);
    while (unusedBeats > 4){
        let setNoteFreq = numNotes[major[randomInt(0,8)]];
        let noteLength = randomInt(1,5, tempoWeight);
        unusedBeats-=noteLength;
        notes.push([setNoteFreq,noteLength]);
    }

    notes.push([numNotes[0],unusedBeats]);

    let progress = 0;

    for (let i = 0; i<4; i++){
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "square";
        
        osc.frequency.value = 800;

        gain.gain.setValueAtTime(0.2, startTime + progress);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + progress + 0.1);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(startTime + progress);
        osc.stop(startTime + progress + quarterNoteLength*(notes[i][1]));

        progress += quarterNoteLength*2;

    }
    //play melody
    for (let i = 0; i<notes.length; i++){
        let noteFreq = notes[i][0];
        

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "sawtooth";
        
        osc.frequency.value = noteFreq;

        gain.gain.setValueAtTime(0.2, startTime + progress);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + progress + 2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(startTime + progress);
        osc.stop(startTime + progress + quarterNoteLength*(notes[i][1]));

        progress += quarterNoteLength*(notes[i][1]);
    }
    

}

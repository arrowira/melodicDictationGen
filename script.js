
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

const freqToNum = {
    261.63: [0],          // C4
    277.18: [1],          // C#4 / Db4
    293.66: [1],          // D4
    311.13: [3],          // D#4 / Eb4
    329.63: [2],          // E4
    349.23: [3],          // F4
    369.99: [3],          // F#4 / Gb4
    392.00: [4],          // G4
    415.30: [4],          // G#4 / Ab4
    440.00: [5],          // A4
    466.16: [6],         // A#4 / Bb4
    493.88: [6],         // B4

    523.25: [7],         // C5
    554.37: [13],         // C#5 / Db5
    587.33: [8],         // D5
    622.25: [9],         // D#5 / Eb5
    659.25: [9],         // E5
    698.46: [10],         // F5
    739.99: [18],         // F#5 / Gb5
    783.99: [19],         // G5
    830.61: [20],         // G#5 / Ab5
    880.00: [21],         // A5
    932.33: [22],         // A#5 / Bb5
    987.77: [23],         // B5

    1046.50: [24]         // C6
};



const numToFreq = {
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




function showMelody(){
    const out = document.getElementById("out");
    out.style.display = "block";
}

function repMelody(){
    playMelody();
}

//WWHWWWH 8 noteMap
let major = [0, 2, 4, 5, 7, 9, 10, 12, 14, 16, 17]

let beats = 32

let quarterNoteLength = 0.4

let audioCtx;

let tempoWeight = 3;

let notes = [];


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


function generateMelody() {
    console.log("generating melody");
    //init and get params.
    const out = document.getElementById("out");
    out.style.display = "none";
    out.innerHTML = "";

    let measure = 0;

    quarterNoteLength = 1/(Number(document.getElementById("bpm").value)/30.0);
    beats = Number(document.getElementById("length").value)*2-1;
    tempoWeight = Number(document.getElementById("tempo").value);

    notes = [];
    //generate notes by bar

    bars = Math.ceil(beats/8);


    for (let b = 0; b<bars; b++){
        let measureNotes = [];
        
        let lastNote = -1;

        let randomFirstNoteLength = randomInt(1,3);
        let unusedBeats = 8-randomFirstNoteLength;
        //create first note
        if (measure == 0){
            measureNotes.push([numToFreq[major[3]],randomFirstNoteLength]);
            firstNoteLength = 2;
            lastNote = 0
        }else{
            let randomNote = major[randomInt(0,11)];
            measureNotes.push([numToFreq[randomNote],randomFirstNoteLength]);
            lastNote = randomNote;
        }
        
        while (unusedBeats > 2){
            let setNoteFreq;

            console.log("last note: " + lastNote);
            //make 7 go to 1
            if (lastNote == 16){
                setNoteFreq = numToFreq[17];
            }else if (lastNote == 4){
                setNoteFreq = numToFreq[5];
            }else{
                setNoteFreq = numToFreq[major[randomInt(0,11)]];
            }
           
            let noteLength = 1;
            if (unusedBeats > 5){
                noteLength = randomInt(1,5, tempoWeight);
            }else{
                if (unusedBeats > 4){
                    noteLength = randomInt(1,3,tempoWeight);
                }
                else{
                    noteLength = 1;
                }
                
            }
            
            unusedBeats-=noteLength;
            measureNotes.push([setNoteFreq,noteLength]);

            lastNote = major[freqToNum[setNoteFreq][0]];
        }

        //add last note
        if (measure == bars-1){
            measureNotes.push([numToFreq[major[3]],2]);
        }else{
            measureNotes.push([numToFreq[major[randomInt(0,11)]],2]);
        }
        

        
        for (let i = 0; i<measureNotes.length; i++){
            if (measureNotes[i] == null){
                alert("Error in note generation");
                alert(measureNotes[i])
            }
            notes.push(measureNotes[i]);
        }
        measure++;
    }
   

    //create sheet music
    signatureLength = 3;


    let length = beats;
    let drawingProgress = 0;
    let index = 0;

    

    //create staff
    var barStaff = true;
    const bar = document.createElement("table");
    bar.id = "staff";
    for (let row = 0; row < 14; row++) {
        if (row==10){
            barStaff = false;
        }
        const tr = document.createElement("tr");
        tr.id = "staffRow";
        for (let col = 0; col < length+signatureLength; col++) {
            const td = document.createElement("td");
            td.id = "staffCell";
            //create line
            if (row % 2 == 0 && barStaff) {
                line = document.createElement("div");
                line.id = "line";
                td.appendChild(line);
            }
            tr.appendChild(td);
        }
        bar.appendChild(tr);
    }
    out.appendChild(bar);

    //place clef and signature
    const startingBar = document.createElement("span");
    startingBar.innerText = "𝄀";
    startingBar.id = "barLine";
    startingBar.style.marginLeft = "-3px";
    bar.rows[7].cells[0].appendChild(startingBar);

    const clef = document.createElement("span");
    clef.innerText = "𝄞";
    
    clef.id = "note";
    clef.style.marginLeft = "-20px";
    bar.rows[6].cells[1].appendChild(clef);

    const timeSigTop = document.createElement("span");
    timeSigTop.id = "timeSig";
    timeSigTop.style.marginLeft = "-10px";
    timeSigTop.innerText = "4";
    bar.rows[0].cells[2].appendChild(timeSigTop);
    const timeSigBottom = document.createElement("span");
    timeSigBottom.id = "timeSig";
    timeSigBottom.style.marginLeft = "-10px";
    timeSigBottom.innerText = "4";
    bar.rows[4].cells[2].appendChild(timeSigBottom);

    //place notes
    for (let col = 0; col <length; col++){
        let placed = false;
        for(let row = 0; row < 14; row++){
            //place note
            if (col == drawingProgress &&row == 6-(freqToNum[notes[index][0]]-5) && !placed) {
                const note = document.createElement("span");
                if (notes[index][1] == 4){
                    note.innerText = "𝅗𝅥";
                }else if (notes[index][1] == 3){
                    note.innerText = "𝅘𝅥."
                }else if (notes[index][1] == 2){
                    note.innerText = "𝅘𝅥";
                }else{
                    note.innerText = "𝅘𝅥𝅮";
                }
                if (true){
                    for (let i = 0; i<2; i+=1){
                        line = document.createElement("div");
                        line.style.width = "1.5em";
                        line.id = "line";
                        bar.rows[row-(2*i)].cells[col+signatureLength].appendChild(line);
                    }
                }
                    
                

                note.id = "note";
                drawingProgress+= notes[index][1];
                bar.rows[row].cells[col+signatureLength].appendChild(note);
                index++;
                placed = true;
            }
            if ((col+1) % 8 == 0&& row == 7){
                //create bar line
                const line = document.createElement("span");
                line.id = "barLine";
                line.innerText = "𝄀";
                bar.rows[row].cells[col+signatureLength].appendChild(line);
            }
        }
    }

    playMelody();

}
function playMelody(){
    let progress = 0;

    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    
    let startTime = audioCtx.currentTime;

    //metronome
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

        osc.type = "square";
        
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


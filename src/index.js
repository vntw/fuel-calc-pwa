import offlineRuntime from 'offline-plugin/runtime';
import { evaluate } from './js/voice';
import { calc, formatLiters } from './js/fuel';
import { padZero } from './js/util';
import './scss/styles.scss';

offlineRuntime.install({
  onUpdateReady() {
    offlineRuntime.applyUpdate();
  },
  onUpdated() {
    if (confirm('Update ready, reload now?')) {
      location.reload();
    }
  },
});

let speechActive = false;
let recognizer = null;
const speechSynth = window.speechSynthesis || null;
const speechRec =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;

const form = document.querySelector('form');
const numbers = document.querySelectorAll('input[type=number]');
const speechRecBtn = document.querySelector('#sr');
const fuelPerLapInput = document.querySelector('input[name=fpl]');
const raceMinsInput = document.querySelector('input[name=racemin]');
const raceSecsInput = document.querySelector('input[name=racesec]');
const lapMinsInput = document.querySelector('input[name=min]');
const lapSecsInput = document.querySelector('input[name=sec]');
const resultRisky = document.querySelector('.result.risky .value');
const resultSafe = document.querySelector('.result.safe .value');

const storageKey = 'vals';
let storageSupported = false;
const test = '_';
try {
  localStorage.setItem(test, test);
  localStorage.removeItem(test);
  storageSupported = true;
} catch (e) {}

function submit() {
  setTimeout(() => form.dispatchEvent(new Event('submit')), 50);
}

function save() {
  if (!storageSupported) {
    return;
  }

  const settings = {
    min: lapMinsInput.value,
    sec: lapSecsInput.value,
    rmin: raceMinsInput.value,
    rsec: raceSecsInput.value,
    fpl: fuelPerLapInput.value,
  };

  localStorage.setItem(storageKey, JSON.stringify(settings));
}

function load() {
  if (!storageSupported) {
    return;
  }

  const d = localStorage.getItem(storageKey);

  if (!d) {
    return;
  }

  try {
    const settings = JSON.parse(d);

    lapMinsInput.value = settings.min;
    lapSecsInput.value = settings.sec;
    raceMinsInput.value = settings.rmin;
    raceSecsInput.value = settings.rsec;
    fuelPerLapInput.value = settings.fpl;
  } catch (e) {
    return;
  }
}

function startSpeech() {
  try {
    recognizer.start();
  } catch (e) {
    alert(`Could not start voice recognition: ${e}`);
    return;
  }

  speechActive = true;
  speechRecBtn.classList.add('active');
}

function stopSpeech() {
  speechActive = false;
  recognizer.stop();
  speechRecBtn.classList.remove('active');
}

load();
submit();

numbers.forEach(nr => {
  nr.addEventListener('focus', e => {
    e.target.select();
  });
  nr.addEventListener('change', e => {
    if (e.target.name.indexOf('sec') !== -1) {
      e.target.value = padZero(e.target.value);
    }

    submit();
    save();
  });
});

form.addEventListener('submit', e => {
  e.preventDefault();

  const lapMins = parseInt(lapMinsInput.value, 10);
  const lapSecs = parseInt(lapSecsInput.value, 10);
  const raceMins = parseInt(raceMinsInput.value, 10);
  const raceSecs = parseInt(raceSecsInput.value, 10);
  const fuelPerLap = parseFloat(fuelPerLapInput.value);

  const liters = calc(lapMins, lapSecs, raceMins, raceSecs, fuelPerLap);

  if (liters === null) {
    resultRisky.classList.add('invalid');
    resultRisky.innerHTML = '-';
    resultSafe.classList.add('invalid');
    resultSafe.innerHTML = '-';

    return;
  }

  const formattedSafeLiters = formatLiters(liters.safe);
  resultRisky.innerHTML = `${formatLiters(liters.risky)} <span>l</span>`;
  resultSafe.innerHTML = `${formattedSafeLiters} <span>l</span>`;

  resultRisky.classList.remove('invalid');
  resultSafe.classList.remove('invalid');

  if (speechSynth && speechActive) {
    const utterance = new SpeechSynthesisUtterance(
      `${formattedSafeLiters} liters`
    );
    // pause recognition so it won't pick up the spoken result
    recognizer.stop();
    utterance.addEventListener('end', () => recognizer.start());
    speechSynth.speak(utterance);
  }
});

speechRecBtn.addEventListener('click', e => {
  e.preventDefault();

  if (!recognizer) {
    alert('Speech recognition not supported');
    return;
  }

  speechActive ? stopSpeech() : startSpeech();
});

if (speechRec) {
  recognizer = new speechRec();
  recognizer.lang = 'en-US';
  recognizer.continuous = true;
  recognizer.onresult = e => {
    const res = evaluate(e);

    if (!res.hasMatch) {
      return;
    }

    if (res.repeat) {
      submit();
      return;
    }

    if (res.lapMins) {
      lapMinsInput.value = res.lapMins;
      lapSecsInput.value = padZero(res.lapSecs);
    }
    if (res.raceMins) {
      raceMinsInput.value = res.raceMins;
      raceSecsInput.value = padZero(res.raceSecs);
    }
    if (res.fuelPerLap) {
      fuelPerLapInput.value = res.fuelPerLap;
    }

    submit();
    save();
  };
  recognizer.onerror = e => {
    if (e.error === 'not-allowed') {
      alert('Microphone blocked for this site');
    }
    stopSpeech();
  };
}

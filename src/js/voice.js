const rxlap = /(lap|time|lap time) (\d{1,}) minutes?(\s{0,}(\d{1,})( seconds?)?)?/i;
const rxrm = /race (minutes )?(\d{1,}) minutes?(\s{0,}(\d{1,})( seconds?)?)?/i;
const rxfpl = /(\d+)\s{0,}(liters?|litres?|L)|fuel( per)?( lap)? (\d+)/i;

/**
 * speech rec grammar isn't working in Chrome currently (https://bugs.chromium.org/p/chromium/issues/detail_ezt?id=799849)
 */
export function evaluate(e) {
  let hasMatch = false;
  const results = {};

  let transcription = '';
  for (let i = e.resultIndex; i < e.results.length; i++) {
    for (let j = 0; j < e.results[i].length; j++) {
      transcription = e.results[i][j].transcript;
    }
  }

  const rxlm = rxlap.exec(transcription);
  if (rxlm && rxlm[2]) {
    const rxmin = parseInt(rxlm[2], 10);

    if (!isNaN(rxmin)) {
      results.lapMins = rxmin;
      hasMatch = true;

      if (rxlm[4]) {
        const rxsec = parseInt(rxlm[4], 10);
        results.lapSecs = isNaN(rxsec) ? 0 : rxsec;
      } else {
        results.lapSecs = 0;
      }
    }
  }

  const rxrmm = rxrm.exec(transcription);
  if (rxrmm && rxrmm[2]) {
    const rxrmmin = parseInt(rxrmm[2], 10);

    if (!isNaN(rxrmmin)) {
      results.raceMins = rxrmmin;
      hasMatch = true;

      if (rxrmm[4]) {
        const rxrmsec = parseInt(rxrmm[4], 10);
        results.raceSecs = isNaN(rxrmsec) ? 0 : rxrmsec;
      } else {
        results.raceSecs = 0;
      }
    }
  }

  const rxfplm = rxfpl.exec(transcription);
  if (rxfplm && rxfplm[1]) {
    const rxfpl = parseInt(rxfplm[1], 10);

    if (!isNaN(rxfpl)) {
      results.fuelPerLap = rxfpl;
      hasMatch = true;
    }
  }

  const rxWut = /^\s{0,}(what|how much|repeat)\s{0,}$/i;
  if (rxWut.test(transcription)) {
    results.repeat = true;
    hasMatch = true;
  }

  results.hasMatch = hasMatch;

  return results;
}

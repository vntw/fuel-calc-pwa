<p align="center"><img src="https://raw.githubusercontent.com/venyii/fuel-calc-pwa/master/.github/app.png"></p>

## Fuel Calculator Progressive Web App

This is a small PWA that allows you to quickly calculate the necessary fuel for a given race. Currently it supports race length in minutes.

**Demo**: [fuel-calc.ven.now.sh](https://fuel-calc.ven.now.sh)

If the browser supports the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) (speech recognition/synthesis), it's possible to tell the app what values to use and it will in return read the results back to you. This is especially useful when using a VR headset.

For possible voice commands, check out the currently valid regular expressions [here](https://github.com/venyii/fuel-calc-pwa/blob/master/src/js/voice.js#L1-L3). Unfortunately, due to a [bug](https://bugs.chromium.org/p/chromium/issues/detail?id=680944) in Chrome, it's not possible to use a proper grammar list which is part of the Web Speech API.

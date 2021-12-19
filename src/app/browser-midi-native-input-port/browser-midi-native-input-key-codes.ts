export const BROWSER_MIDI_NATIVE_INPUT_KEY_CODES: Record<string, number> = _createBrowserMidiNativeInputKeyCodes(2);

function _createBrowserMidiNativeInputKeyCodes(startingOctave: number): Record<string, number> {
  const keyRows: string[][] = [
    ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Minus', 'Equal'],
    ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight'],
    ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Backslash'],
    ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Period', 'Comma', 'Slash'],
  ];
  const result: Record<string, number> = {};
  let octave: number = 0;

  for (const keyRow of keyRows) {
    let pitch: number = 0;

    for (const key of keyRow) {
      result[key] = (startingOctave + octave + 1) * 12 + pitch++;
    }

    ++octave;
  }

  return result;
}

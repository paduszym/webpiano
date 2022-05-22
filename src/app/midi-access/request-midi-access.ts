export function requestMidiAccess(): Promise<WebMidi.MIDIAccess> {
  if (typeof navigator.requestMIDIAccess === 'function') {
    return navigator.requestMIDIAccess();
  }
  const noop: () => void = () => undefined;

  return Promise.resolve({
    inputs: new Map(),
    outputs: new Map(),
    sysexEnabled: false,
    addEventListener: noop,
    removeEventListener: noop,
    dispatchEvent: () => false,
    onstatechange: noop,
    eventListeners: () => [],
    removeAllListeners: noop,
  });
}

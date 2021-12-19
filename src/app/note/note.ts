import {NOTE_PITCHES, NotePitch} from './note-pitch';

export class Note {

  readonly pitch: NotePitch = NOTE_PITCHES[this.code % NOTE_PITCHES.length];

  readonly octave: number = Math.floor(this.code / NOTE_PITCHES.length) - 1;

  private static NOTES: Note[] = this._createNotes();

  private static CODE_TO_NOTE_MAP: Record<number, Note> = this._createCodeToNoteMap();

  private static NAME_TO_NOTE_MAP: Record<string, Note> = this._createNameToNoteMap();

  static range(from: Note, to: Note): Note[] {
    return this.NOTES.slice(this.NOTES.indexOf(from), this.NOTES.indexOf(to) + 1);
  }

  static fromName(name: string): Note {
    return this.NAME_TO_NOTE_MAP[name] || null;
  }

  static fromCode(code: number): Note {
    return this.CODE_TO_NOTE_MAP[code] || null;
  }

  private constructor(public readonly code: number) {
  }

  private static _createNotes(): Note[] {
    return new Array(127).fill(0).map((_, code) => new Note(code));
  }

  private static _createCodeToNoteMap(): Record<number, Note> {
    return this.NOTES.reduce((prev, curr) => {
      prev[curr.code] = curr;
      return prev;
    }, {});
  }

  private static _createNameToNoteMap(): Record<string, Note> {
    return this.NOTES.reduce((prev, curr) => {
      prev[`${curr.pitch}${curr.octave}`] = curr;
      return prev;
    }, {});
  }
}

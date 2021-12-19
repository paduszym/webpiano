import {DOCUMENT} from '@angular/common';
import {Inject, Injectable, Renderer2} from '@angular/core';

@Injectable()
export class FileDownloader {

  private readonly _document: Document;

  constructor(@Inject(DOCUMENT) _document: any,
              private _renderer: Renderer2) {
    this._document = _document;
  }

  downloadBlob(blob: Blob, fileName: string): void {
    const downloadAnchor: HTMLAnchorElement = this._renderer.createElement('a');
    const downloadData: string = URL.createObjectURL(blob);

    this._renderer.setStyle(downloadAnchor, 'position', 'absolute');
    this._renderer.setAttribute(downloadAnchor, 'href', downloadData);
    this._renderer.setAttribute(downloadAnchor, 'download', fileName);
    this._renderer.appendChild(this._document.body, downloadAnchor);

    downloadAnchor.click();
    setTimeout(() => URL.revokeObjectURL(downloadData)); // For Firefox it is necessary to delay revoking the ObjectURL

    this._renderer.removeChild(this._document.body, downloadAnchor);
  }
}

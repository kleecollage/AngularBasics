import { AbstractControl } from "@angular/forms";
import { Observable } from "rxjs";

export const mimeType = (
  control: AbstractControl
): Observable<{[key: string]: any} | null> => {

  if (typeof control.value === 'string' || !control.value) {
    return new Observable(observer => observer.next(null));
  }

  const file = control.value as File;

  return new Observable(observer => {
    file.arrayBuffer()
      .then(buffer => {
        const arr = new Uint8Array(buffer).subarray(0, 4);
        let header = arr.reduce((acc, byte) => acc + byte.toString(16), "");
        const validSignatures = [
          "89504e47", // PNG
          "ffd8ffe0", // JPG
          "ffd8ffe1",
          "ffd8ffe2",
          "ffd8ffe3",
          "ffd8ffe8"
        ];
        if (validSignatures.includes(header)) {
          observer.next(null); // valid
        } else {
          observer.next({ invalidMimeType: true}) // invalid
        }
        observer.complete();
      })
      .catch(() => {
        observer.next({ invalidMimeType: true }); // Error
        observer.complete();
      });
  });
};
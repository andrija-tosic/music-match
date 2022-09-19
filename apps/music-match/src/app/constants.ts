import { HttpHeaders } from '@angular/common/http';

export const constants = {
  httpOptions: {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  },
};

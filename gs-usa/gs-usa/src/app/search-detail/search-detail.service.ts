import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchDetailService {

  constructor(private http: HttpClient) { }

  getSearchDetails(): Observable<any>{
    return this.http.get('./assets/search-detail.json').pipe(
      map(this.extractData));
  }

  private extractData(res: Response) {
    return res; // If 'res' is null, it returns empty object
  }
}

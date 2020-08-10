import { Injectable, Input } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  getRecords(intName: string, sourceId: string, intStatus:string, fromDate: string, toDate: string): Observable<any> {
    const param = new HttpParams()
    .set('intName', intName)
    .set('sourceId', sourceId)
    .set('intStatus', intStatus)
    .set('fromDate', fromDate)
    .set('toDate', toDate);
    return this.http.get('./assets/search.json',{params: param}).pipe(
      map(this.extractData));
  }

  private extractData(res: Response) {
    return res; // If 'res' is null, it returns empty object
  }

}

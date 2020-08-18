import { Injectable, Input } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  customChangeDetector = new Subject<string>();
  customChangeDetector$ = this.customChangeDetector.asObservable();
  sourceId;
  constructor(private http: HttpClient) { }

  private newUser = new BehaviorSubject<any>({
    intName: '',
    sourceId: '',
    toDate: '',
    fromDate: ''
  });

  setNewUserInfo(user: any) {
    this.newUser.next(user);
  }

  getNewUserInfo() {
    return this.newUser.asObservable();
  }

  getRecords(intName: string, sourceId: string, intStatus: string, fromDate: string, toDate: string): Observable<any> {
    const param = new HttpParams()
      .set('intName', intName)
      .set('sourceId', sourceId)
      .set('intStatus', intStatus)
      .set('fromDate', fromDate)
      .set('toDate', toDate);
    return this.http.get('api/gsusa_get_order_search', { params: param }).pipe(
      map(this.extractData));
  }

  private extractData(res: Response) {
    return res; // If 'res' is null, it returns empty object
  }

  getIntDropDown() {
    return this.http.get('api/gsusa_get_integration_list').pipe(
      map(res => {
        return res;
      })
    )
  }

}

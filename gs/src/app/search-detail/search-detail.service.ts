import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchDetailService {

  constructor(private http: HttpClient) { }

  getSearchDetails(id: string, sourceId: string, intStatus: string, toDate: string, fromDate: string): Observable<any> {
    const param = new HttpParams()
      .set('intCode', id)
      .set('sourceId', sourceId)
      .set('intStatus', intStatus)
      .set('toDate', toDate)
      .set('fromDate', fromDate);
    return this.http.get('api/gsusa_get_orders_details', { params: param }).pipe(
      map(this.extractData));
  }

  private extractData(res: Response) {
    return res; // If 'res' is null, it returns empty object
  }

  reProcess(integrationCode: string, globaTrxId: string, sourceTrxId: string, intDetailsId: string, payLoads: string, resubmitFlag: string, updatedUserId: string) {
    const body = {
      integrationCode: integrationCode,
      globaTrxId: globaTrxId,
      sourceTrxId: sourceTrxId,
      intDetailsId: intDetailsId,
      payload: payLoads,
      resubmitFlag: resubmitFlag,
      updatedUserId: updatedUserId
    }
    // .set('integrationCode', integrationCode)
    // .set('globaTrxId', globaTrxId)
    // .set('sourceTrxId', sourceTrxId)
    // .set('intDetailsId', intDetailsId)
    // .set('payload', payLoads)
    // .set('resubmitFlag', resubmitFlag)
    // .set('updatedUserId', updatedUserId)
    return this.http.put('api/gsusa_update_orders', body).pipe(map(res => {
      console.log(res);
    }
    ))

  }
}

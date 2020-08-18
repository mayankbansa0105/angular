import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private http: HttpClient) { }

  updatePayload(integrationCode: string, globaTrxId: string, sourceTrxId: string, intDetailsId: string, payLoads: string, resubmitFlag: string, updatedUserId: string) {
    const body = {
      integrationCode: integrationCode,
      globaTrxId: globaTrxId,
      sourceTrxId: sourceTrxId,
      intDetailsId: intDetailsId,
      payload: payLoads,
      resubmitFlag: resubmitFlag,
      updatedUserId: updatedUserId
    }
    return this.http.put('api/gsusa_update_orders', body).pipe(map(res => {
      console.log(res);
    }
    ))

  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { IncomeTaxResponse } from '../models/income-tax-response';
import { IncomeTaxRequest } from '../models/income-tax-request';

@Injectable({
  providedIn: 'root',
})
export class TaxService {
  private taxServiceUrl = 'http://localhost:8080/api/tax/income-tax';

  constructor(private http: HttpClient) {}

  public calculateTax(taxRequest: IncomeTaxRequest): Observable<IncomeTaxResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.taxServiceUrl, JSON.stringify(taxRequest), { headers });
  }
}

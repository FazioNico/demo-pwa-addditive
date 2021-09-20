import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAdditive } from '../additive.iinterface';

@Injectable({
  providedIn: 'root'
})
export class AdditiveService {

  constructor(
    private readonly _http: HttpClient
  ) { }

  async getAll() {
    const {additives = []} = await this._http
      .get<{additives: IAdditive[]}>('./assets/db.json')
      .toPromise();
      
    return additives;
  }
}

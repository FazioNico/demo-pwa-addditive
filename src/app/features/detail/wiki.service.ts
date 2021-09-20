import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class WikiService {

  constructor(
    private readonly _http: HttpClient
  ) { }

  async getDetail(id: string) {
    const {extract_html = ''} = await this._http
      .get<{extract_html: string}>(`https://fr.wikipedia.org/api/rest_v1/page/summary/E${id}`)
      .toPromise();
    console.log(extract_html);
    return extract_html;
    
  }
}

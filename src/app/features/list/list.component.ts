import { Component, OnInit } from '@angular/core';
import { IAdditive } from 'src/app/additive.iinterface';
import { AdditiveService } from 'src/app/services/additive.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  public max: number = 15;

  public additives: IAdditive[]|undefined;
  constructor(
    private readonly _api: AdditiveService
  ) { }

  async ngOnInit() {
    const additives = await this._api.getAll();
    const views: any[] = [];
    this.additives = this.aggregateData(additives, views);
  }

  aggregateData(a: IAdditive[], b: {additiveId: string, views: number}[]) {
    const result = [];
    for (let index = 0; index < a.length; index++) {
      const element = a[index];
      const count = b.find(x => x.additiveId === element.id)?.views || 0;
      const obj = {...element, views: count};
      result.push(obj);
    }
    return result;
  }

  loadData($event: any) {
    if (this.additives?.length||0 < this.max) {
      console.log('more...');
      
      this.max += 15;
    }
    $event.target.complete();
  }
}

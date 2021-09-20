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
    this.additives = await this._api.getAll();
  }

  loadData($event: any) {
    if (this.additives?.length||0 < this.max) {
      console.log('more...');
      
      this.max += 15;
    }
    $event.target.complete();
  }
}

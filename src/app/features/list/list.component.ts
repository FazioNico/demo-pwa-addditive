import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IAdditive } from 'src/app/additive.iinterface';
import { AdditiveService } from 'src/app/services/additive.service';
import { collection, Firestore } from '@angular/fire/firestore';
import { collectionData } from 'rxfire/firestore';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {

  public max: number = 15;

  public additives: IAdditive[]|undefined;
  constructor(
    private readonly _api: AdditiveService,
    private readonly _firestore: Firestore

  ) { }

  async ionViewWillEnter() {
    const additives = await this._api.getAll();
    const fbCol = collection(this._firestore, 'additives');
    const data: any[] = await collectionData(fbCol).pipe(first()).toPromise();
    this.additives = this.aggregateData(additives, data);
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

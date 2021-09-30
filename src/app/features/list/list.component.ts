import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IAdditive } from 'src/app/additive.iinterface';
import { AdditiveService } from 'src/app/services/additive.service';
import { collection, Firestore } from '@angular/fire/firestore';
import { collectionData } from 'rxfire/firestore';
import { first } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

type SortType = 'alphabetic'|'views';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {

  public max: number = 15;
  public sortByValue: SortType = 'alphabetic';
  public additives: IAdditive[]|undefined;

  constructor(
    private readonly _api: AdditiveService,
    private readonly _firestore: Firestore,
    private readonly _alertCtrl: AlertController
  ) { }

  async ionViewWillEnter() {
    console.log('load...');
    
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

  async selectSortBy() {
    const ionAlert = await this._alertCtrl.create({
      header: 'Sortby',
      inputs: [
        {
          name: 'radio1',
          type: 'radio',
          label: 'Alphabetic',
          value: 'alphabetic',
          checked: this.sortByValue === 'alphabetic' ? true : false,
          cssClass: 'alertRadio'
        },
        {
          name: 'radio2',
          type: 'radio',
          label: 'Views',
          value: 'views',
          checked: this.sortByValue === 'views' ? true : false,
          cssClass: 'alertRadio'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'ion-color-dark'
        }, 
        {
          text: 'Ok', 
          role: 'ok',
          cssClass: 'ion-color-dark'
        }
      ]
    });
    await ionAlert.present();
    const { data, role } = await ionAlert.onWillDismiss();
    console.log(data, role);
    if (role === 'ok' && data?.values) {
      this.sortBy(data?.values)
    }
  }

  sortBy(type: SortType){
    
    if (type === 'alphabetic' && this.additives) {  
      this.additives = this.additives.sort((a, b) => {
        return (+a.id) - (+b.id)
      });
    }

    if (type === 'views' && this.additives) {
      this.additives = this.additives.sort((a, b) => {
        return (b.views||0) - (a.views||0) 
      });
    }
    this.sortByValue = type;
  }

  trackBy(index: number, additive: IAdditive): string {
    return additive.id;
  }

}

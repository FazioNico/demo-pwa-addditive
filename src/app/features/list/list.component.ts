import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IAdditive } from 'src/app/additive.iinterface';
import { AdditiveService } from 'src/app/services/additive.service';
import { collection, Firestore, query } from '@angular/fire/firestore';
import { authState, Auth, User, signOut, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { collectionData } from 'rxfire/firestore';
import { first, map } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { where } from '@firebase/firestore';

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
  public user$: Observable<User|any> = of({});

  constructor(
    private readonly _api: AdditiveService,
    private readonly _firestore: Firestore,
    private readonly _alertCtrl: AlertController,
    private readonly _auth: Auth,
  ) {
    this.user$ = authState(this._auth).pipe(
      map((user: User|null)=> {
        if (user) {
          return user;
        }
        return {};
      })
    );
  }

  async ionViewWillEnter() {
    console.log('load...');
    // get user from firebase
    const user = await this.user$.pipe(first()).toPromise();
    this.getData(user);
  }

  async getData(user?: User) {
    // get data from API
    const additives = await this._api.getAll();
    // if user is connected load data with aggregation from firebase
    if (user?.uid) {
      const fbCol = collection(this._firestore, 'additives');
      // create constraint to load only user data
      const byUserId = where('uid', '==', user.uid);
      // build firebase query
      const q = query(fbCol, byUserId);
      // request data from firebase
      const data: any[] = await collectionData(q).pipe(first()).toPromise();
      // aggregate data
      this.additives = this.aggregateData(additives, data);
    } else {
      // user is not connected load data from API
      this.additives = additives;
    }
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

  loadMoreData($event: any) {
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

  async login(){
    const { user } = await signInWithPopup(this._auth, new GoogleAuthProvider());
    this.getData(user);
  }

  logout() {
    signOut(this._auth);
    this.getData();
  }
}

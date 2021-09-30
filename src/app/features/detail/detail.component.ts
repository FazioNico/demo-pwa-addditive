import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { IAdditive } from 'src/app/additive.iinterface';
import { AdditiveService } from 'src/app/services/additive.service';
import { WikiService } from './wiki.service';
import { Firestore, collectionData, collection, setDoc, doc, deleteDoc, updateDoc, limit, QueryConstraint, where,  } from '@angular/fire/firestore';
import { query } from '@firebase/firestore';
import { first } from 'rxjs/operators';
import { Auth, authState } from '@angular/fire/auth';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {

  public additive: IAdditive|undefined;
  public detail: string|undefined;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _api: AdditiveService,
    private readonly _alertCtrl: AlertController,
    private readonly _wikiApi: WikiService,
    private readonly _fireStore: Firestore,
    private readonly _auth: Auth
  ) { }

  async ngOnInit() {
    const id = this._route.snapshot.params.id;
    const additive = await this._api
      .getAll()
      .then(data => {
        return data.find(additive => additive.id === id);
      });
    if (!additive) {
      this.handleError();
      return;
    } else {
      this.additive = additive;
      this.detail = await this._wikiApi.getDetail(this.additive.id);
      const user = await authState(this._auth).pipe(first()).toPromise();
      if (user?.uid) {
        await this.counterViews(id, user.uid);
      }
    }
  }

  async counterViews(additiveId: string, uid?: string) {
    const fbcol = collection(this._fireStore, 'additives');
    const byAdditiveId = where('additiveId', '==', additiveId);
    let q;
    if (uid) {
      const byUserId = where('uid', '==', uid);
      q = query(fbcol, byUserId, byAdditiveId);
    } else {
      q = query(fbcol, byAdditiveId);
    }
    const data = await collectionData(q, {idField: 'id'}).pipe(first()).toPromise();
    if (data.length === 0) {
      // create first count
      const id = Date.now();
      const fbDoc = doc(this._fireStore, 'additives/' + id);
      if (uid) await setDoc(fbDoc, {additiveId, views: 1, uid});
    } else {
      // increment counter
      const totalViews = ++data[0].views;
      const fbDoc = doc(this._fireStore, 'additives/' + data[0].id);
      if (uid) await updateDoc(fbDoc, {views: totalViews, uid});
    }
  }

  async handleError() {
    // affichjer une alert
    const ionAlert = await this._alertCtrl.create({
      message: 'Aucun additif ne correspond à cet ID',
      buttons: [
        {text: 'ok  ', cssClass: 'ion-color-dark'}
      ]
    });
    await ionAlert.present();
    // rediriger sur la page d'accueil
    this._router.navigateByUrl('/');
  }
}

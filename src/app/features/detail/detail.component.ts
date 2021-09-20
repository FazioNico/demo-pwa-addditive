import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { IAdditive } from 'src/app/additive.iinterface';
import { AdditiveService } from 'src/app/services/additive.service';
import { WikiService } from './wiki.service';

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
    private readonly _wikiApi: WikiService
  ) { }

  async ngOnInit() {
    const id = this._route.snapshot.params.id;
    console.log(id);
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

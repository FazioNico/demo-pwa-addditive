import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AdditiveFinder';

  constructor(
    private _toastCtrl: ToastController
  ) {
    this.displayToastInstall();
  }

  async displayToastInstall(platform = null) {
    // Detects if device is on iOS 
    const isIos = () => {
      const userAgent = platform || window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test( userAgent );
    }
    // Detects if device is in standalone mode
    const isInStandaloneMode = () => ('standalone' in (window as any).navigator) && ((window as any).navigator.standalone);
    // Checks if should display install popup notification:
    if (isIos() && !isInStandaloneMode()) {
      const toast = await this._toastCtrl.create({
        message: 'AdditiveFinder is not installed. Please install it by click to ....',
      });
      await toast.present();
    }
  }
}

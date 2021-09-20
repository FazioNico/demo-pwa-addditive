import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  constructor(
    private readonly _router: Router
  ) { }

  ngOnInit() {}

  search(inputElement: IonInput) {
    this._router.navigate(['tabs','list', inputElement.value]);
    inputElement.value = '';
  }

}

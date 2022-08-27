import {Component, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dig';
  constructor(private r: ViewContainerRef) {
    // r.createComponent()
  }
}

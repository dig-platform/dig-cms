// import {
//   AfterContentInit,
//   AfterViewInit,
//   Directive,
//   HostBinding, HostListener,
//   Input,
//   OnInit,
//   ViewRef
// } from '@angular/core';
// import {getDig, getInputs} from '../dig';
// import {DigService} from '../services/dig.service';
//
// @Directive({
//   // eslint-disable-next-line @angular-eslint/directive-selector
//   selector: '[dig]'
// })
// export class DigDirective implements AfterViewInit{
//   // todo figure out the type here
//   @Input() dig;
//   @Input() uid: string;
//
//   constructor(private digService: DigService) {
//   }
//
//
//   @HostListener('click', ['$event.target'])
//   onClick(btn) {
//     this.digService.openForm(this.uid);
//     this.digService.active$.subscribe(console.log);
//   }
//
//   ngAfterViewInit(): void {
//     this.digService.setControl(this.uid, getInputs(this.dig));
//   }
//
// }

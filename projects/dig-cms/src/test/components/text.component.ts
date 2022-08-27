import {Component, Input, OnInit} from '@angular/core';
import {Dig} from '../../lib/dig/dig';

export const textConfig = {
  control: 'input',
  type: 'text',
  placeholder: 'Enter some text'
};

@Component({
  template: '<p>Test</p>'
})
export class TextComponent implements OnInit {
  @Dig({
    type: 'text',
    placeholder: 'Enter some text'
  })
  @Input() text = 'test this';
  @Dig({
    type: 'text',
    rows: 2,
    placeholder: 'Enter a description'
  })
  @Input() description = 'test this';
  @Input() format!: string;

  ngOnInit() {
    // console.log(getControl(this, 'text'));
  }

}

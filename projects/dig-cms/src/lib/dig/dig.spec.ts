import {Dig, digComponent, digInput} from './dig';
import {Component, Input, OnInit} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {TextComponent, textConfig} from '../../test/components/text.component';

describe('Dig/Decorators', () => {
  let component: TextComponent;
  let fixture: ComponentFixture<TextComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TextComponent ],
      imports: []
    }).compileComponents();

    fixture = TestBed.createComponent(TextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should get the input decorators for an individual input', () => {
    const config = digInput(component, 'text');
    expect(config?.type).toEqual('text');
  });

  it('should get the input decorators for all the inputs in a component', () => {
    const inputs = digComponent(component);
    expect(inputs?.length).toEqual(2);
    if (inputs) {
      expect(inputs[0].input).toEqual('text');
      expect(inputs[0].digProps.type).toEqual('text');
    }
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeCaptureComponent } from './income-capture.component';

describe('IncomeCaptureComponent', () => {
  let component: IncomeCaptureComponent;
  let fixture: ComponentFixture<IncomeCaptureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeCaptureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgkitComponent } from './ngkit.component';

describe('NgkitComponent', () => {
  let component: NgkitComponent;
  let fixture: ComponentFixture<NgkitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgkitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgkitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

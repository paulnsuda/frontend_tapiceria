import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformasComponent } from './proformas.component';

describe('ProformasComponent', () => {
  let component: ProformasComponent;
  let fixture: ComponentFixture<ProformasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProformasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProformasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPaymentsComponent } from './job-payments.component';

describe('JobPaymentsComponent', () => {
  let component: JobPaymentsComponent;
  let fixture: ComponentFixture<JobPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobPaymentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobPaymentsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

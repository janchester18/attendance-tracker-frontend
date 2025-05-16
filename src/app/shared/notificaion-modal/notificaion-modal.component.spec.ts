import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificaionModalComponent } from './notificaion-modal.component';

describe('NotificaionModalComponent', () => {
  let component: NotificaionModalComponent;
  let fixture: ComponentFixture<NotificaionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificaionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificaionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

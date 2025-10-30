import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderConfirmationAndTrack } from './order-confirmation-and-track';

describe('OrderConfirmationAndTrack', () => {
  let component: OrderConfirmationAndTrack;
  let fixture: ComponentFixture<OrderConfirmationAndTrack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderConfirmationAndTrack]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderConfirmationAndTrack);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

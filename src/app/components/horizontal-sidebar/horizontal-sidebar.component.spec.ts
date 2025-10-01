import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalSidebarComponent } from './horizontal-sidebar.component';

describe('HorizontalSidebarComponent', () => {
  let component: HorizontalSidebarComponent;
  let fixture: ComponentFixture<HorizontalSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorizontalSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalSpaceComponent } from './personal-space.component';

describe('PersonalSpaceComponent', () => {
  let component: PersonalSpaceComponent;
  let fixture: ComponentFixture<PersonalSpaceComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      imports: [PersonalSpaceComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalSpaceComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

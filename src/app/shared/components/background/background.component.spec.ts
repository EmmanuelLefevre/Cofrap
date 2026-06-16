import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { BackgroundComponent } from './background.component';

@Component({
  selector: 'test-host',
  imports: [BackgroundComponent],
  template: `
    <background>
      <div class="fake-content" data-testid="projected-content">
        Hello World
      </div>
    </background>
  `
})
class TestHostComponent {}

describe('BackgroundComponent', () => {

  describe('Instanciation', () => {

    let component: BackgroundComponent;
    let fixture: ComponentFixture<BackgroundComponent>;

    beforeEach(async() => {
      await TestBed.configureTestingModule({
        imports: [BackgroundComponent]
      }).compileComponents();

      fixture = TestBed.createComponent(BackgroundComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Integration', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async() => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent]
      }).compileComponents();

      fixture = TestBed.createComponent(TestHostComponent);

      fixture.detectChanges();
    });

    it('should render the BackgroundComponent inside the host', () => {
      // --- ACT ---
      const backgroundElement = fixture.debugElement.query(By.directive(BackgroundComponent));

      // --- ASSERT ---
      expect(backgroundElement).toBeTruthy();
    });

    it('should project the content correctly via <ng-content>', () => {
      // --- ACT ---
      const projectedContent = fixture.debugElement.query(By.css('[data-testid="projected-content"]'));

      // --- ASSERT ---
      expect(projectedContent).toBeTruthy();
      expect(projectedContent.nativeElement.textContent.trim()).toBe('Hello World');
    });
  });
});

/* eslint-disable @typescript-eslint/no-magic-numbers */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { FormFieldConfig } from '@core/_models/forms/form.model';

import { DynamicFormComponent } from './dynamic-form.component';

describe('DynamicFormComponent', () => {

  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormComponent>;

  const MOCK_FIELDS: FormFieldConfig[] = [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      initialValue: 'adminCOFRAP',
      validators: [Validators.required]
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      validators: [Validators.required]
    },
    {
      name: 'code2FA',
      label: 'Code 2FA',
      type: 'text'
    }
  ];

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [
        DynamicFormComponent,
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('fields', MOCK_FIELDS);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form controls based on fields input (via effect)', () => {
    // --- ASSERT ---
    expect(component['form'].contains('username')).toBe(true);
    expect(component['form'].contains('password')).toBe(true);
    expect(component['form'].contains('code2FA')).toBe(true);
  });

  describe('Computed: visibleFields', () => {
    it('should expose all fields provided in input', () => {
      // --- ACT ---
      const VISIBLE = component['visibleFields']();

      // --- ASSERT ---
      expect(VISIBLE.length).toBe(MOCK_FIELDS.length);
      expect(VISIBLE[0].name).toBe('username');
      expect(VISIBLE[1].name).toBe('password');
      expect(VISIBLE[2].name).toBe('code2FA');
    });
  });

  describe('patchValue()', () => {
    it('should set the values of the specified controls', () => {
      // --- ARRANGE ---
      const NEW_USERNAME = 'newAdmin';
      component['form'].patchValue({ username: 'oldAdmin' });

      // --- ACT ---
      component.patchValue({ username: NEW_USERNAME });

      // --- ASSERT ---
      expect(component['form'].get('username')?.value).toBe(NEW_USERNAME);
    });

    it('should safely ignore missing controls when patching', () => {
      // --- ACT & ASSERT ---
      expect(() => component.patchValue({ invalidField: 'test' })).not.toThrow();
    });
  });

  describe('onSubmit()', () => {
    it('should emit submitted event with raw value if form is valid', () => {
      // --- ARRANGE ---
      const SPY = vi.spyOn(component.submitted, 'emit');
      component['form'].patchValue({
        username: 'JohnDoe123',
        password: 'password123',
        code2FA: '123456'
      });

      // --- ACT ---
      component['onSubmit']();

      // --- ASSERT ---
      expect(SPY).toHaveBeenCalledWith({
        username: 'JohnDoe123',
        password: 'password123',
        code2FA: '123456'
      });
    });

    it('should mark all fields as touched and not emit if form is invalid', () => {
      // --- ARRANGE ---
      const SPY = vi.spyOn(component.submitted, 'emit');
      component['form'].patchValue({ username: '' });

      // --- ACT ---
      component['onSubmit']();

      // --- ASSERT ---
      expect(SPY).not.toHaveBeenCalled();
      expect(component['form'].get('username')?.touched).toBe(true);
      expect(component['form'].get('password')?.touched).toBe(true);
    });
  });

  describe('resetForm()', () => {
    it('should clear form values', () => {
      // --- ARRANGE ---
      component['form'].patchValue({ username: 'dirty@data.com' });
      expect(component['form'].get('username')?.value).toBe('dirty@data.com');

      // --- ACT ---
      component.resetForm();

      // --- ASSERT ---
      expect(component['form'].get('username')?.value).toBe(null);
    });
  });

  describe('Effect & initialization', () => {
    it('should handle missing initialValue and default to empty string (branch coverage)', async() => {
      // --- ASSERT ---
      expect(component['form'].get('password')?.value).toBe('');
    });

    it('should not re-add controls if they already exist in the form group', async() => {
      // --- ARRANGE ---
      const EXPECTED_FIELDS_COUNT = MOCK_FIELDS.length;

      // --- ACT ---
      fixture.componentRef.setInput('fields', [...MOCK_FIELDS]);
      fixture.detectChanges();

      // --- ASSERT ---
      expect(Object.keys(component['form'].controls).length).toBe(EXPECTED_FIELDS_COUNT);
    });
  });
});

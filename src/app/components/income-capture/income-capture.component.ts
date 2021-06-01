import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { IncomeTaxResponse } from '../../models/income-tax-response';
import { GenericValidator } from '../../shared/generic-validator';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormControlName,
  AbstractControl,
} from '@angular/forms';
import { Observable, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TaxService } from '../../services/tax.service';
import { IncomeTaxRequest } from 'src/app/models/income-tax-request';
import { AbstractClassPart } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-income-capture',
  templateUrl: './income-capture.component.html',
  styleUrls: ['./income-capture.component.css'],
})
export class IncomeCaptureComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[];

  disabled = false;
  errorMessage: string;
  results: IncomeTaxResponse;
  incomeCaptureForm: FormGroup;
  incomeTaxResponse: IncomeTaxResponse;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [id: string]: { [id: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder, private taxService: TaxService) {
    this.validationMessages = {
      year: {
        required: 'Please select a tax year',
      },
      age: {
        required: 'Please enter your age.',
        min: 'The minimum age is 18',
      },
      frequency: {
        required: 'Please select an option of how ofen do you get paid',
      },
      earnings: {
        required: 'Please enter your earnings',
        min: 'The earned amount must be more tha 0',
      },
      medicalAidMembers: {
        min: 'Medical aid members cannont be less than 0',
      },
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.createForm();
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur')
    );

    merge(this.incomeCaptureForm.valueChanges, ...controlBlurs)
      .pipe(debounceTime(800))
      .subscribe((value) => {
        this.displayMessage = this.genericValidator.processMessages(
          this.incomeCaptureForm
        );
      });
  }

  get yearCtrl() {
    return this.incomeCaptureForm.get('year').value;
  }

  get ageCtrl() {
    return this.incomeCaptureForm.get('age').value;
  }

  get frequencyCtrl() {
    return this.incomeCaptureForm.get('frequency').value;
  }

  get earningsCtrl() {
    return this.incomeCaptureForm.get('earnings').value;
  }

  get medicalAidMembersCtrl() {
    return this.incomeCaptureForm.get('medicalAidMembers').value;
  }

  createForm(): void {
    this.incomeCaptureForm = this.fb.group({
      year: [2021, Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
      frequency: ['MONTHLY', Validators.required],
      earnings: ['', [Validators.required, Validators.min(1)]],
      medicalAidMembers: ['', Validators.min(0)],
    });
  }

  resetForm(): void {
    this.incomeCaptureForm.reset();
  }

  calculateTax(): void {
    console.log(this.incomeCaptureForm.value);
    if (this.incomeCaptureForm.invalid) {
      this.incomeCaptureForm.markAllAsTouched();
      this.incomeCaptureForm.updateValueAndValidity();
      return;
    }

    const incomeTaxRequest = this.transformToTaxRequest();

    this.taxService.calculateTax(incomeTaxRequest).subscribe({
      next: (response: IncomeTaxResponse) => this.incomeTaxResponse = response,
      error: (err) => this.errorMessage = err
    })
  }

  transformToTaxRequest() {
    let taxRequest: IncomeTaxRequest;

    taxRequest = {
      age: this.ageCtrl,
      year: this.yearCtrl,
      medicalAidMembers: this.medicalAidMembersCtrl,
      earnings: this.earningsCtrl,
      period: this.frequencyCtrl,
    };

    return taxRequest;
  }
}

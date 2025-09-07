import { CommonModule, formatDate } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

interface UsersType {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  contactNumber: string;
  description: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  @Input() users: UsersType[] = [];

  selectedId: string = '';
  editId: string = '';
  addUserBoolean: boolean = false;
  formSubmitted: boolean = false;
  today: string = new Date().toISOString().split('T')[0];
  descriptionLength: number = 0;
  private descriptionSub!: Subscription;

  userForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[a-zA-Z\s]*$/),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    dateOfBirth: new FormControl('', [Validators.required]),
    contactNumber: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.maxLength(100)]),
  });

  onSelectUser(id: string) {
    this.selectedId = id;
  }

  get getSelectedUser() {
    return this.users.filter((user) => user.id == this.selectedId)[0];
  }

  openModal() {
    this.addUserBoolean = true;
  }

  closeModal() {
    this.addUserBoolean = false;
    this.formSubmitted = false;
    this.userForm.setValue({
      name: '',
      email: '',
      dateOfBirth: '',
      contactNumber: '',
      description: '',
    });
    this.editId = '';
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  allowOnlyAlphabets(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', ' '];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    if (!/^[a-zA-Z]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  blockInvalidPaste(event: ClipboardEvent) {
    const pasted = event.clipboardData?.getData('text') ?? '';
    if (!/^[a-zA-Z\s]*$/.test(pasted)) {
      event.preventDefault();
    }
  }
  onPasteNumber(event: ClipboardEvent) {
    const pasted = event.clipboardData?.getData('text') ?? '';
    if (!/^\d+$/.test(pasted)) {
      event.preventDefault();
    }
  }

  onDescriptionPaste(event: ClipboardEvent) {
    const control = this.userForm.get('description');
    const value = control?.value || '';
    const pasteData = event.clipboardData?.getData('text') || '';

    if (value.length + pasteData.length > 100) {
      event.preventDefault();
      const allowed = pasteData.substring(0, 100 - value.length);
      control?.setValue(value + allowed);
    }
  }

  onDescriptionChange(event: KeyboardEvent) {
    let value = this.userForm.value['description'];
    if (value.length >= 100) {
      event.preventDefault();
    }
  }

  onFormSubmit() {
    this.formSubmitted = true;
    if (this.userForm.invalid) {
      return;
    }

    const userValues = this.userForm.value;

    if (this.users.find((user) => user.id == this.editId)) {
      let index = this.users.findIndex((user) => user.id == this.editId);
      this.users[index] = { id: this.editId, ...userValues };
    } else {
      userValues['id'] = Date.now().toString();
      if (this.users.find((user) => user.email === userValues.email)) {
        this.userForm.get('email')?.setErrors({ emailTaken: true });
        return;
      }
      this.users.push(userValues);
    }

    this.closeModal();
  }

  deleteUser(id: string) {
    this.users = this.users.filter((user) => user.id !== id);
    this.selectedId = '';
  }

  onUserEdit(id: string) {
    let currentValues = this.users.filter((user) => user.id === id)[0];
    this.editId = id;
    this.userForm.setValue({
      name: currentValues.name,
      email: currentValues.email,
      dateOfBirth: this.formatDate(currentValues.dateOfBirth),
      contactNumber: currentValues.contactNumber,
      description: currentValues.description,
    });
    this.openModal();
  }

  formatDate(dateStr: string): string | null {
    if (!dateStr) return null;
    let parts = dateStr.split('-');
    if (parts[0].length === 4) {
      return dateStr;
    }
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  ngOnInit() {
    this.descriptionSub = this.userForm.get('description')!.valueChanges.subscribe((value) => {
      this.descriptionLength = value.length;
    });
  }

  ngOnDestroy() {
    if (this.descriptionSub) {
      this.descriptionSub.unsubscribe();
    }
  }
}

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { Transaction } from '../../shared/models/transaction.model';
import { Category } from '../../shared/models/category.model';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-transaction-edit',
  imports: [
    MatFormField,
    MatSelect,
    MatOption,
    MatLabel,
    FormsModule,
    MatInput,
    MatDialogActions,
    MatButton,
    MatDialogContent,
    MatDialogTitle,
  ],
  templateUrl: './transaction-edit.html',
  styleUrl: './transaction-edit.scss',
})
export class TransactionEdit {
  constructor(
    public dialogRef: MatDialogRef<TransactionEdit>,
    @Inject(MAT_DIALOG_DATA) public data: { transaction: Transaction; categories: Category[] },
  ) {
    // Clone the object so changes don't reflect in the table until saved
    this.data.transaction = { ...data.transaction };
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  onSave(): void {
    this.dialogRef.close(this.data.transaction);
  }
}

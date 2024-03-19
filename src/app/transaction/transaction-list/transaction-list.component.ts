import { Transaction, Transactions } from './../../models/vy-models';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { NgFor, NgClass, NgIf, CommonModule } from '@angular/common';
import { ApiTransactionService } from '../../services/api-transaction.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription, of } from 'rxjs';
@Component({
  selector: 'vy-transaction-list',
  standalone: true,
  imports: [CommonModule, NgClass, NgFor, NgIf, DatePipe, ReactiveFormsModule],
  styleUrl: './transaction-list.component.scss',
  templateUrl: './transaction-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionListComponent {
  pageTitle = 'Transaction List';
  filterForm: FormGroup;
  statusValues: string[] = ['CREATED', 'FAILED', 'SETTLED', 'COMPLETED', 'CAPTURED'];
  selectedDate: Date | null = null;
  selectedStatus: string | null = '';

  @Input() ChildTransactions: Transaction[] = [];
  @Input() ChildEmptyMessage: string = '';
  
  @Output() ChildStatusChanged = new EventEmitter<string>();
  @Output() ChildDateChanged = new EventEmitter<string>();
  @Output() ChildSelectedTransaction = new EventEmitter<number>();

  transactionService = inject(ApiTransactionService);

  constructor(private fb:FormBuilder) {
    this.filterForm = this.fb.group({
      status: [null]
    });
  }

  onStatusChanged(selectedStatus: string): void {
    console.log('Status filter changed in child: ', selectedStatus);

    this.selectedStatus = selectedStatus;
    this.ChildStatusChanged.emit(selectedStatus);
  }

  onDateChanged(dateValue: string): void {
    console.log('Date filter changed:', dateValue);

    this.selectedDate = new Date(dateValue);
    this.ChildDateChanged.emit(dateValue);
  }

  onSelectedTransactionFromList(id: number): void {
    console.log('Selected transaction:', id);

    this.ChildSelectedTransaction.emit(id);
  }


  filteredTransactionsSignal = () => {
    // TODO: Here we listen for Signal updates instead of subscribing to an observable
    // ideally we can move this to the smart component and subscribe to the observable there to make this
    // dummy component cleanner, but I rather keep it as is for now.
    const transactions = this.transactionService.filteredTransactionsSignal();
    return transactions;
  };

  trackByStatus(index: number, item: string) {
    return `${item}-${index}`;
  }

}
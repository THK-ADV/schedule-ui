import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core'
import {FormControl} from '@angular/forms'
import {EMPTY, Observable} from 'rxjs'
import {map, startWith} from 'rxjs/operators'
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete/autocomplete'

@Component({
  selector: 'schd-filter-option',
  templateUrl: './filter-option.component.html',
  styleUrls: ['./filter-option.component.scss']
})
export class FilterOptionComponent<T> implements OnInit {

  @ViewChild('search') search: ElementRef | undefined

  @Input() title = ''

  @Input() display: (value: T) => string = (_ => '')
  options: T[] = []

  @Input() set values(ts: T[]) {
    this.options = ts
    this.initFilterOptions()
  }

  @Output() onSelect = new EventEmitter<T>()

  filteredOptions: Observable<T[]> = EMPTY
  formControl = new FormControl()

  private hasSelection = false

  ngOnInit(): void {
    this.initFilterOptions()
  }

  private initFilterOptions = () => {
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : this.display(value)),
      map(value => value ? this.filter(value) : this.options.slice())
    )
  }

  private filter = (input: string): T[] => {
    const filterValue = input.toLowerCase()
    return this.options.filter(t => this.display(t).toLowerCase().indexOf(filterValue) >= 0)
  }

  displayFn = (value?: T): string => {
    return (value && this.display(value)) ?? ''
  }

  onSelected = (e: MatAutocompleteSelectedEvent) => {
    this.hasSelection = true
    this.onSelect.emit(e.option.value)
    this.deselect()
  }

  onClosed = () => {
    if (!this.hasSelection && !this.formControl.value) {
      this.onSelect.emit(undefined)
    }
    this.hasSelection = false
    this.deselect()
  }

  onClear = (event: Event) => {
    event.stopPropagation()
    this.onSelect.emit(undefined)
    this.reset()
  }

  reset = () => {
    this.formControl.reset(undefined, {emitEvent: false})
    this.initFilterOptions()
    this.deselect()
  }

  deselect = () => {
    if (this.search) {
      this.search.nativeElement.blur()
    }
  }
}

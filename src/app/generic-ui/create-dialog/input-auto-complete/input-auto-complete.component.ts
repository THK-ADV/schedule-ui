import {Component, Input, OnDestroy, OnInit} from '@angular/core'
import {EMPTY, Observable, Subscription} from 'rxjs'
import {UntypedFormControl} from '@angular/forms'
import {map, startWith} from 'rxjs/operators'
import {FormInput, FormInputLike} from '../form-input'
import {mandatoryOptionsValidator, optionalOptionsValidator} from '../form-input-validator'

export interface AutoCompleteInput<A> extends FormInputLike {
  data: Observable<A[]>
  show: (a: A) => string
  kind: 'auto-complete'
  initialValue?: (opts: A[]) => A | undefined
}

export const formControlForAutocompleteInput = (i: FormInput): UntypedFormControl | undefined => {
  switch (i.kind) {
    case 'auto-complete':
      return new UntypedFormControl(
        {value: undefined, disabled: i.disabled},
        i.required ? mandatoryOptionsValidator() : optionalOptionsValidator()
      )
    default:
      return undefined
  }
}


@Component({
  selector: 'schd-input-auto-complete',
  templateUrl: './input-auto-complete.component.html',
  styleUrls: ['./input-auto-complete.component.scss']
})
export class InputAutoCompleteComponent<A> implements OnInit, OnDestroy {

  @Input() input!: AutoCompleteInput<A>
  @Input() formControl!: UntypedFormControl

  options: A[] = []
  filteredOptions: Observable<A[]> = EMPTY

  private sub!: Subscription

  ngOnInit(): void {
    this.observeData()
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  private observeData = () => {
    this.sub = this.input.data.subscribe(data => {
      this.options = data ?? []
      this.selectInitialValue()
      this.initFilterOptions()
    })
  }

  private selectInitialValue = () => {
    if (this.input.initialValue) {
      this.formControl.setValue(this.input.initialValue(this.options))
    }
  }

  private initFilterOptions = () => {
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : this.input.show(value)),
      map(value => value ? this.filter(value) : this.options.slice())
    )
  }

  private filter = (input: string): A[] => {
    const filterValue = input.toLowerCase()
    return this.options.filter(t => this.input.show(t).toLowerCase().indexOf(filterValue) >= 0)
  }

  displayFn = (value?: A): string => {
    return (value && this.input.show(value)) ?? ''
  }

  reset = () => {
    this.formControl.reset(undefined, {emitEvent: false})
    this.initFilterOptions()
  }

}

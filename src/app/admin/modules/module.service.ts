import {Injectable} from '@angular/core'
import {ModuleApiService} from '../../http/module-api.service'
import {Observable, of} from 'rxjs'
import {Module, ModuleAtom} from '../../models/module'
import {mapOpt, zip} from '../../utils/optional'
import {parseFloatNumber, parseLecturer} from '../../utils/parser'
import {AutoCompleteInput} from '../../generic-ui/create-dialog/input-auto-complete/input-auto-complete.component'
import {Lecturer} from '../../models/user'
import {describeUserWithCampusId} from '../../utils/describe'
import {NumberInput, TextInput, URLInput} from '../../generic-ui/create-dialog/input-text/input-text.component'
import {FormInput} from '../../generic-ui/create-dialog/form-input'
import {UserApiService} from '../../http/user-api.service'

export interface ModuleProtocol {
  courseManager: string
  label: string
  abbreviation: string
  credits: number
  descriptionUrl: string
}

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  private readonly label: TextInput
  private readonly abbreviation: TextInput
  private readonly user: AutoCompleteInput<Lecturer>
  private readonly credits: NumberInput
  private readonly descriptionUrl: URLInput

  constructor(
    private readonly http: ModuleApiService,
    private readonly userService: UserApiService
  ) {
    this.label = ({
      label: 'Bezeichnung',
      attr: 'label',
      kind: 'text',
      disabled: false,
      required: true
    })
    this.abbreviation = ({
      label: 'Abkürzung',
      attr: 'abbreviation',
      kind: 'text',
      disabled: false,
      required: true
    })
    this.user = ({
      label: 'Modulverantwortlicher',
      attr: 'courseManager',
      required: true,
      disabled: false,
      show: describeUserWithCampusId,
      kind: 'auto-complete',
      data: userService.lecturer()
    })
    this.credits = ({
      label: 'ECTS',
      attr: 'credits',
      required: true,
      disabled: false,
      kind: 'number',
      min: 0.5
    })
    this.descriptionUrl = ({
      label: 'Link zum Modulehandbucheintrag',
      attr: 'descriptionUrl',
      required: true,
      disabled: false,
      kind: 'url'
    })
  }

  modules = (): Observable<ModuleAtom[]> =>
    this.http.modulesAtomic()

  delete = (m: ModuleAtom): Observable<ModuleAtom> =>
    of(m)

  create = (p: ModuleProtocol): Observable<Module> =>
    of({...p, id: 'random uuid'})

  update = (p: ModuleProtocol, id: string): Observable<Module> =>
    of({...p, id})

  createInputs = (): FormInput[] => [
    this.label,
    this.abbreviation,
    this.user,
    this.credits,
    this.descriptionUrl
  ]

  updateInputs = (m: ModuleAtom): FormInput[] => [
    {...this.label, initialValue: m.label},
    {...this.abbreviation, initialValue: m.abbreviation},
    {...this.user, initialValue: users => users.find(_ => _.id === m.courseManager.id)},
    {...this.credits, disabled: true, initialValue: m.credits},
    {...this.descriptionUrl, initialValue: m.descriptionUrl}
  ]

  parseProtocol = (attrs: { [p: string]: string }): ModuleProtocol | undefined =>
    mapOpt(
      zip(
        parseLecturer(attrs.courseManager),
        parseFloatNumber(attrs.credits)
      ),
      ([courseManager, credits]) => ({
        abbreviation: attrs.abbreviation,
        label: attrs.label,
        courseManager: courseManager.id,
        descriptionUrl: attrs.descriptionUrl,
        credits
      })
    )

  createProtocol = (m: ModuleAtom, attrs: { [p: string]: string }): ModuleProtocol | undefined =>
    this.parseProtocol({...attrs, credits: m.credits.toString()})
}


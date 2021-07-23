import {Injectable} from '@angular/core'
import {SubmoduleApiService} from '../../http/submodule-api.service'
import {NumberInput, TextInput, URLInput} from '../../generic-ui/create-dialog/input-text/input-text.component'
import {AutoCompleteInput} from '../../generic-ui/create-dialog/input-auto-complete/input-auto-complete.component'
import {describeLanguage, describeModule, describeSeason} from '../../utils/describe'
import {Observable, of} from 'rxjs'
import {FormInput} from '../../generic-ui/create-dialog/form-input'
import {mapOpt, zip5} from '../../utils/optional'
import {parseModule, parseNumber, parseSemesterIndex} from '../../utils/parser'
import {Submodule, SubmoduleAtom} from '../../models/submodule'
import {Module} from '../../models/module'
import {ModuleApiService} from '../../http/module-api.service'
import {allSemesterIndices} from '../../models/semester-index'
import {allLanguages, Language} from '../../models/language'
import {allSeasons, Season} from '../../models/season'

export interface SubmoduleProtocol {
  module: string
  label: string
  abbreviation: string
  recommendedSemester: number
  credits: number
  descriptionUrl: string
  language: Language
  season: Season
}

type Lang = { value: Language }

type Seas = { value: Season }

@Injectable({
  providedIn: 'root'
})
export class SubmoduleService {

  private readonly label: TextInput
  private readonly abbreviation: TextInput
  private readonly module: AutoCompleteInput<Module>
  private readonly recommendedSemester: AutoCompleteInput<number>
  private readonly credits: NumberInput
  private readonly language: AutoCompleteInput<Lang>
  private readonly season: AutoCompleteInput<Seas>
  private readonly descriptionUrl: URLInput

  constructor(
    private readonly http: SubmoduleApiService,
    private readonly moduleService: ModuleApiService,
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
    this.module = ({
      label: 'Modul',
      attr: 'module',
      required: true,
      disabled: false,
      show: describeModule,
      kind: 'auto-complete',
      data: moduleService.modules()
    })
    this.recommendedSemester = ({
      label: 'Fachsemester',
      attr: 'recommendedSemester',
      required: true,
      disabled: false,
      show: s => s.toString(),
      kind: 'auto-complete',
      data: of(allSemesterIndices())
    })
    this.language = ({
      label: 'Sprache',
      attr: 'language',
      required: true,
      disabled: false,
      show: l => describeLanguage(l.value),
      kind: 'auto-complete',
      data: of(allLanguages().map(l => ({value: l})))
    })
    this.season = ({
      label: 'Angeboten in',
      attr: 'season',
      required: true,
      disabled: false,
      show: s => describeSeason(s.value),
      kind: 'auto-complete',
      data: of(allSeasons().map(s => ({value: s})))
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

  submodules = (): Observable<SubmoduleAtom[]> =>
    this.http.submodules()

  delete = (m: SubmoduleAtom): Observable<SubmoduleAtom> =>
    of(m)

  create = (p: SubmoduleProtocol): Observable<Submodule> =>
    of({...p, id: 'random uuid'})

  update = (p: SubmoduleProtocol, id: string): Observable<Submodule> =>
    of({...p, id})

  createInputs = (): FormInput[] => [
    this.label,
    this.abbreviation,
    this.module,
    this.recommendedSemester,
    this.credits,
    this.language,
    this.season,
    this.descriptionUrl
  ]

  updateInputs = (m: SubmoduleAtom): FormInput[] => [
    {...this.label, initialValue: m.label},
    {...this.abbreviation, initialValue: m.abbreviation},
    {...this.module, initialValue: ms => ms.find(_ => _.id === m.module.id), disabled: true},
    {...this.recommendedSemester, initialValue: rrs => rrs.find(rs => rs === m.recommendedSemester)},
    {...this.credits, initialValue: m.credits, disabled: true},
    {...this.language, initialValue: ls => ls.find(l => l.value === m.language)},
    {...this.season, initialValue: ss => ss.find(s => s.value === m.season)},
    {...this.descriptionUrl, initialValue: m.descriptionUrl}
  ]

  parseLang = (s: any): Lang | undefined => {
    const l = (s as Lang)?.value !== undefined
    return l ? s.value : undefined
  }

  parseSeas = (s: any): Seas | undefined => {
    const l = (s as Seas)?.value !== undefined
    return l ? s.value : undefined
  }

  parseProtocol = (attrs: { [p: string]: string }): SubmoduleProtocol | undefined =>
    mapOpt(
      zip5(
        parseModule(attrs.module),
        parseSemesterIndex(attrs.recommendedSemester),
        this.parseLang(attrs.language),
        this.parseSeas(attrs.season),
        parseNumber(attrs.credits),
      ),
      ([m, rs, l, s, c]) => ({
        label: attrs.label,
        abbreviation: attrs.abbreviation,
        credits: c,
        module: m.id,
        descriptionUrl: attrs.descriptionUrl,
        language: l.value,
        season: s.value,
        recommendedSemester: rs
      })
    )

  createProtocol = (m: SubmoduleAtom, attrs: { [p: string]: string }): SubmoduleProtocol | undefined =>
    this.parseProtocol({
      ...attrs,
      credits: m.credits.toString(),
      module: JSON.parse(JSON.stringify(m.module))
    })
}

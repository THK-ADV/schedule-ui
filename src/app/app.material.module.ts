import { NgModule } from '@angular/core'
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
    exports: [
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule
    ]
})
export class ScheduleMaterialModule {
}


/**  Copyright 2019 Google Inc. All Rights Reserved.
 Use of this source code hasStatus governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license */

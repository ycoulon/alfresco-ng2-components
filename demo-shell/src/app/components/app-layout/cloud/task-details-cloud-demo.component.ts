/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormModel } from '@alfresco/adf-core';

@Component({
    templateUrl: './task-details-cloud-demo.component.html',
    styleUrls: ['./task-details-cloud-demo.component.scss']
})
export class TaskDetailsCloudDemoComponent {

    taskId: string;
    appName: string;
    readOnly = false;

    formDefinition;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.route.params.subscribe((params) => {
            this.taskId = params.taskId;
        });
        this.route.parent.params.subscribe((params) => {
            this.appName = params.appName;
        });

        this.formDefinition = new FormModel({
            "id": "text-form",
            "name": "test-start-form",
            "description": "",
            "version": 0,
            "tabs": [],
            "fields": [
                {
                    "type": "container",
                    "id": "1511517333638",
                    "name": "Label",
                    "tab": null,
                    "fieldType": "ContainerRepresentation",
                    "fields": {
                        "1": [
                            {
                                "type": "text",
                                "id": "texttest",
                                "name": "texttest",
                                "fieldType": "FormFieldRepresentation",
                                "colspan": 1,
                                "params": {
                                    "existingColspan": 2,
                                    "maxColspan": 6,
                                    "inputMaskReversed": true,
                                    "inputMask": "0#",
                                    "inputMaskPlaceholder": "(0-9)"
                                },
                                "visibilityCondition": null,
                                "placeholder": "text",
                                "value": null,
                                "required": false,
                                "minLength": 0,
                                "maxLength": 0,
                                "regexPattern": null
                            }
                        ],
                        "2": []
                    },
                    "numberOfColumns": 2
                }
            ],
            "outcomes": [],
            "metadata": {
                "property1": "value1",
                "property2": "value2"
            },
            "variables": [
                {
                    "name": "variable1",
                    "type": "string",
                    "value": "value1"
                },
                {
                    "name": "variable2",
                    "type": "string",
                    "value": "value2"
                }
            ]
        });
        this.formDefinition.taskId = this.taskId;
    }

    onGoBack() {
        this.router.navigate([`/cloud/${this.appName}/`]);

    }
}

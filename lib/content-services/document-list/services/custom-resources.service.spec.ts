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

import { AlfrescoApiServiceMock, AppConfigService,
    StorageService, LogService, PaginationModel, AlfrescoApiService, AppConfigServiceMock, CoreModule, setupTestBed } from '@alfresco/adf-core';
import { CustomResourcesService } from './custom-resources.service';
import { RecordCategoryPaging } from '@alfresco/js-api';

const fakeNode: string = '999-001';
const fakeResponse = { 'name': 'fake-name'};
const fakeErrorMessage = { message: 'ERROR-FAKE' };

describe('CustomResourcesService', () => {

    let service: CustomResourcesService;
    let alfrescoApiService: AlfrescoApiService;
    let pagination = new PaginationModel;
    let logService: LogService;
    const filePlanServiceMock = jasmine.createSpyObj(alfrescoApiService.getInstance().gsCore.fileplansApi);

    setupTestBed({
      imports: [
          CoreModule.forRoot()
      ]
    });

    beforeEach(() => {
      logService = new LogService(new AppConfigServiceMock(null));
      alfrescoApiService = new AlfrescoApiServiceMock(new AppConfigService(null), new StorageService());
      service = new CustomResourcesService(alfrescoApiService, logService);
    });

    it('should return the RecordCategoryPaging updated when got the record category', (done) => {
        spyOn(filePlanServiceMock, 'getFilePlanCategories')
          .and.returnValue(Promise.resolve(fakeResponse));

        service.loadFilePlan(fakeNode, pagination).subscribe((result: RecordCategoryPaging) => {
          expect(result.list.entries);
          done();
        });
    });
    it('should log the error message when failed to get the record categories', (done) => {
        spyOn(filePlanServiceMock, 'getFilePlanCategories')
          .and.returnValue(Promise.reject(fakeErrorMessage));
        spyOn(logService, 'error');

        service.loadFilePlan(fakeNode, pagination).subscribe(
          () => { },
          () => {
            expect(logService.error).toHaveBeenCalled();
            done();
          });
    });
});

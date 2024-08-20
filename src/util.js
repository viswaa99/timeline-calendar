import moment from 'moment';

const template = {
  _item_id: 'MUT-0006',
  Name: 'cZCZCZCZCZc  -  Found Issue',
  _priority_name: 'Critical',
  _status_name: 'Found Issue',
  _modified_at: '2024-06-04T05:15:43Z',
  _created_at: '2023-08-28T11:17:34Z',
  _id: 'MUT-0006',
  _category: 'NotStarted',
  _status_id: 'Status_0001_New',
  _priority_id: 'Critical',
  _start_date: '2024-07-27T00:30:00Z America/Los_Angeles',
  DueDate: '2024-07-30T21:49:00Z America/Los_Angeles',
};

export function utcToMs(date){
return moment(date).utc().valueOf();
}

export const FIELDS = [
  {
    Id: '_item_id',
    Name: 'Item Id',
    Type: 'Text',
    IsSystemField: true,
    Model: 'testboard',
    Widget: null,
    Required: false,
    IsInternal: false,
    IsComputedField: false,
  },
  {
    Id: 'Name',
    Name: 'Title',
    Type: 'Text',
    IsSystemField: true,
    Model: 'testboard',
    Widget: null,
    Required: false,
    IsInternal: false,
    IsComputedField: true,
  },
  {
    Id: 'AssignedTo',
    Name: 'Assignee',
    Type: 'User',
    IsSystemField: true,
    Model: 'testboard',
    Widget: null,
    Required: false,
    IsInternal: false,
    SourceFlowId: 'User',
    SourceFlowType: 'User',
    IsComputedField: false,
  },
  {
    Id: '_status_name',
    Name: 'Status',
    Type: 'Text',
    IsSystemField: true,
    Model: 'testboard',
    Widget: null,
    Required: false,
    IsInternal: false,
    IsComputedField: false,
  },
  {
    Id: '_priority_name',
    Name: 'Priority',
    Type: 'Text',
    IsSystemField: true,
    Model: 'testboard',
    Widget: null,
    Required: false,
    IsInternal: false,
    IsComputedField: false,
  }
];

export function makeData(value){
const data = [];
for (let i = 1; i <= value; i++) {
  const obj = { ...template };
  const id = `MUT-${i.toString().padStart(5, '0')}`;
  obj['_item_id'] = id;
  obj['_id'] = id;
  data.push(obj);
}
return JSON.stringify(data);
}



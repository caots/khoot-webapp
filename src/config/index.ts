export const REACT_APP_API_ENDPOINT = process.env.API_ENDPOINT;

export const STORAGE_KEY = {
  ACCESS_TOKEN: 'access_token',
  ROLE: 'role',
  USER_INFO: 'user_info'
};

export const PAGE_SIZE = {
  ASSESMENT: 10
};

export const ASSESSMENT_STATUS = {
  INACTIVE: {
    key: 0,
    value: `Inactivate`
  },
  ACTIVE: {
    key: 1,
    value: `Activate`
  }
};

export const CRUD_ACTIONS = {
  create: 1,
  update: 2,
  view: 3,
  delete: 4
};

export const QUESTION_TYPE = {
  MULTICHOICE: 1,
  TEXT: 2
}

export const SELECT_QUESTION_TYPE = [
  {id: 1, title: 'Multi choice'},
  {id: 2, title: 'Text area'},
]

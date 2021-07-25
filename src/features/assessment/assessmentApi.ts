import { axiosMethod, axiosRequest, makeQuery } from 'src/utils/handleRequestServer';
import { REACT_APP_API_ENDPOINT } from 'src/config';
import _ from 'lodash';
import SearchAssessment from 'src/model/searchParams';
import Assessment from 'src/model/assessment';

class AssessmentApi {
  assessmentApiEndpoint: string;

  constructor() {
    this.assessmentApiEndpoint = `${REACT_APP_API_ENDPOINT}assessment`;
  }

  getAllAssessment(filter: SearchAssessment, token: string) {
    const query = makeQuery(filter);
    return axiosRequest(this.assessmentApiEndpoint + `/list${query}`, axiosMethod.GET, token, null);
  }

  getAssessmentById(assessmentId: number, token: string) {
    return axiosRequest(
      this.assessmentApiEndpoint + `/${assessmentId}`,
      axiosMethod.GET,
      token,
      null
    );
  }

  createAssessment(asessment: Assessment, token: string) {
    return axiosRequest(
      this.assessmentApiEndpoint + `/`,
      axiosMethod.POST,
      token,
      asessment
    );
  }

  updateAssessment(asessment: Assessment, token: string) {
    return axiosRequest(
      this.assessmentApiEndpoint + `/`,
      axiosMethod.PUT,
      token,
      asessment
    );
  }

  updateStatus(assessment: any, token: string) {
    return axiosRequest(this.assessmentApiEndpoint + `/status`, axiosMethod.PUT, token, {
      ...assessment
    });
  }

  deleteAssessment(id: number, token: string) {
    return axiosRequest(this.assessmentApiEndpoint + `/${id}`, axiosMethod.DELETE, token, null);
  }
}

export default new AssessmentApi();

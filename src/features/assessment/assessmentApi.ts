import { axiosMethod, axiosRequest, makeQuery } from 'src/utils/handleRequestServer';
import { REACT_APP_API_ENDPOINT } from 'src/config';
import _ from 'lodash';
import SearchAssessment from 'src/model/searchParams';
import Assessment from 'src/model/assessment';

class AssessmentApi {
  assessmentApiEndpoint: string;
  imageApiEndpoint: string;

  constructor() {
    this.assessmentApiEndpoint = `${REACT_APP_API_ENDPOINT}assessment`;
    this.imageApiEndpoint = `${REACT_APP_API_ENDPOINT}image`;
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

  uploadImage = (file: any, token: string) => {
    const formData = new FormData();
    formData.append(`file`, file);
    return axiosRequest(this.imageApiEndpoint + `/upload`, axiosMethod.POST, token, formData);
  };

}

export default new AssessmentApi();

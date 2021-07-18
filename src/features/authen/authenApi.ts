import { REACT_APP_API_ENDPOINT } from 'src/config';
import { AuthLogin } from 'src/model/user';
import { axiosMethod, axiosRequest } from 'src/utils/handleRequestServer';

class AuthenApi {
  authenApiEndpoint: string;

  constructor() {
    this.authenApiEndpoint = `${REACT_APP_API_ENDPOINT}user`;
  }

  register(data: any) {
    const { email, password, full_name, phone, address } = data;
    return axiosRequest(this.authenApiEndpoint + '/signup', axiosMethod.POST, '', {
      full_name,
      email,
      password,
      phone,
      address
    });
  }

  login(data: AuthLogin) {
    const { email, password, remember_me } = data;
    return axiosRequest(this.authenApiEndpoint + '/login', axiosMethod.POST, '', {
      email,
      password,
      remember_me
    });
  }

  getInformation(data: any) {
    const { token } = data;
    return axiosRequest(this.authenApiEndpoint, axiosMethod.GET, token, '');
  }

  changePassword({ token, oldPassword, newPassword }: any) {
    return axiosRequest(this.authenApiEndpoint + '/password', axiosMethod.POST, token, {
      old_pass: oldPassword,
      new_pass: newPassword
    });
  }
}

export default new AuthenApi();

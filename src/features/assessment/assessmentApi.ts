import { axiosMethod, axiosRequest, makeQuery } from 'src/utils/handleRequestServer';
import { REACT_APP_API_ENDPOINT } from 'src/config';
import _ from 'lodash';
import SearchAssessment from 'src/model/searchParams';

class ProductApi {
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

  // createProduct({ product, token }) {
  //   return axiosRequest(
  //     this.productApiEndpoint + `/`,
  //     axiosMethod.POST,
  //     token,
  //     _.omit(
  //       {
  //         ...product,
  //         web_price: product.webPrice,
  //         category_id: product.categoryId,
  //         out_of_stock: 0
  //       },
  //       ['webPrice', 'categoryId']
  //     )
  //   );
  // }

  // updateProduct({ product, token }) {
  //   return axiosRequest(
  //     this.productApiEndpoint + `/`,
  //     axiosMethod.PUT,
  //     token,
  //     _.omit(
  //       {
  //         ...product,
  //         web_price: product.webPrice,
  //         category_id: product.categoryId
  //       },
  //       [
  //         'webPrice',
  //         'categoryId',
  //         'product_category_name',
  //         'updated_at',
  //         'created_at',
  //         'number_of_likes',
  //         'viewd',
  //         'is_deleted',
  //         'type',
  //         'images'
  //       ]
  //     )
  //   );
  // }

  // updateStatus({ product, token }) {
  //   return axiosRequest(this.productApiEndpoint + `/status`, axiosMethod.PUT, token, {
  //     ...product
  //   });
  // }

  // updateStock({ product, token }) {
  //   const data = { id: product.id, out_of_stock: product.outOfStock };
  //   return axiosRequest(this.productApiEndpoint + `/out-of-stock`, axiosMethod.PUT, token, data);
  // }

  // deleteProduct({ productId, token }) {
  //   return axiosRequest(this.productApiEndpoint + `/${productId}`, axiosMethod.DELETE, token, null);
  // }
}

export default new ProductApi();

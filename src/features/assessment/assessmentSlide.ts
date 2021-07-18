import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AssessmentApi from './assessmentApi';
import { MESSAGES } from 'src/config/message';
import { getToken } from 'src/utils/authService';
import SearchAssessment from 'src/model/searchParams';
import { STORAGE_KEY } from 'src/config';

export const fetchGetAllAssessment = createAsyncThunk(
  'assessment/fetchGetAllAssessment',
  async (params: SearchAssessment, { rejectWithValue }) => {
    try {
      const response = await AssessmentApi.getAllAssessment(
        params,
        getToken(STORAGE_KEY.ACCESS_TOKEN)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchGetAssessmentById = createAsyncThunk(
  'assessment/fetchGetAssessmentById',
  async (assessmentId: number, { rejectWithValue }) => {
    try {
      const response = await AssessmentApi.getAssessmentById(
        assessmentId,
        getToken(STORAGE_KEY.ACCESS_TOKEN)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

// export const fetchCreateAssessment = createAsyncThunk(
//   'product/fetchCreateProduct',
//   async ({ product, filter }, { rejectWithValue }) => {
//     try {
//       const productResult = (
//         await AssessmentApi.createProduct({ product, token: cookies.get('token') })
//       ).data;
//       const productResults = (
//         await AssessmentApi.getAllProducts({
//           ...filter,
//           token: cookies.get('token')
//         })
//       ).data;

//       return { currentProduct: productResult, products: productResults };
//     } catch (error) {
//       return rejectWithValue(error?.response?.data?.message || error?.response || error);
//     }
//   }
// );

// export const fetchUpdateAssessment = createAsyncThunk(
//   'product/fetchUpdateProduct',
//   async ({ product, filter }, { rejectWithValue }) => {
//     try {
//       const productResult = (
//         await AssessmentApi.updateProduct({ product, token: cookies.get('token') })
//       ).data;
//       const productResults = (
//         await AssessmentApi.getAllProducts({
//           ...filter,
//           token: cookies.get('token')
//         })
//       ).data;

//       return { currentProduct: productResult, products: productResults };
//     } catch (error) {
//       return rejectWithValue(error?.response?.data?.message || error?.response || error);
//     }
//   }
// );

// export const fetchUpdateStatusAssessment = createAsyncThunk(
//   'product/fetchUpdateStatusProduct',
//   async (product, { rejectWithValue }) => {
//     try {
//       const response = await AssessmentApi.updateStatus({ product, token: cookies.get('token') });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error?.response?.data?.message || error?.response || error);
//     }
//   }
// );

// export const fetchDeleteAssessment = createAsyncThunk(
//   'product/fetchDeleteProduct',
//   async ({ productId, filter }, { rejectWithValue }) => {
//     try {
//       await AssessmentApi.deleteProduct({ productId, token: cookies.get('token') });
//       const products = (await AssessmentApi.getAllProducts({ ...filter, token: cookies.get('token') }))
//         .data;

//       return products;
//     } catch (error) {
//       return rejectWithValue(error?.response?.data?.message || error?.response || error);
//     }
//   }
// );

const initialState = {
  assessmentCount: 0,
  assessments: [],
  currentAssessment: null,

  isFetchingGetAllAssessment: false,
  fetchGetAllAssessmentsMsg: null,

  isFetchingGetAssessmentById: false,

  isFetchingCreateAssessment: false,
  fetchCreateAssessmentMsg: null,

  isFetchingCreateAssessmentImage: false,
  fetchCreateAssessmentImageMsg: null,

  isFetchingUpdateAssessment: false,
  fetchUpdateAssessmentMsg: null,

  isFetchingUpdateStatusAssessment: false,
  fetchUpdateStatusAssessmentMsg: null,

  isFetchingDeleteAssessment: false,
  fetchDeleteAssessmentMsg: null
};

export const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    clearMsg(state: any, action) {
      if (
        [
          `isFetchingCreateAssessment`,
          `isFetchingUpdateAssessment`,
          `isFetchingUpdateStatusAssessment`,
          `fetchUpdateStockMsg`,
          `fetchDeleteAssessmentMsg`
        ].includes(action.payload)
      ) {
        state[action.payload] = null;
      }
    }
  },

  extraReducers: (builder) => {
    builder
      // Handle get all assessment
      .addCase(fetchGetAllAssessment.rejected, (state: any, action) => {
        state.fetchGetAllAssessmentsMsg = action.payload || action.error.message;
        state.isFetchingGetAllAssessment = false;
        state.assessmentCount = 0;
        state.assessments = [];
      })
      .addCase(fetchGetAllAssessment.pending, (state: any) => {
        state.fetchGetAllAssessmentsMsg = null;
        state.isFetchingGetAllAssessment = true;
        state.assessmentCount = 0;
        state.assessments = [];
      })
      .addCase(fetchGetAllAssessment.fulfilled, (state: any, action) => {
        state.fetchGetAllAssessmentsMsg = null;
        state.isFetchingGetAllAssessment = false;
        state.assessmentCount = action.payload.total;
        state.assessments = action.payload.results;
      })

      // Handle get product by id
      .addCase(fetchGetAssessmentById.pending, (state: any) => {
        state.isFetchingGetAssessmentById = true;
      })
      .addCase(fetchGetAssessmentById.fulfilled, (state: any, action) => {
        state.isFetchingGetAssessmentById = false;
        state.currentAssessment = action.payload;
      });

    // // Handle create assessment
    // .addCase(fetchCreateProduct.rejected, (state, action) => {
    //   state.fetchCreateProductMsg = action.payload || action.error.message;
    //   state.isFetchingCreateProduct = false;
    // })
    // .addCase(fetchCreateProduct.pending, (state) => {
    //   state.fetchCreateProductMsg = null;
    //   state.isFetchingCreateProduct = true;
    // })
    // .addCase(fetchCreateProduct.fulfilled, (state, action) => {
    //   state.fetchCreateProductMsg = MESSAGES.CREATE_SUCCESS;
    //   state.isFetchingCreateProduct = false;
    //   state.currentProduct = action.payload.currentProduct;
    //   state.products = action.payload.products.results;
    //   state.productsCount = action.payload.products.total;
    // })

    // // Handle update assessment
    // .addCase(fetchUpdateProduct.rejected, (state, action) => {
    //   state.fetchUpdateProductMsg = action.payload || action.error.message;
    //   state.isFetchingUpdateProduct = false;
    // })
    // .addCase(fetchUpdateProduct.pending, (state) => {
    //   state.fetchUpdateProductMsg = null;
    //   state.isFetchingUpdateProduct = true;
    // })
    // .addCase(fetchUpdateProduct.fulfilled, (state, action) => {
    //   state.fetchUpdateProductMsg = MESSAGES.UPDATE_SUCCESS;
    //   state.isFetchingUpdateProduct = false;
    //   state.currentProduct = action.payload.currentProduct;
    //   state.products = action.payload.products.results;
    //   state.productsCount = action.payload.products.total;
    // })

    // // Handle update status assessment
    // .addCase(fetchUpdateStatusProduct.rejected, (state, action) => {
    //   state.fetchUpdateStatusProductMsg = action.payload || action.error.message;
    //   state.isFetchingUpdateStatusProduct = false;
    // })
    // .addCase(fetchUpdateStatusProduct.pending, (state) => {
    //   state.fetchUpdateStatusProductMsg = null;
    //   state.isFetchingUpdateStatusProduct = true;
    // })
    // .addCase(fetchUpdateStatusProduct.fulfilled, (state, action) => {
    //   state.fetchUpdateStatusProductMsg = MESSAGES.UPDATE_SUCCESS;
    //   state.isFetchingUpdateStatusProduct = false;
    //   state.currentProduct = action.payload;
    //   state.products = state.products.map((product) => {
    //     if (product.id === action.payload.id) {
    //       return { ...product, ...action.payload };
    //     } else {
    //       return product;
    //     }
    //   });
    // })

    // // Handle delete assessment
    // .addCase(fetchDeleteProduct.rejected, (state, action) => {
    //   state.fetchDeleteProductMsg = action.payload || action.error.message;
    //   state.isFetchingDeleteProduct = false;
    // })
    // .addCase(fetchDeleteProduct.pending, (state) => {
    //   state.fetchDeleteProductMsg = null;
    //   state.isFetchingDeleteProduct = true;
    // })
    // .addCase(fetchDeleteProduct.fulfilled, (state, action) => {
    //   state.fetchDeleteProductMsg = MESSAGES.DELETE_SUCCESS;
    //   state.isFetchingDeleteProduct = false;
    //   state.products = action.payload.results;
    //   state.productsCount = action.payload.total;
    // });
  }
});

export const { clearMsg } = assessmentSlice.actions;
export default assessmentSlice.reducer;

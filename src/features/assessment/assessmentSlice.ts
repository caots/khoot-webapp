import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AssessmentApi from './assessmentApi';
import { MESSAGES } from 'src/config/message';
import { getToken } from 'src/utils/authService';
import SearchAssessment from 'src/model/searchParams';
import { STORAGE_KEY } from 'src/config';
import Assessment from 'src/model/assessment';
import assessment from 'src/pages/assessment';

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

export const fetchUpdateStatusAssessment = createAsyncThunk(
  'assessment/fetchUpdateStatusAssessment',
  async (assessment: any, { rejectWithValue }) => {
    try {
      const response = await AssessmentApi.updateStatus(assessment, getToken(STORAGE_KEY.ACCESS_TOKEN));
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchDeleteAssessment = createAsyncThunk(
  'assessment/fetchDeleteAssessment',
  async ({ id, filter }: any, { rejectWithValue }) => {
    try {
      await AssessmentApi.deleteAssessment(id, getToken(STORAGE_KEY.ACCESS_TOKEN));
      const assessments = (await AssessmentApi.getAllAssessment(filter, getToken(STORAGE_KEY.ACCESS_TOKEN)))
        .data;

      return assessments;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

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
      })

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

      // Handle update status assessment
      .addCase(fetchUpdateStatusAssessment.rejected, (state: any, action) => {
        state.fetchUpdateStatusAssessmentMsg = action.payload || action.error.message;
        state.isFetchingUpdateStatusAssessment = false;
      })
      .addCase(fetchUpdateStatusAssessment.pending, (state: any) => {
        state.fetchUpdateStatusAssessmentMsg = null;
        state.isFetchingUpdateStatusAssessment = true;
      })
      .addCase(fetchUpdateStatusAssessment.fulfilled, (state: any, action) => {
        state.fetchUpdateStatusAssessmentMsg = MESSAGES.UPDATE_SUCCESS;
        state.isFetchingUpdateStatusAssessment = false;
        state.currentProduct = action.payload;
        state.assessments = state.assessments.map((assessment: Assessment) => {
          if (assessment.id === action.payload.id) {
            return { ...assessment, ...action.payload };
          } else {
            return assessment;
          }
        })
      })

      //Handle delete assessment
      .addCase(fetchDeleteAssessment.rejected, (state: any, action) => {
        state.fetchDeleteAssessmentMsg = action.payload || action.error.message;
        state.isFetchingDeleteAssessment = false;
      })
      .addCase(fetchDeleteAssessment.pending, (state: any) => {
        state.fetchDeleteAssessmentMsg = null;
        state.isFetchingDeleteAssessment = true;
      })
      .addCase(fetchDeleteAssessment.fulfilled, (state: any, action) => {
        state.fetchDeleteAssessmentMsg = MESSAGES.DELETE_SUCCESS;
        state.isFetchingDeleteAssessment = false;
        state.assessments = action.payload.results;
        state.assessmentCount = action.payload.total;
      });
  }
});

export const { clearMsg } = assessmentSlice.actions;
export default assessmentSlice.reducer;

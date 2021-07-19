import { useState } from 'react';
import { Box, Button, Card, CardContent, Grid } from '@material-ui/core';
import {
  FilterList as FilterIcon,
  ClearAll as ClearIcon,
  AddCircleOutline as AddIcon
} from '@material-ui/icons';
import SearchTextField from 'src/components/searchTextField';
import SearchAssessment from 'src/model/searchParams';

const AssessmentToolbar = ({ filter, setFilter, handleCreateButton }: any) => {
  const initialFilter: SearchAssessment = {
    title: '',
    from_date: '',
    to_date: ''
  };
  const [curFilter, setCurFilter] = useState({ ...filter });

  const resetFilter = () => {
    setCurFilter({ ...curFilter, ...initialFilter });
    setFilter({ ...filter, ...initialFilter });
  };

  const submitFilter = () => {
    setFilter({ ...filter, ...curFilter });
  }

  return (
    <Box>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={6} md={6}>
              <SearchTextField
                placeholder="Search by title"
                size="small"
                value={curFilter.name}
                onChange={(e: any) => setCurFilter({ ...curFilter, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={6} container spacing={3} justifyContent="flex-end">
              <Grid item>
                <Button
                  fullWidth
                  variant="contained"
                  endIcon={<FilterIcon />}
                  onClick={submitFilter}
                >
                  Search
                </Button>
              </Grid>
              <Grid item>
                <Button fullWidth variant="outlined" endIcon={<ClearIcon />} onClick={resetFilter}>
                  Clear
                </Button>
              </Grid>
              <Grid item>
                <Button
                  fullWidth
                  color="secondary"
                  variant="contained"
                  endIcon={<AddIcon />}
                  onClick={handleCreateButton}
                >
                  Create
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AssessmentToolbar;

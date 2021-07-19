import Proptypes from 'prop-types';
import { TextField, InputAdornment, SvgIcon } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';

const SearchTextField = ({ placeholder, size, value, onChange }: any) => (
  <TextField
    size={size}
    fullWidth
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SvgIcon fontSize="small" color="action">
            <SearchIcon />
          </SvgIcon>
        </InputAdornment>
      )
    }}
    placeholder={placeholder}
    variant="outlined"
    onChange={onChange}
    value={value}
  />
);

export default SearchTextField;

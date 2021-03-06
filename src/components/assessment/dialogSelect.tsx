import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  Button,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
  Grid,
  DialogContent
} from '@material-ui/core';

const DialogSelect = ({ title, open, setOpen, action, data, defaultValue }: any) => {
  const [value, setValue] = useState(defaultValue || data[0].key);

  const handleRadioChange = (event: any) => {
    setValue(parseInt(event.target.value));
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <RadioGroup name="status" value={value} onChange={handleRadioChange}>
                {data.map((item: any, index: number) => (
                  <FormControlLabel
                    key={index}
                    value={item.key}
                    label={item.value}
                    control={<Radio />}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth onClick={() => setOpen(false)}>
              Hủy
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth onClick={() => action(value)}>
              Lưu
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSelect;

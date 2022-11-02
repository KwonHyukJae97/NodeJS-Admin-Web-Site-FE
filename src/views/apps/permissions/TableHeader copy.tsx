// ** React Imports
import { useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form';

interface TableHeaderProps {
  value: string;
  handleFilter: (val: string) => void;
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { value, handleFilter } = props;

  const defaultTypes = ['CREATE', 'READ', 'UPDATE', 'DELETE'];

  // ** State
  const [open, setOpen] = useState<boolean>(false),
    [checked, setChecked] = useState([]),
    [checkedValues, setCheckedValues] = useState(defaultTypes);

  // ** Hooks
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleDialogToggle = () => {
    setOpen(!open);
  };

  const onSubmit = (value) => {
    setOpen(false);

    console.log('handleFilter:', value);
    console.log('val:', value);
  };

  // 권한타입
  // const handleGrantType = (value) => {
  //   handleFilter(value);
  //   setValue("grantType", value);
  //   console.log('handleFilter:', checked);
  // };

  // function handleSelect(checkedTypes) {
  //   const types = getValues().types;
  //   const newTypes = types?.includes(checkedTypes)
  //     ? types?.filter((name) => name !== checkedTypes)
  //     : [...(types ?? []), checkedTypes];

  //   // const newTypes = checkedValues?.includes(checkedValues)
  //   //   ? checkedValues?.filter((name) => name !== checkedTypes)
  //   //   : [...(checkedValues ?? []), checkedTypes];
  //   // setCheckedValues(newTypes);

  //   return newTypes;
  // }

  function handleSelect(checkedType) {
    // could do it like this as well:

    // const names = getValues().names;
    // const newNames = names?.includes(checkedName)
    //   ? names?.filter(name => name !== checkedName)
    //   : [...(names ?? []), checkedName];

    const newTypes = checkedValues?.includes(checkedType)
      ? checkedValues?.filter((name) => name !== checkedType)
      : [...(checkedValues ?? []), checkedType];
    setCheckedValues(newTypes);

    return newTypes;
  }

  return (
    <>
      <Box
        sx={{
          p: 5,
          pb: 3,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TextField
          size="small"
          value={value}
          sx={{ mr: 4, mb: 2.5 }}
          placeholder="Search Permission"
          onChange={(e) => handleFilter(e.target.value)}
        />
        <Button sx={{ mb: 2.5 }} variant="contained" onClick={handleDialogToggle}>
          Add Permission
        </Button>
      </Box>
      <Dialog fullWidth maxWidth="sm" onClose={handleDialogToggle} open={open}>
        <DialogTitle sx={{ pt: 12, mx: 'auto', textAlign: 'center' }}>
          <Typography variant="h4" component="span" sx={{ mb: 2 }}>
            Add New Permission
          </Typography>
          <Typography variant="body2">Permissions you may use and assign to your users.</Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 12, mx: 'auto' }}>
          <Box component="form" sx={{ mt: 4 }} onSubmit={handleSubmit((data) => console.log(data))}>
            <FormGroup sx={{ mb: 1 }}>
              <Controller
                name="menuName"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    value={value}
                    label="Permission Name"
                    onChange={onChange}
                    error={Boolean(errors.name)}
                    placeholder="Enter Permission Name"
                  />
                )}
              />
              {errors.name && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  Please enter a valid permission name
                </FormHelperText>
              )}
            </FormGroup>
            <Typography variant="body2">Grant Type</Typography>

            {['CREATE', 'READ', 'UPDATE', 'DELETE'].map((type) => (
              <FormControlLabel
                control={
                  <Controller
                    name="grantType"
                    render={({ field: { onChange: onCheckChange } }) => {
                      return (
                        <Checkbox
                          checked={checkedValues.includes(type)}
                          onChange={() => onCheckChange(handleSelect(type))}
                        />
                      );
                    }}
                    control={control}
                  />
                }
                key={type}
                label={type}
              />
            ))}

            {/* {checboxArray.map((checboxItem) => (
              <Controller
                name="grantType"
                control={control}
                key={checboxItem.name}
                render={({ field: { onChange, value } }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!value}
                        onChange={(event, item) => {
                          onChange(item);
                        }}
                        name={checboxItem.name}
                      />
                    }
                    label={checboxItem.label}
                  />
                )}
              />
            ))} */}

            {/* <FormControlLabel
              name="grantType"
              value="0"
              control={<Checkbox onChange={(e) => handleGrantType(e.target.value)} />}
              label="CREATE"
            />
            <FormControlLabel
              name="grantType"
              value="1"
              control={<Checkbox onChange={(e) => handleGrantType(e.target.value)} />}
              label="READ"
            />
            <FormControlLabel
              name="grantType"
              value="2"
              control={<Checkbox onChange={(e) => handleGrantType(e.target.value)} />}
              label="UPDATE"
            />
            <FormControlLabel
              name="grantType"
              value="3"
              control={<Checkbox onChange={(e) => handleGrantType(e.target.value)} />}
              label="DELETE"
            /> */}
            <Box className="demo-space-x" sx={{ '&>:last-child': { mr: 0 } }}>
              <Button size="large" type="submit" variant="contained">
                Create Permission
              </Button>
              <Button
                size="large"
                variant="outlined"
                color="secondary"
                onClick={handleDialogToggle}
              >
                Discard
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TableHeader;

import { Checkbox, Divider, FormControlLabel, FormGroup, Typography } from "@mui/material";
import { ClientListingsInput, EmploymentStatus, ExperienceLevel, WorkPlaceType } from 'common/models';
import theme from 'common/static/theme';
import React from 'react';
import CurrencyInput from 'react-currency-input-field';
import { UseFormGetValues, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';

type Props = {
  register: UseFormRegister<ClientListingsInput>
  watch: UseFormWatch<ClientListingsInput>
  setValue: UseFormSetValue<ClientListingsInput>
  getValues: UseFormGetValues<ClientListingsInput>
}

const FilterPanel: React.FC<Props> = ({ register, watch, setValue, getValues }) => {
  const handleButtonClick = (
    value: keyof typeof EmploymentStatus | keyof typeof WorkPlaceType | keyof typeof ExperienceLevel,
    type: 'employmentStatus' | 'workplaceTypes' | 'experienceLevels') => {
    const currValue = getValues(type)
    const itemIndex = currValue.findIndex((es) => es === value)
    if (itemIndex > -1) {
      currValue.splice(itemIndex, 1);
    } else {
      //@ts-ignore
      currValue.push(value);
    }
    setValue(type, currValue)
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", rowGap: "1rem", backgroundColor: 'white', padding: '2rem', borderRadius: '0.8rem' }}>
      <div style={{ display: "flex", flexDirection: "column", rowGap: "0.2rem" }}>
        <Typography
          variant="h6"
          fontWeight="bold"
        >Employment Status</Typography>
        <FormGroup>
          {(Object.keys(EmploymentStatus) as Array<keyof typeof EmploymentStatus>).map((key) => (
            <FormControlLabel key={key} control={
              <Checkbox
                onChange={() => handleButtonClick(key, 'employmentStatus')}
                checked={watch('employmentStatus').findIndex(es => es === key) > -1}
              />
            }
              label={EmploymentStatus[key]}
            />
          ))}
        </FormGroup>
      </div>
      <Divider />
      <div style={{ display: "flex", flexDirection: "column", rowGap: "0.2rem" }}>
        <Typography
          variant="h6"
          fontWeight="bold"
        >Workplace Type</Typography>
        <FormGroup>
          {(Object.keys(WorkPlaceType) as Array<keyof typeof WorkPlaceType>).map((key) => (
            <FormControlLabel key={key} control={
              <Checkbox
                onChange={() => handleButtonClick(key, 'workplaceTypes')}
                checked={watch('workplaceTypes').findIndex(wt => wt === key) > -1}
              />
            }
              label={WorkPlaceType[key]}
            />
          ))}
        </FormGroup>
      </div>
      <Divider />
      <div style={{ display: "flex", flexDirection: "column", rowGap: "0.2rem" }}>
        <Typography
          variant="h6"
          fontWeight="bold"
        >Experience Level</Typography>
        <FormGroup>
          {(Object.keys(ExperienceLevel) as Array<keyof typeof ExperienceLevel>).map((key) => (
            <FormControlLabel key={key} control={
              <Checkbox
                onChange={() => handleButtonClick(key, 'experienceLevels')}
                checked={watch('experienceLevels').findIndex(wt => wt === key) > -1}
              />
            }
              label={ExperienceLevel[key]}
            />
          ))}
        </FormGroup>
      </div>
      <Divider />
      <div style={{ display: "flex", flexDirection: "column", rowGap: "0.2rem" }}>
        <Typography
          variant="h6"
          fontWeight="bold"
        >Salary</Typography>
        <CurrencyInput
          placeholder="Annual Salary"
          decimalsLimit={2}
          prefix="£"
          style={{
            fontSize: "1.4rem",
            borderRadius: "8px",
            backgroundColor: theme.palette.grey[200],
            padding: '1.5rem',
            border: 'none',
            width: "200px",
          }}
          {...register('salary')}
        />
      </div>
    </div>
  )
}

export default FilterPanel
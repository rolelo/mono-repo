import React from 'react'
import { Typography, Button, Divider } from "@mui/material";
import theme from 'common/static/theme';
import { ClientListingsInput, EmploymentStatus, WorkPlaceType } from 'common/models';
import CurrencyInput from 'react-currency-input-field';
import { UseFormWatch, UseFormSetValue, UseFormRegister, UseFormGetValues } from 'react-hook-form';

type Props = {
  register: UseFormRegister<ClientListingsInput>
  watch: UseFormWatch<ClientListingsInput>
  setValue: UseFormSetValue<ClientListingsInput>
  getValues: UseFormGetValues<ClientListingsInput>
}

const FilterPanel: React.FC<Props> = ({ register, watch, setValue, getValues }) => {
  const handleButtonClick = (
    value: keyof typeof EmploymentStatus | keyof typeof WorkPlaceType,
    type: 'employmentStatus' | 'workplaceTypes') => {
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
    <div style={{ display: "flex", flexDirection: "column", rowGap: "1rem", padding: "0 8rem" }}>
      <Typography variant="h5" fontWeight="bold">Filters</Typography>
      <div style={{ display: "flex", flexDirection: "column", rowGap: "0.2rem" }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          style={{
            color: theme.palette.grey[400]
          }}>Employment Status</Typography>
        {(Object.keys(EmploymentStatus) as Array<keyof typeof EmploymentStatus>).map((key) => (
          <Button
            sx={{
              textAlign: "left",
              color: watch('employmentStatus').findIndex(es => es === key) > -1
                ? theme.palette.primary.main
                : "black",
              fontWeight: "bold",
              width: "fit-content"
            }}
            value={key}
            onClick={() => handleButtonClick(key, 'employmentStatus')}
            key={key}>
            {EmploymentStatus[key]}
          </Button>
        ))}
      </div>
      <Divider />
      <div style={{ display: "flex", flexDirection: "column", rowGap: "0.2rem" }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          style={{
            color: theme.palette.grey[400]
          }}>Workplace Type</Typography>
        {(Object.keys(WorkPlaceType) as Array<keyof typeof WorkPlaceType>).map((key) => (
          <Button
            sx={{
              textAlign: "left",
              color: watch('workplaceTypes').findIndex(wt => wt === key) > -1
                ? theme.palette.primary.main
                : "black",
              fontWeight: "bold",
              width: "fit-content"
            }}
            value={key}
            onClick={() => handleButtonClick(key, 'workplaceTypes')}
            key={key}>
            {WorkPlaceType[key]}
          </Button>
        ))}
      </div>
      <Divider />
      <div style={{ display: "flex", flexDirection: "column", rowGap: "0.2rem" }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          style={{
            color: theme.palette.grey[400]
          }}>Salary</Typography>
        <CurrencyInput
          placeholder="Annual Salary"
          decimalsLimit={2}
          prefix="£"
          style={{
            fontSize: "1.4rem",
            borderRadius: "8px",
            padding: '1rem',
            border: 'none',
            width: "100px",
          }}
          {...register('salary')}
        />
      </div>
    </div>
  )
}

export default FilterPanel
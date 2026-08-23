import { TextInput, TimePicker } from "@carbon/react"
import { DatePicker, DatePickerInput } from "@carbon/react/lib/components/DatePicker/next"

interface DateTimePickerParam {
  size?: 'sm' | 'md' | 'lg'
}

export const DateTimePicker = ({ size = 'md' } : DateTimePickerParam) => {
  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <DatePicker dateFormat="Y/m/d">
        <DatePickerInput id="date" size={size} placeholder="yyyy/mm/dd"></DatePickerInput>
      </DatePicker>
      <div style={{ width: '0.25rem' }}></div>
      <TimePicker id="time" size={size}>
      </TimePicker>
    </div>

    <div style={{ height: '1rem' }}></div>

    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'start', maxWidth: '16rem' }}>
      <TextInput style={{ maxWidth: '10rem' }} size={size} id="date-input" labelText hideLabel placeholder="YYYY/MM/DD"></TextInput>
      <TextInput style={{ maxWidth: '5rem' }} size={size} id="time" labelText hideLabel placeholder="HH:mm"></TextInput>
    </div>
    </>
  )
}
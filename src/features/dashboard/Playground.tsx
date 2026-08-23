import { useState } from "react"
import { SelectPickField } from "../../components/InputWithButton"
import type { DropdownItem } from "../../types/dropdownItem"
import { ComboBox, Stack } from "@carbon/react"
import { useDebounce } from "../../hooks/useDebounce"
import { useRolesLookup } from "../../hooks/roles"
import { DateTimePicker } from "../../components/DateTimePicker"

const Playground = () => {
  const [roleID, setRoleID] = useState('1')
  const [roleValue, setRoleValue] = useState<DropdownItem | null | undefined>()
  
  const [roleInputSearch, setRoleInputSearch] = useState('')
  const debouncedSearch = useDebounce(roleInputSearch, 300)
  const { data: roleRef, isLoading } = useRolesLookup({
    page: 1,
    size: 50,
    name: debouncedSearch,
  })

  const itemsList = roleRef?.map ?? []

  return (
    <Stack>
      <SelectPickField 
        value={roleID} 
        id="role-picker" 
        labelText="Role" 
        onSelect={(newID) => setRoleID(newID)} 
        hideLabel 
      />
      
      <div style={{ marginBottom: '1rem', marginTop: '1rem', width: '50%' }}>
        <p style={{ marginBottom: '1rem' }}>
          Selected Item: {roleValue ? `${roleValue.id} - ${roleValue.label}` : ''}<br />
          Input search: {roleInputSearch}
        </p>

        <ComboBox 
          id="role-select"
          placeholder={isLoading ? "Loading roles..." : "Select a role..."}
          // 5. Use safe fallback items list
          items={itemsList}
          onInputChange={(txt) => setRoleInputSearch(txt)}
          itemToString={(item) => (item ? item.label : '')}
          selectedItem={roleValue}
          onChange={({ selectedItem: newSelection }) => {
            setRoleValue(newSelection)
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }} />
      <DateTimePicker />
    </Stack>
  )
}

export default Playground
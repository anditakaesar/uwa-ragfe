import { OverflowMenuHorizontal } from "@carbon/icons-react";
import { IconButton, TextInput } from "@carbon/react";

interface InputWithButtonProps {
  id: string;
  labelText: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: () => void;
  buttonLabel?: string;
}

export const InputWithButton: React.FC<InputWithButtonProps> = ({
  id,
  labelText,
  placeholder = 'Type something...',
  value,
  onChange,
  onSubmit,
  buttonLabel = 'Submit',
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div
        style={{
          display: 'flex',
          alignContent: 'center',
          // backgroundColor: 'var(--cds-field-01, #f4f4f4)',
          // borderBottom: '1px solid var(--cds-border-strong-01, #8d8d8d)',
          borderRadius: '0px',
        }}
      >
        <div style={{
          flex: '0 0 10rem',
        }}>
          <TextInput
            id={id}
            labelText={labelText}
            hideLabel
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
        </div>
        
        <IconButton
          label={buttonLabel}
          // kind="ghost"
          size="md"
          align="bottom-end"
          onClick={onSubmit}
        >
          <OverflowMenuHorizontal />
        </IconButton>
        
        <div style={{alignSelf: 'center', marginLeft: '1rem'}}>
          Value here
        </div>
      </div>
    </div>
  )
}
import { Edit, Renew, Save } from "@carbon/icons-react"
import { IconButton, TextArea } from "@carbon/react"
import React, { useState } from "react"
import type { FaqRow } from "../features/dashboard/Faqlist"
import { useAnswerFAQ } from "../hooks/faqs"
import axios from "axios"

export const FAQAnswerRow = ({ faq }: { faq?: FaqRow }) => {
  const [currentAnswer, setCurrentAnswer] = useState(faq?.answer)
  const [disabled, setDisabled] = useState(true)

  const isDismissed: boolean = faq?.status === 'dismissed'

  const { mutate } = useAnswerFAQ()

  const handleSaveAnswer = () => {
    mutate(
      {
        id: faq!.id,
        answer: currentAnswer!
      },
      {
        onSuccess: () => {
          setDisabled(true)
        },
        onError: (error: unknown) => {
           if (axios.isAxiosError(error)) {
              if (error.response) {
                const { data } = error.response
                console.log(data.error?.message || data.message || 'Delete FAQ failed')
              } else {
                console.log('Network error or failed to reach upload server')
              }
            } else {
              const err = error as Error
              console.log(err.message || 'Upload file failed')
            }
        }
      }
    )
  }

  return (
    <div className="answer-container">
      <div><strong>Answer:</strong></div>
      <TextArea
        id="answer"
        labelText="answer here"
        hideLabel
        placeholder="Type your answer"
        value={currentAnswer}
        readOnly={disabled}
        disabled={isDismissed}
        onChange={(e) => setCurrentAnswer(e.target.value)}
        rows={5}
      />
      <div className="answer-buttons">
        {disabled && !isDismissed ? <IconButton kind="secondary" size="sm" label="Edit Answer" onClick={() => setDisabled(false)}>
          <Edit />
        </IconButton> : '' }

        {!disabled ? <React.Fragment>
          <IconButton kind="secondary" size="sm" label="Save Answer" onClick={handleSaveAnswer}>
            <Save />
          </IconButton>
          <IconButton kind="secondary" size="sm" label="Cancel Edit" onClick={() => {
            setDisabled(true)
            setCurrentAnswer(faq?.answer)
          }}>
            <Renew />
          </IconButton>
        </React.Fragment> : ''}
      </div>
    </div>
  )
}
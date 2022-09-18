import React, { useState } from "react"
import { Form, Button } from "react-bootstrap"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons"
export default function SearchForm({ id, className, childClassname }) {
  const [searchFocus, setSearchFocus] = useState(false)
  const onFocus = () => setSearchFocus(!searchFocus)
  return (
    <Form id={id} className={className}>
      <div
        className={`input-label-absolute input-label-absolute-left input-reset ${
          childClassname ? childClassname : ""
        } ${searchFocus ? "focus" : ""}`}
      >
        <label htmlFor={id + "_search"} className="label-absolute">
          <FontAwesomeIcon icon={faSearch} />
          <span className="sr-only">What are you looking for?</span>
        </label>
        <Form.Control
          id={id + "_search"}
          placeholder="Search Ticker"
          aria-label="Search"
          size="sm"
          className="border-0 shadow-0 bg-gray-200"
          onFocus={onFocus}
          onBlur={() => setTimeout(() => onFocus(), 333)}
        />
        <Button variant="reset" size="sm" type="reset">
          <FontAwesomeIcon icon={faTimes} />
        </Button>
      </div>
    </Form>
  )
}

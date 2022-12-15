import React, { useState } from "react"
import { Form, Button } from "react-bootstrap"
import { useStockNames } from "@hooks/useStockNames"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons"
export default function SearchForm({ id, className, childClassname }) {
  const [searchFocus, setSearchFocus] = useState(false)
  const onFocus = () => setSearchFocus(!searchFocus)

  const [ticker, setTicker] = useState('')
  const returnQuery = (e) => {
    e.preventDefault();

    console.log(ticker)
  }


  const {data:stockNames} = useStockNames();

  console.log(stockNames)



  return (
    <Form id={id} className={className} onSubmit={returnQuery}>
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
          value={ticker}
          className="border-0 shadow-0 bg-gray-200"
          onFocus={onFocus}
          onChange ={(e) => setTicker(e.target.value)}
          onBlur={() => setTimeout(() => onFocus(), 333)}
        />
        <Button variant="reset" size="sm" type="tubmit">
          <FontAwesomeIcon icon={faTimes} />
        </Button>
      </div>
    </Form>
  )
}

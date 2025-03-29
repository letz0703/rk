"use client"

import {useEffect} from "react"

export default function HtmlAttributeSetter() {
  useEffect(() => {
    document.documentElement.setAttribute("data-be-installed", "true")
  }, [])

  return null
}

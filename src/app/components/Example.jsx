'use client'

import { useParams } from 'next/navigation'

//import styles from './Example.module.css'
export function Example () {
  const params = useParams()
  return (
    <div>
      <h2>{params.id}</h2>
    </div>
  )
}

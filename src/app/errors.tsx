"use client"
const Errors = ({error, reset}) => {
  return (
    <div>
      <h2>{error.message}</h2>
      <button  onClick={reset}>retry</button>
    </div>
  )
}

export default Errors

//import styles from './page.module.css'
export default function Page ({ params }) {
  return (
    <div>
      <h2>{params.id.join(', ')}</h2>
    </div>
  )
}

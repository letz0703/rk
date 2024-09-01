import { notFound } from 'next/navigation'

//import styles from './page.module.css'
async function getTodo (id) {
  //await wait(2000)
  return fetch(`https://jsonplaceholder.typicode.com/todos/${id}`).then(res =>
    res.json()
  )
}

export default async function Page ({ params }) {
  const todo = await getTodo(params.id)
  if (todo.title == null) return notFound()
  return (
    <div>
      <h1>{todo.title}</h1>
    </div>
  )
}

import Link from 'next/link'

//import styles from './page.module.css'
async function getTodos () {
  return fetch('https://jsonplaceholder.typicode.com/todos').then(res =>
    res.json()
  )
}
export default async function Page () {
  const todos = await getTodos()
  return (
    <>
      <h1>Todos</h1>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <Link href={`todos/${todo.id}`}>{todo.title}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

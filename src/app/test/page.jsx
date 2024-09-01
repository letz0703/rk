import Link from 'next/link'
import { Suspense } from 'react'

//import styles from './page.module.css'
function getTodos () {
  //await wait(2000)
  return fetch('https://jsonplaceholder.typicode.com/todos').then(res =>
    res.json()
  )
}

export default async function Home () {
  return (
    <>
      <h1>Todos</h1>
      <Suspense
        fallback={
          <>
            <h1>Loading...</h1>
          </>
        }
      >
        <TodoList />
      </Suspense>
    </>
  )
}

async function TodoList () {
  const todos = await getTodos()
  //return <p className=''>{todos.length}</p>
  return (
    <>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {<Link href={`todos/${todo.id}`}>{todo.title}</Link>}
          </li>
        ))}
      </ul>
    </>
  )
}

function wait (duration) {
  // eslint-disable-next-line no-undef
  return new Promise(resolve => {
    setTimeout(resolve, duration)
  })
}

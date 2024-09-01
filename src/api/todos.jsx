export function getTodos () {
  const apiUrl = process.env.API_URL || 'http://localhost:3001/todos'
  return fetch(`${apiUrl}/todos`).then(res => res.json())
}

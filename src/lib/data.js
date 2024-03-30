import {Post} from "./models"
const users = [
  {id: 1, name: "john"},
  {id: 2, name: "Jane"}
]

//const posts = [
//  {id: 1, title: "Post 1", body: "...", userId: 1},
//  {id: 2, title: "Post 2", body: "...", userId: 1},
//  {id: 3, title: "Post 3", body: "...", userId: 2},
//  {id: 4, title: "Post 4", body: "...", userId: 2}
//]
export const getPosts = async slug => {
  try {
    connectToDb()
    const posts = await Post.find()
    return posts
  } catch (err) {
    console.log(err)
    throw new Error("Failed to fetch posts")
  }
}

export const getPost = async slug => {
  try {
    connectToDb()
    //const post = posts.find(post => post.id === parseInt(id))
    //const post = posts.find(post => post.id === parseInt(id))
    const post = await Post.find({slug})
    return post
  } catch (err) {
    throw new Error("Failed to fetch posts")
  }
}

export const getUser = async id => {
  try {
    connectToDb()
    const user = await User.findBy(id)
    return user
  } catch (err) {
    throw new Error("Failed to fetch user")
  }
}

export const getUsers = async () => {
  try {
    connectToDb()
    const users = await User.find()
    return users
  } catch (error) {
    console.log(err)
    throw new Error("Failed to fetch user")
  }
}

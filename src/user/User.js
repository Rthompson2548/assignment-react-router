import React, { useEffect, useState } from "react"
import UserProfile from "./UserProfile"
import { fetchUserWithPosts } from "../api"
import PostList from "./PostList"
import PostsNav from "./PostsNav"
import ErrorMessage from "../common/ErrorMessage"
import {
  Route,
  Link,
  useParams,
  Switch,
  NavLink,
  useRouteMatch,
} from "react-router-dom"

export const User = () => {
  const [user, setUser] = useState({ posts: [] })
  const [error, setError] = useState(undefined)
  const { userId } = useParams() // TODO: This ID will need to be pulled from parameters.
  const { path, url } = useRouteMatch()

  useEffect(() => {
    const abortController = new AbortController()
    fetchUserWithPosts(userId, abortController.signal)
      .then(setUser)
      .catch(setError)

    return () => abortController.abort()
  }, [userId])

  // TODO: Change the link below to go back to the home page.

  if (error) {
    return (
      <ErrorMessage error={error}>
        <p>
          <Link to="/">Return Home</Link>
        </p>
      </ErrorMessage>
    )
  }

  /*
    TODO: In the below section, update the links to work appropriately with React Router.

    TODO: You'll need to add nested routes below.

    The <PostList /> component should show on the following route:
    /users/:userId/posts

    The <UserProfile /> component should show on the following route:
    /users/:userId
  */
  return (
    <section className="container">
      <PostsNav />
      <div className="border p-4 h-100 d-flex flex-column">
        <h2 className="mb-3">{user.name}</h2>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <NavLink exact to={`${url}`}>Profile </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={`${url}/posts`}> Posts</NavLink>
          </li>
        </ul>

        {user.id ? (
          <div className="p-4 border border-top-0">
            <Switch>
              <Route path={`${path}/posts`}>
                <PostList posts={user.posts} />
              </Route>
              <Route exact path={`${path}`}>
                <UserProfile user={user} />
              </Route>
            </Switch>
          </div>
        ) : (
          <div className="p-4 border border-top-0">
            <p>Loading...</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default User

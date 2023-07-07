import { NavigateOptions, To, useNavigate } from 'react-router'

const useHistory = () => {
  const navigate = useNavigate()
  const history = (path: string | To, options?: NavigateOptions) => {
    if (path === window.location?.pathname) {
      return
    }
    navigate(path, options)
  }
  return { history }
}

export { useHistory }

import { useDispatch, useSelector } from 'react-redux'
import { selectTheme, toggleTheme } from '../../../store/themeSlice.js'
import './ThemeToggle.css'

function ThemeToggle() {
  const theme = useSelector(selectTheme)
  const dispatch = useDispatch()
  const nextTheme = theme === 'light' ? 'dark' : 'light'

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={() => dispatch(toggleTheme())}
      aria-label={`Switch to ${nextTheme} theme`}
    >
      <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
      <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
    </button>
  )
}

export default ThemeToggle

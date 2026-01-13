import { useTheme } from "../src/context/ThemeContext";
import "../src/styles/toggle.css"

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <label className="toggle-container">
      <input
        type="checkbox"
        checked={theme === "dark"}
        onChange={toggleTheme}
        className="toggle-checkbox"
      />

      <span className={`toggle-track ${theme === "dark" ? "dark" : "light"}`}>
        <span className={`toggle-thumb ${theme === "dark" ? "dark" : "light"}`} />
      </span>

      <span className="toggle-icon">
        {theme === "dark" ? "🌜" : "🌞"}
      </span>
    </label>
  );
};

export default ThemeToggle;

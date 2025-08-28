import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/providers/ThemeProvider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button 
      variant="outline" 
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="rounded-md"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  )
}

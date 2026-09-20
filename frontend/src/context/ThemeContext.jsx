import { createContext,useContext,useEffect,useState } from "react";
const ThemeContext=createContext(null);
export function ThemeProvider({children}){const [theme,setTheme]=useState(()=>localStorage.getItem("theme")|| (window.matchMedia?.("(prefers-color-scheme: dark)").matches?"dark":"light"));useEffect(()=>{document.documentElement.classList.toggle("dark",theme==="dark");document.documentElement.style.colorScheme=theme;localStorage.setItem("theme",theme)},[theme]);const toggleTheme=()=>setTheme(t=>t==="dark"?"light":"dark");return <ThemeContext.Provider value={{theme,toggleTheme}}>{children}</ThemeContext.Provider>}
export function useTheme(){const ctx=useContext(ThemeContext);if(!ctx)throw new Error("useTheme must be used within an AuthProvider");return ctx;}

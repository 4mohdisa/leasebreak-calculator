import { useCallback } from "react"

export function useSmoothScroll() {
  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
      // Update URL without triggering navigation
      window.history.pushState({}, "", `#${sectionId}`)
    }
  }, [])

  return scrollToSection
}

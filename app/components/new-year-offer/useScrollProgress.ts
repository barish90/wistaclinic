import { useEffect, useRef } from 'react'
import { useMotionValue, MotionValue } from 'framer-motion'

type ScrollOffset = 'start' | 'center' | 'end'

interface UseScrollProgressOptions {
  /**
   * Offset configuration similar to Framer Motion's useScroll
   * Format: ["element-position viewport-position", "element-position viewport-position"]
   * Example: ["start start", "end start"] means:
   *   - Progress = 0 when element's start is at viewport's start
   *   - Progress = 1 when element's end is at viewport's start
   */
  offset?: [string, string]
}

/**
 * Custom scroll progress hook that replaces Framer Motion's useScroll
 * when dealing with complex scroll contexts (like pages with overflow:hidden)
 *
 * This hook calculates scroll progress based on the element's position
 * relative to the viewport, matching Framer Motion's useScroll behavior.
 */
export function useScrollProgress(
  containerRef: React.RefObject<HTMLElement | null>,
  options: UseScrollProgressOptions = {}
): { scrollYProgress: MotionValue<number> } {
  const { offset = ['start start', 'end start'] } = options
  const scrollYProgress = useMotionValue(0)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    const parseOffset = (offsetStr: string): [ScrollOffset, ScrollOffset] => {
      const parts = offsetStr.split(' ')
      return [parts[0] as ScrollOffset, parts[1] as ScrollOffset]
    }

    const getPositionValue = (position: ScrollOffset, size: number): number => {
      switch (position) {
        case 'start': return 0
        case 'center': return size / 2
        case 'end': return size
        default: return 0
      }
    }

    const calculateProgress = (): number => {
      if (!containerRef.current) return 0

      const element = containerRef.current
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementHeight = rect.height

      // Parse offsets: [elementPosition, viewportPosition]
      const [startOffset, endOffset] = [parseOffset(offset[0]), parseOffset(offset[1])]

      // Framer Motion offset logic:
      // "start start" means progress=0 when element's TOP is at viewport's TOP
      // "end start" means progress=1 when element's BOTTOM is at viewport's TOP
      // "end end" means progress=1 when element's BOTTOM is at viewport's BOTTOM

      // Calculate the rect.top value when progress should be 0
      // When element's [startOffset[0]] is at viewport's [startOffset[1]]
      const elementStartPosFromTop = getPositionValue(startOffset[0], elementHeight)
      const viewportStartPosFromTop = getPositionValue(startOffset[1], windowHeight)
      // rect.top = viewportStartPosFromTop - elementStartPosFromTop
      const rectTopAtStart = viewportStartPosFromTop - elementStartPosFromTop

      // Calculate the rect.top value when progress should be 1
      const elementEndPosFromTop = getPositionValue(endOffset[0], elementHeight)
      const viewportEndPosFromTop = getPositionValue(endOffset[1], windowHeight)
      // rect.top = viewportEndPosFromTop - elementEndPosFromTop
      const rectTopAtEnd = viewportEndPosFromTop - elementEndPosFromTop

      // Current rect.top
      const currentRectTop = rect.top

      // Calculate progress: how far are we from start to end
      const totalRange = rectTopAtStart - rectTopAtEnd // Note: rectTopAtStart > rectTopAtEnd when scrolling down
      if (totalRange === 0) return 0

      const progress = (rectTopAtStart - currentRectTop) / totalRange
      return Math.max(0, Math.min(1, progress))
    }

    const updateProgress = () => {
      const progress = calculateProgress()
      scrollYProgress.set(progress)
    }

    // Use requestAnimationFrame for smooth updates
    const handleScroll = () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current)
      }
      rafId.current = requestAnimationFrame(updateProgress)
    }

    // Initial calculation
    updateProgress()

    // Listen to scroll and resize events
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [containerRef, offset, scrollYProgress])

  return { scrollYProgress }
}

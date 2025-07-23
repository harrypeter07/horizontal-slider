"use client"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { Draggable } from "gsap/Draggable"
import { InertiaPlugin } from "gsap/InertiaPlugin"

// Register GSAP plugins once
gsap.registerPlugin(Draggable, InertiaPlugin)

// Data for the slides
const slidesData = [
  {
    src: "https://cdn.prod.website-files.com/674d847bf8e817966d307714/674d90f74ff2fe8b0b912b97_slide-1.avif",
    alt: "Abstract layout By FAKURIANDESIGN through Unsplash",
    caption: "Layout nº001",
  },
  {
    src: "https://cdn.prod.website-files.com/674d847bf8e817966d307714/674d90f7cf52dd961b48a1e2_slide-2.avif",
    alt: "Abstract layout By FAKURIANDESIGN through Unsplash",
    caption: "Layout nº002",
  },
  {
    src: "https://cdn.prod.website-files.com/674d847bf8e817966d307714/674d90f7f7cce73267703347_slide-3.avif",
    alt: "Abstract layout By FAKURIANDESIGN through Unsplash",
    caption: "Layout nº003",
  },
  {
    src: "https://cdn.prod.website-files.com/674d847bf8e817966d307714/674d90f7ccfd203c82a46798_slide-4.avif",
    alt: "Abstract layout By FAKURIANDESIGN through Unsplash",
    caption: "Layout nº004",
  },
]

export default function HorizontalSlider() {
  const sliderListRef = useRef<HTMLDivElement>(null)
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const prevButtonRef = useRef<HTMLButtonElement>(null)
  const stepElementsParentRef = useRef<HTMLDivElement>(null)
  const totalElementRef = useRef<HTMLHeadingElement>(null)
  const slideRefs = useRef<Array<HTMLDivElement | null>>([])
  // Holds the <h2> elements that show 01, 02, 03 …
  const allStepsRef = useRef<HTMLElement[]>([])

  const [totalSlides] = useState(slidesData.length)

  useEffect(() => {
    const slides = slideRefs.current.filter(Boolean) as HTMLElement[]
    if (slides.length === 0) return

    const ctx = gsap.context(() => {
      // Utility function to find the closest index in an array of values
      const getClosest = (values: number[], value: number, wrap: number) => {
        let i = values.length,
          closest = 1e10,
          index = 0,
          d
        while (i--) {
          d = Math.abs(values[i] - value)
          if (d > wrap / 2) {
            d = wrap - d
          }
          if (d < closest) {
            closest = d
            index = i
          }
        }
        return index
      }

      let onChange = (element: HTMLElement, index: number) => {
          // Remove active class from previously active element and animate its caption out
          if (activeElement) {
            activeElement.classList.remove("active")
            const oldCaption = activeElement.querySelector(".slide-caption")
            if (oldCaption) {
              gsap.to(oldCaption, { opacity: 0, x: "-25%", duration: 0.525, ease: "power3.out" })
            }
          }

          // Determine the actual element to make active (offset by 1 as per original JS)
          const currentElementIndex = slides.indexOf(element)
          const nextSiblingIndex = (currentElementIndex + 1) % slides.length
          const nextSibling = slides[nextSiblingIndex]

          if (nextSibling) {
            nextSibling.classList.add("active")
            activeElement = nextSibling // Update activeElement reference
            // Animate in new caption
            const newCaption = nextSibling.querySelector(".slide-caption")
            if (newCaption) {
              gsap.to(newCaption, { opacity: 1, x: "0%", duration: 0.525, ease: "power3.out", delay: 0.3 })
            }
          }

          // Update step number
          gsap.to(allStepsRef.current, { y: `${-100 * index}%`, ease: "power3", duration: 0.45 })
        },
        lastIndex = 0,
        tl = gsap.timeline({
          repeat: 0, // Changed from config.repeat, assuming no infinite repeat for now
          onUpdate:
            onChange &&
            (() => {
              const i = (tl as any).closestIndex()
              if (lastIndex !== i) {
                lastIndex = i
                onChange(slides[i], i)
              }
            }),
          paused: true,
          defaults: { ease: "none" },
          onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
        }),
        length = slides.length,
        startX = slides[0].offsetLeft,
        times: number[] = [],
        widths: number[] = [],
        spaceBefore: number[] = [],
        xPercents: number[] = [],
        curIndex = 0,
        indexIsDirty = false,
        center = false, // Changed from config.center
        pixelsPerSecond = 1 * 100, // Changed from (config.speed || 1) * 100
        snap = gsap.utils.snap(1), // Changed from config.snap
        timeOffset = 0,
        container = sliderListRef.current?.parentNode as HTMLElement,
        totalWidth: number,
        activeElement: HTMLElement | null = null

      const getTotalWidth = () =>
        slides[length - 1].offsetLeft +
        (xPercents[length - 1] / 100) * widths[length - 1] -
        startX +
        spaceBefore[0] +
        slides[length - 1].offsetWidth * gsap.getProperty(slides[length - 1], "scaleX") +
        0 // Changed from parseFloat(config.paddingRight) || 0

      const populateWidths = () => {
        let b1 = (container as HTMLElement).getBoundingClientRect(),
          b2
        slides.forEach((el, i) => {
          widths[i] = Number.parseFloat(gsap.getProperty(el, "width", "px"))
          xPercents[i] = snap(
            (Number.parseFloat(gsap.getProperty(el, "x", "px")) / widths[i]) * 100 + gsap.getProperty(el, "xPercent"),
          )
          b2 = el.getBoundingClientRect()
          spaceBefore[i] = b2.left - (i ? b1.right : b1.left)
          b1 = b2
        })
        gsap.set(slides, {
          xPercent: (i) => xPercents[i],
        })
        totalWidth = getTotalWidth()
      }

      // Initialize timeWrap with a dummy function to prevent "not a function" error
      let timeWrap: gsap.utils.WrapFunction = (v: number) => v

      const populateOffsets = () => {
        timeOffset = center ? (tl.duration() * ((container as HTMLElement).offsetWidth / 2)) / totalWidth : 0
        center &&
          times.forEach((t, i) => {
            times[i] = timeWrap(tl.labels["label" + i] + (tl.duration() * widths[i]) / 2 / totalWidth - timeOffset)
          })
      }

      const populateTimeline = () => {
        let i, item, curX, distanceToStart, distanceToLoop
        tl.clear()
        for (i = 0; i < length; i++) {
          item = slides[i]
          curX = (xPercents[i] / 100) * widths[i]
          distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0]
          distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX")
          tl.to(
            item,
            { xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100), duration: distanceToLoop / pixelsPerSecond },
            0,
          )
            .fromTo(
              item,
              { xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100) },
              {
                xPercent: xPercents[i],
                duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
                immediateRender: false,
              },
              distanceToLoop / pixelsPerSecond,
            )
            .add("label" + i, distanceToStart / pixelsPerSecond)
          times[i] = distanceToStart / pixelsPerSecond
        }
        timeWrap = gsap.utils.wrap(0, tl.duration()) // Assign the real timeWrap here
      }

      const refresh = (deep: boolean) => {
        const progress = tl.progress()
        tl.progress(0, true)
        populateWidths()
        deep && populateTimeline()
        populateOffsets()
        deep && (tl as any).draggable ? (tl as any).time(times[curIndex], true) : tl.progress(progress, true)
      }

      const onResize = () => refresh(true)

      let proxy: HTMLDivElement

      const toIndex = (index: number, vars: any) => {
        vars = vars || {}
        Math.abs(index - curIndex) > length / 2 && (index += index > curIndex ? -length : length)
        let newIndex = gsap.utils.wrap(0, length, index),
          time = times[newIndex]
        if (time > tl.time() !== index > curIndex && index !== curIndex) {
          time += tl.duration() * (index > curIndex ? 1 : -1)
        }
        if (time < 0 || time > tl.duration()) {
          vars.modifiers = { time: timeWrap }
        }
        curIndex = newIndex
        vars.overwrite = true
        gsap.killTweensOf(proxy)
        return vars.duration === 0 ? tl.time(timeWrap(time)) : tl.tweenTo(time, vars)
      }
      ;(tl as any).toIndex = (index: number, vars: any) => toIndex(index, vars)
      ;(tl as any).closestIndex = (setCurrent: boolean) => {
        const index = getClosest(times, tl.time(), tl.duration())
        if (setCurrent) {
          curIndex = index
          indexIsDirty = false
        }
        return index
      }
      ;(tl as any).current = () => (indexIsDirty ? (tl as any).closestIndex(true) : curIndex)
      ;(tl as any).next = (vars: any) => toIndex((tl as any).current() + 1, vars)
      ;(tl as any).previous = (vars: any) => toIndex((tl as any).current() - 1, vars)
      ;(tl as any).times = times
      tl.progress(1, true).progress(0, true)

      // Initial setup calls
      gsap.set(slides, { x: 0 })
      populateWidths()
      populateTimeline()
      populateOffsets()

      // Initialize the first active slide and caption
      const initialActiveSlide = slides[0]
      if (initialActiveSlide) {
        initialActiveSlide.classList.add("active")
        activeElement = initialActiveSlide
        const initialCaption = initialActiveSlide.querySelector(".slide-caption")
        if (initialCaption) {
          gsap.set(initialCaption, { opacity: 1, x: "0%" }) // Set initial state for the first caption
        }
      }

      // Event listeners for buttons and slides
      const nextButton = nextButtonRef.current
      const prevButton = prevButtonRef.current

      const handleNextClick = () => (tl as any).next({ ease: "power3", duration: 0.725 })
      const handlePrevClick = () => (tl as any).previous({ ease: "power3", duration: 0.725 })
      const handleSlideClick = (i: number) => () => (tl as any).toIndex(i - 1, { ease: "power3", duration: 0.725 })

      if (nextButton) nextButton.addEventListener("click", handleNextClick)
      if (prevButton) prevButton.addEventListener("click", handlePrevClick)
      slides.forEach((slide, i) => slide.addEventListener("click", handleSlideClick(i)))

      // Draggable setup
      if (Draggable && sliderListRef.current) {
        proxy = document.createElement("div")
        let wrap = gsap.utils.wrap(0, 1),
          ratio: number,
          startProgress: number,
          draggable: Draggable,
          lastSnap: number,
          initChangeX: number,
          wasPlaying: boolean

        const align = () => tl.progress(wrap(startProgress + (draggable.startX - draggable.x) * ratio))
        const syncIndex = () => (tl as any).closestIndex(true)

        draggable = Draggable.create(proxy, {
          trigger: sliderListRef.current, // Use the ref directly as the trigger
          type: "x",
          onPressInit() {
            const x = this.x
            gsap.killTweensOf(tl)
            wasPlaying = !tl.paused()
            tl.pause()
            startProgress = tl.progress()
            refresh()
            ratio = 1 / totalWidth
            initChangeX = startProgress / -ratio - x
            gsap.set(proxy, { x: startProgress / -ratio })
          },
          onDrag: align,
          onThrowUpdate: align,
          overshootTolerance: 0,
          inertia: true,
          snap(value) {
            if (Math.abs(startProgress / -ratio - this.x) < 10) {
              return lastSnap + initChangeX
            }
            let time = -(value * ratio) * tl.duration(),
              wrappedTime = timeWrap(time),
              snapTime = times[getClosest(times, wrappedTime, tl.duration())],
              dif = snapTime - wrappedTime
            Math.abs(dif) > tl.duration() / 2 && (dif += dif < 0 ? tl.duration() : -tl.duration())
            lastSnap = (time + dif) / tl.duration() / -ratio
            return lastSnap
          },
          onRelease() {
            syncIndex()
            draggable.isThrowing && (indexIsDirty = true)
          },
          onThrowComplete: () => {
            syncIndex()
            wasPlaying && tl.play()
          },
        })[0]
        ;(tl as any).draggable = draggable
      }
      // Final setup
      ;(tl as any).closestIndex(true)
      lastIndex = curIndex
      onChange && onChange(slides[curIndex], curIndex)

      // Cleanup for event listeners and resize
      ctx.add(() => {
        window.removeEventListener("resize", onResize)
        if (nextButton) nextButton.removeEventListener("click", handleNextClick)
        if (prevButton) prevButton.removeEventListener("click", handlePrevClick)
        slides.forEach((slide, i) => slide.removeEventListener("click", handleSlideClick(i)))
      })
    }, sliderListRef) // Target the main container for the context

    // Update total slides text
    if (totalElementRef.current) {
      totalElementRef.current.textContent = totalSlides < 10 ? `0${totalSlides}` : `${totalSlides}`
    }

    // Dynamically create step elements
    if (stepElementsParentRef.current) {
      stepElementsParentRef.current.innerHTML = "" // Clear existing
      slidesData.forEach((_, index) => {
        const stepDiv = document.createElement("div")
        stepDiv.className = "count-column"
        const stepH2 = document.createElement("h2")
        stepH2.className = "count-heading m-0 w-[2ch] text-[1em] leading-none"
        stepH2.textContent = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`
        stepDiv.appendChild(stepH2)
        stepElementsParentRef.current.appendChild(stepDiv)
      })
      // cache the NodeList only once so every GSAP callback has access
      allStepsRef.current = Array.from(
        stepElementsParentRef.current.querySelectorAll(".count-heading"),
      ) as HTMLElement[]
    }

    return () => ctx.revert() // Cleanup GSAP context on unmount
  }, [totalSlides]) // Dependencies: totalSlides is static, so this runs once.

  return (
    <section className="cloneable relative flex min-h-screen items-center justify-center bg-black p-4em text-light text-1-1vw">
      <div className="main absolute inset-0 z-0 h-full w-full overflow-hidden">
        <div className="slider-wrap flex h-full w-full items-center justify-start">
          <div
            ref={sliderListRef}
            data-slider="list"
            className="slider-list relative flex flex-row items-stretch justify-start"
          >
            {slidesData.map((slide, index) => (
              <div
                key={index}
                ref={(el) => (slideRefs.current[index] = el)}
                data-slider="slide"
                className="slider-slide relative flex-none px-1-25em h-28em w-42-5em"
              >
                <div className="slide-inner relative h-full w-full overflow-hidden rounded-0-5em">
                  <img
                    src={slide.src || "/placeholder.svg"}
                    loading="lazy"
                    sizes="(max-width: 479px) 100vw, 560px"
                    alt={slide.alt}
                    className="h-full w-full object-cover"
                  />
                  <div className="slide-caption absolute left-1-25em top-1-25em z-20 flex items-center justify-start gap-0-4em whitespace-nowrap rounded-0-25em bg-light p-0-4em_0-75em_0-4em_0-5em text-dark opacity-0 -translate-x-[25%]">
                    <div className="caption-dot flex-none h-0-5em w-0-5em rounded-10em bg-dark"></div>
                    <p className="caption m-0 font-sans text-0-75em">{slide.caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overlay absolute inset-0 left-0 z-20 flex h-full w-37-5em items-center justify-start bg-gradient-to-r from-neutral-900 from-85% to-transparent pl-2em">
        <div className="overlay-inner flex h-28-125em flex-col items-start justify-between">
          <div className="overlay-count-row flex flex-row items-center justify-start gap-0-2em font-pp-neue-corp text-5-625em font-bold">
            <div ref={stepElementsParentRef} className="count-column h-1em overflow-hidden">
              {/* Dynamic steps will be rendered here by JS */}
            </div>
            <div className="count-row-divider h-0-75em w-2px rotate-15 bg-light"></div>
            <div className="count-column">
              <h2
                ref={totalElementRef}
                data-slide-count="total"
                className="count-heading m-0 w-2ch text-1em leading-none"
              >
                {totalSlides < 10 ? `0${totalSlides}` : totalSlides}
              </h2>
            </div>
          </div>
          <div className="overlay-nav-row group flex gap-2em">
            <button
              aria-label="previous slide"
              data-slider="button-prev"
              ref={prevButtonRef}
              className="button relative flex h-4em w-4em items-center justify-center rounded-0-4em border border-white/20 bg-transparent p-0 text-white transition-all duration-475 ease-cubic-default hover:scale-85 hover:opacity-100 group-hover:opacity-40"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                viewBox="0 0 17 12"
                fill="none"
                className="button-arrow h-0-75em w-1em flex-none"
              >
                <path
                  d="M6.28871 12L7.53907 10.9111L3.48697 6.77778H16.5V5.22222H3.48697L7.53907 1.08889L6.28871 0L0.5 6L6.28871 12Z"
                  fill="currentColor"
                ></path>
              </svg>
              <div className="button-overlay absolute inset-[-1px] z-20 transition-transform duration-475 ease-cubic-default group-hover:scale-140">
                <div className="overlay-corner h-1em w-1em rounded-tl-0-4em border-l border-t border-light"></div>
                <div className="overlay-corner top-right absolute inset-0 auto-auto rotate-90 h-1em w-1em rounded-tl-0-4em border-l border-t border-light"></div>
                <div className="overlay-corner bottom-left absolute inset-auto auto-0 rotate-[-90deg] h-1em w-1em rounded-tl-0-4em border-l border-t border-light"></div>
                <div className="overlay-corner bottom-right absolute inset-auto 0-auto rotate-180 h-1em w-1em rounded-tl-0-4em border-l border-t border-light"></div>
              </div>
            </button>
            <button
              aria-label="next slide"
              data-slider="button-next"
              ref={nextButtonRef}
              className="button relative flex h-4em w-4em items-center justify-center rounded-0-4em border border-white/20 bg-transparent p-0 text-white transition-all duration-475 ease-cubic-default hover:scale-85 hover:opacity-100 group-hover:opacity-40"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                viewBox="0 0 17 12"
                fill="none"
                className="button-arrow next h-0-75em w-1em flex-none rotate-180"
              >
                <path
                  d="M6.28871 12L7.53907 10.9111L3.48697 6.77778H16.5V5.22222H3.48697L7.53907 1.08889L6.28871 0L0.5 6L6.28871 12Z"
                  fill="currentColor"
                ></path>
              </svg>
              <div className="button-overlay absolute inset-[-1px] z-20 transition-transform duration-475 ease-cubic-default group-hover:scale-140">
                <div className="overlay-corner h-1em w-1em rounded-tl-0-4em border-l border-t border-light"></div>
                <div className="overlay-corner top-right absolute inset-0 auto-auto rotate-90 h-1em w-1em rounded-tl-0-4em border-l border-t border-light"></div>
                <div className="overlay-corner bottom-left absolute inset-auto auto-0 rotate-[-90deg] h-1em w-1em rounded-tl-0-4em border-l border-t border-light"></div>
                <div className="overlay-corner bottom-right absolute inset-auto 0-auto rotate-180 h-1em w-1em rounded-tl-0-4em border-l border-t border-light"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { site } from "@/content/site";

/**
 * Hero — scroll-scrubbed Higgsfield film of the van, exterior → interior.
 * Scroll position drives the video frame (Apple-style), riding the Lenis
 * smooth scroll. Highlight callouts fade in as the camera moves outside → in.
 *
 * On coarse pointers / reduced-motion we drop the scrub and play a muted loop.
 */
export function HeroScroll() {
  const [simple, setSimple] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const extRef = useRef<HTMLDivElement>(null);
  const intRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    if (reduce || coarse) {
      setSimple(true);
      video.loop = true;
      video.muted = true;
      void video.play().catch(() => {});
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const build = () => {
        const duration = video.duration || 10;
        video.pause();

        // Scrub the film by scroll.
        gsap.to(video, {
          currentTime: duration,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        });

        // Brand intro fades out as the journey begins.
        gsap.to(introRef.current, {
          autoAlpha: 0,
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "2% top",
            end: "12% top",
            scrub: true,
          },
        });
        gsap.to(hintRef.current, {
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "1% top",
            end: "8% top",
            scrub: true,
          },
        });

        // A highlight that fades in over [in0,in1] and out over [out0,out1].
        const window_ = (
          el: Element | null,
          in0: number,
          in1: number,
          out0: number,
          out1: number,
        ) => {
          if (!el) return;
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 32 },
            {
              autoAlpha: 1,
              y: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: `${in0}% top`,
                end: `${in1}% top`,
                scrub: true,
              },
            },
          );
          gsap.to(el, {
            autoAlpha: 0,
            y: -32,
            ease: "power2.in",
            scrollTrigger: {
              trigger: section,
              start: `${out0}% top`,
              end: `${out1}% top`,
              scrub: true,
            },
          });
        };

        // Exterior moment (awning visible) → interior moment (inside the cabin).
        window_(extRef.current, 18, 26, 40, 48);
        window_(intRef.current, 66, 74, 92, 98);

        ScrollTrigger.refresh();
      };

      if (video.readyState >= 1 && video.duration) build();
      else video.addEventListener("loadedmetadata", build, { once: true });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={simple ? "relative h-screen" : "relative h-[320vh]"}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-ms-black">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          preload="auto"
          poster="/images/hero-poster.jpg"
        >
          <source src="/video/hero-scrub.mp4" type="video/mp4" />
        </video>

        {/* Legibility vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ms-black/40 via-transparent to-ms-black/75"
        />

        {/* Brand intro */}
        <div
          ref={introRef}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <p className="ms-caption mb-6 text-ms-bone/80">
            Mercedes Sprinter &middot; proprietary 3D-printed interiors
          </p>
          <h1 className="font-display text-display-2xl leading-[0.95] text-ms-bone drop-shadow-[0_2px_28px_rgba(0,0,0,0.65)]">
            {site.tagline}
          </h1>
        </div>

        {/* Highlights — desktop scrub only */}
        {!simple ? (
          <>
            <div
              ref={extRef}
              className="absolute bottom-[14%] left-6 max-w-sm opacity-0 lg:left-16"
            >
              <span className="ms-caption text-ms-ion">Exterior</span>
              <h2 className="mt-3 font-display text-display-md leading-tight text-ms-bone drop-shadow-[0_2px_20px_rgba(0,0,0,0.7)]">
                Always charging.
              </h2>
              <p className="mt-2 text-body text-ms-bone/85">
                Integrated solar awning. Power that follows the sun.
              </p>
            </div>

            <div
              ref={intRef}
              className="absolute right-6 bottom-[14%] max-w-sm text-right opacity-0 lg:right-16"
            >
              <span className="ms-caption text-ms-ion">Interior</span>
              <h2 className="mt-3 font-display text-display-md leading-tight text-ms-bone drop-shadow-[0_2px_20px_rgba(0,0,0,0.7)]">
                Printed to fit.
              </h2>
              <p className="mt-2 text-body text-ms-bone/85">
                A 3D-printed interior with a fold-away Murphy bed.
              </p>
            </div>
          </>
        ) : null}

        {/* Scroll hint */}
        <div
          ref={hintRef}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="ms-caption">Scroll</span>
          <span aria-hidden className="h-10 w-px bg-ms-fog/60" />
        </div>
      </div>
    </section>
  );
}

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function AssemblyStory() {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <section id="inside-the-form" ref={section} className="assembly-story" aria-label="Interactive exploded 3D sculpture">
      <div className="assembly-stage">
        <div className="assembly-grid" aria-hidden="true" />
        <div className="assembly-heading">
          <p className="lab-eyebrow">01 / FORM EXPLORATION</p>
          <h2>Beyond<br />the <span>surface.</span></h2>
          <p className="lab-description">Every world begins with a single form. Scroll to pull this one apart — from its outer shell to the light at its core.</p>
          <a href="#selected-projects" className="lab-link">Explore my projects <span>↗</span></a>
        </div>
        <div className="assembly-caption"><span className="live-dot" /> FORM STUDY / 001 <span className="caption-secondary">ALLOY · GLASS · LIGHT</span></div>
        <div className="assembly-bottom"><span>ASSEMBLED</span><div className="assembly-track"><motion.div style={{ scaleX }} /></div><span>EXPLODED</span></div>
        <p className="assembly-instruction">SCROLL TO DISASSEMBLE · REVERSE TO REBUILD</p>
      </div>
    </section>
  );
}

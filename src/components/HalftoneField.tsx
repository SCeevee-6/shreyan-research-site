"use client";

import { useEffect, useRef } from "react";

/**
 * A halftone screen, the way a printer renders a grey: a grid of ink dots whose size follows a slow
 * noise field. The dots swell where the cursor is, with the pointer position eased so the field
 * trails it like wet ink. One draw call per frame; paused off-screen; a single still frame under
 * reduced motion; nothing at all without WebGL.
 */
const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;
const FRAG = `
precision mediump float;
uniform vec2 res; uniform vec2 mouse; uniform float t; uniform float cell; uniform vec3 ink;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int k = 0; k < 4; k++){ v += a*n(p); p *= 2.03; a *= 0.5; } return v; }
void main(){
  vec2 frag = gl_FragCoord.xy;
  // A 15-degree screen angle, as in print.
  mat2 r = mat2(0.966, -0.259, 0.259, 0.966);
  vec2 g = r * frag / cell;
  vec2 c = (r * (floor(g) + 0.5) * cell) ;
  vec2 cc = (mat2(0.966, 0.259, -0.259, 0.966) * ((floor(g) + 0.5) * cell));
  vec2 uv = cc / res.y;
  float tone = fbm(uv * 2.2 + vec2(t * 0.025, -t * 0.018));
  tone = smoothstep(0.35, 0.8, tone) * 0.55;
  float d = distance(cc, mouse);
  tone += 0.75 * exp(-d * d / (2.0 * pow(res.y * 0.16, 2.0)));
  // Fade toward the bottom so the type below sits on clean paper.
  tone *= smoothstep(0.0, 0.55, frag.y / res.y);
  float rad = clamp(tone, 0.0, 1.0) * cell * 0.62;
  float dist = length(fract(g) - 0.5) * cell;
  float a = 1.0 - smoothstep(rad - 0.75, rad + 0.75, dist);
  gl_FragColor = vec4(ink, a * 0.9);
}`;

export function HalftoneField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl", { premultipliedAlpha: false, antialias: false });
    if (!canvas || !gl) return;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const u = (k: string) => gl.getUniformLocation(prog, k);
    const [uRes, uMouse, uT, uCell, uInk] = ["res", "mouse", "t", "cell", "ink"].map(u);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    const ink = () => {
      const v = getComputedStyle(canvas).color.match(/\d+(\.\d+)?/g)?.map(Number) ?? [10, 10, 10];
      return v.slice(0, 3).map((x) => x / 255);
    };
    let color = ink();
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (!target.x) {
        target.x = eased.x = canvas.width * 0.72;
        target.y = eased.y = canvas.height * 0.6;
      }
      color = ink();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      target.x = (e.clientX - r.left) * dpr;
      target.y = (r.bottom - e.clientY) * dpr;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => (color = ink());
    scheme.addEventListener("change", onScheme);

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = true;
    const t0 = performance.now();
    const frame = () => {
      eased.x += (target.x - eased.x) * 0.06;
      eased.y += (target.y - eased.y) * 0.06;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, eased.x, eased.y);
      gl.uniform1f(uT, still ? 0 : (performance.now() - t0) / 1000);
      gl.uniform1f(uCell, 9 * dpr);
      gl.uniform3f(uInk, color[0], color[1], color[2]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!still && visible) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);
    frame();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      scheme.removeEventListener("change", onScheme);
    };
  }, []);

  return <canvas ref={ref} className={`halftone ${className}`} aria-hidden="true" />;
}

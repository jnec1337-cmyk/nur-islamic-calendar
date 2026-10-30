import { ChevronLeft, ChevronRight, List, Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BOOK_CHAPTERS, BOOK_PAGES, chapterAt } from "@/lib/book-toc";
import { digits } from "@/lib/hijri";
import { tx } from "@/lib/i18n";
import { useNur } from "@/lib/store";

const PAGE_KEY = "nur-nahj-page";
const PDF_URL = "/books/nahj-al-asma.pdf";

type PdfPage = {
  getViewport: (params: { scale: number }) => { width: number; height: number };
  render: (params: {
    canvas: HTMLCanvasElement;
    viewport: { width: number; height: number };
  }) => { cancel: () => void; promise: Promise<void> };
};

type PdfDoc = {
  numPages: number;
  getPage: (page: number) => Promise<PdfPage>;
};

let pdfPromise: Promise<PdfDoc> | null = null;

function loadPdf(): Promise<PdfDoc> {
  if (!pdfPromise) {
    pdfPromise = (async () => {
      const pdfjs = await import("pdfjs-dist");
      const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
      const task = pdfjs.getDocument({ url: PDF_URL });
      return task.promise as unknown as Promise<PdfDoc>;
    })().catch((error: unknown) => {
      pdfPromise = null;
      throw error;
    });
  }
  return pdfPromise;
}

export function BookReader() {
  const lang = useNur((s) => s.lang);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const taskRef = useRef<{ cancel: () => void } | null>(null);
  const [pdf, setPdf] = useState<PdfDoc | null>(null);
  const [page, setPage] = useState(1);
  const [ready, setReady] = useState(false);
  const [total, setTotal] = useState(BOOK_PAGES);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [toc, setToc] = useState(false);
  const [query, setQuery] = useState("");
  const [full, setFull] = useState(true);
  const [shift, setShift] = useState(0);
  const gesture = useRef<{ x: number; y: number; id: number; axis: "x" | "y" | null } | null>(null);

  useEffect(() => {
    const saved = Number(localStorage.getItem(PAGE_KEY));
    if (saved >= 1 && saved <= BOOK_PAGES) setPage(saved);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(PAGE_KEY, String(page));
  }, [page, ready]);

  useEffect(() => {
    let alive = true;
    setFailed(false);
    void loadPdf()
      .then((doc) => {
        if (!alive) return;
        setPdf(doc);
        setTotal(doc.numPages || BOOK_PAGES);
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const w = Math.round(el.clientWidth);
      const h = Math.round(el.clientHeight);
      setBox((prev) => (Math.abs(prev.w - w) < 3 && Math.abs(prev.h - h) < 3 ? prev : { w, h }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [full]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pdf || box.w < 40 || box.h < 40) return;
    let cancelled = false;
    setLoading(true);
    setFailed(false);
    const off = document.createElement("canvas");
    void (async () => {
      try {
        const sheet = await pdf.getPage(Math.min(pdf.numPages, Math.max(1, page)));
        if (cancelled) return;
        const base = sheet.getViewport({ scale: 1 });
        const maxW = Math.max(120, box.w - (full ? 28 : 20));
        const maxH = Math.max(120, box.h - 16);
        const fit = Math.min(maxW / base.width, maxH / base.height);
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const viewport = sheet.getViewport({ scale: fit * dpr });
        off.width = Math.max(1, Math.floor(viewport.width));
        off.height = Math.max(1, Math.floor(viewport.height));
        const task = sheet.render({ canvas: off, viewport });
        taskRef.current = task;
        await task.promise;
        if (cancelled) return;
        canvas.width = off.width;
        canvas.height = off.height;
        canvas.getContext("2d")?.drawImage(off, 0, 0);
        setLoading(false);
      } catch (error) {
        const name = error instanceof Error ? error.name : "";
        if (cancelled || name === "RenderingCancelledException") return;
        setFailed(true);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      taskRef.current?.cancel();
      taskRef.current = null;
    };
  }, [box.h, box.w, full, page, pdf]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (event.key === "ArrowRight") setPage((current) => Math.min(total, current + 1));
      if (event.key === "ArrowLeft") setPage((current) => Math.max(1, current - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  const chapter = chapterAt(page);
  const needle = query.trim().toLowerCase();
  const chapters = BOOK_CHAPTERS.filter((item) => !needle || item.title.toLowerCase().includes(needle));

  function go(next: number) {
    setShift(0);
    setPage(Math.min(total, Math.max(1, next)));
    setToc(false);
    stageRef.current?.scrollTo({ top: 0 });
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || toc || (event.target as HTMLElement).closest("button")) return;
    gesture.current = { x: event.clientX, y: event.clientY, id: event.pointerId, axis: null };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (!start.axis && (Math.abs(dx) > 12 || Math.abs(dy) > 12)) {
      start.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (start.axis === "x") event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (start.axis === "x") setShift(dx);
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const start = gesture.current;
    gesture.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    setShift(0);
    if (start.axis === "x" && Math.abs(dx) > 42) {
      go(page + (dx < 0 ? 1 : -1));
      return;
    }
    if (Math.abs(dx) < 14 && Math.abs(dy) < 14) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      if (x < rect.width * 0.28) go(page - 1);
      else if (x > rect.width * 0.72) go(page + 1);
    }
  }

  const paper =
    box.w > 48 && box.h > 48
      ? (() => {
          const maxW = box.w - (full ? 28 : 20);
          const maxH = box.h - 16;
          const h = Math.min(maxH, maxW / 0.707);
          return { w: Math.round(h * 0.707), h: Math.round(h) };
        })()
      : null;

  const shell = (
    <div className={`relative flex min-h-0 flex-1 flex-col ${full ? "h-full w-full" : ""}`}>
      {full ? (
        <header className="flex items-center gap-2 border-b border-line px-3 py-2">
          <button
            type="button"
            aria-label={tx(lang, { ru: "Обычный вид", ar: "الوضع العادي", en: "Exit full screen" })}
            onClick={() => setFull(false)}
            className="flex size-11 items-center justify-center rounded-full border border-line"
          >
            <Minimize2 className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{chapter.title}</p>
            <p className="text-xs tabular-nums text-soft">
              {digits(page, lang)} / {digits(total, lang)}
            </p>
          </div>
          <button type="button" onClick={() => setToc(true)} className="flex items-center gap-1 text-sm text-goldink">
            <List className="size-4" />
            {tx(lang, { ru: "Главы", ar: "الفصول", en: "Chapters" })}
          </button>
        </header>
      ) : (
        <header className="px-4 pb-2 pt-3">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs text-goldink">{tx(lang, { ru: "Книга имён", ar: "كتاب الأسماء", en: "Book of the names" })}</p>
            <button
              type="button"
              onClick={() => setFull(true)}
              className="flex h-9 items-center gap-1 rounded-full border border-line px-3 text-xs text-ink"
            >
              <Maximize2 className="size-4" />
              {tx(lang, { ru: "На весь экран", ar: "ملء الشاشة", en: "Full screen" })}
            </button>
          </div>
          <h2 className="text-lg font-semibold leading-snug text-ink">
            {tx(lang, {
              ru: "Высочайший метод в разъяснении имён Аллаха",
              ar: "النهج الأسمى في شرح أسماء الله الحسنى",
              en: "The highest method in explaining the names of Allah",
            })}
          </h2>
          <p className="mt-1 truncate text-sm text-ink">{chapter.title}</p>
        </header>
      )}

      <div
        ref={stageRef}
        className="relative min-h-0 flex-1 overflow-hidden bg-[#14110e]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          gesture.current = null;
          setShift(0);
        }}
      >
        <div
          className={`absolute inset-0 flex items-center justify-center ${shift === 0 ? "transition-transform duration-150" : ""}`}
          style={{ transform: `translateX(${shift}px)` }}
        >
          {failed ? (
            <p className="px-4 py-8 text-center text-sm leading-6 text-cream">
              {tx(lang, {
                ru: "Не удалось открыть страницу. Проверьте связь и попробуйте ещё раз.",
                ar: "تعذر فتح الصفحة. تحقق من الاتصال وحاول مرة أخرى.",
                en: "The page could not be opened. Check the connection and try again.",
              })}
            </p>
          ) : (
            <div className="relative" style={paper ? { width: paper.w, height: paper.h } : undefined}>
              <div className="absolute inset-0 rounded-sm bg-white shadow-card" />
              <canvas
                ref={canvasRef}
                className={`relative block rounded-sm ${loading ? "opacity-0" : ""}`}
                style={paper ? { width: paper.w, height: paper.h } : undefined}
              />
            </div>
          )}
        </div>
        <button
          type="button"
          aria-label={tx(lang, { ru: "Назад", ar: "السابق", en: "Previous" })}
          onClick={() => go(page - 1)}
          className="absolute left-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-card/80 text-ink shadow-card"
        >
          <ChevronLeft className="size-6" />
        </button>
        <button
          type="button"
          aria-label={tx(lang, { ru: "Дальше", ar: "التالي", en: "Next" })}
          onClick={() => go(page + 1)}
          className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-card/80 text-ink shadow-card"
        >
          <ChevronRight className="size-6" />
        </button>
        {loading && !failed ? (
          <p className="pointer-events-none absolute inset-x-0 top-3 text-center text-xs text-soft">
            {tx(lang, { ru: "Открываю страницу…", ar: "فتح الصفحة…", en: "Opening the page…" })}
          </p>
        ) : null}
      </div>

      <div className="border-t border-line bg-card px-3 py-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={tx(lang, { ru: "Назад", ar: "السابق", en: "Previous" })}
            onClick={() => go(page - 1)}
            disabled={page <= 1}
            className="flex size-11 items-center justify-center rounded-full border border-line disabled:opacity-40"
          >
            <ChevronLeft className="size-5" />
          </button>
          <input
            type="range"
            min={1}
            max={total}
            value={Math.min(page, total)}
            onChange={(event) => go(Number(event.target.value))}
            aria-label={tx(lang, { ru: "Страница", ar: "الصفحة", en: "Page" })}
            className="h-11 min-w-0 flex-1 accent-[var(--gold)]"
          />
          <button
            type="button"
            aria-label={tx(lang, { ru: "Дальше", ar: "التالي", en: "Next" })}
            onClick={() => go(page + 1)}
            disabled={page >= total}
            className="flex size-11 items-center justify-center rounded-full border border-line disabled:opacity-40"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
        <div className="mt-1 flex items-center justify-between gap-3">
          <button type="button" onClick={() => setToc(true)} className="flex items-center gap-1 text-sm text-goldink">
            <List className="size-4" />
            {tx(lang, { ru: "Содержание", ar: "المحتوى", en: "Contents" })}
          </button>
          <p className="text-xs text-soft">
            {tx(lang, {
              ru: "Свайп или края страницы",
              ar: "اسحب أو المس حافة الصفحة",
              en: "Swipe or tap the page edge",
            })}
            {" · "}
            <span className="tabular-nums">
              {digits(page, lang)} / {digits(total, lang)}
            </span>
          </p>
        </div>
      </div>

      {toc ? (
        <div className="absolute inset-0 z-10 flex flex-col bg-canvas">
          <div className="flex items-center justify-between px-4 py-3">
            <h3 className="text-lg font-semibold">{tx(lang, { ru: "Содержание", ar: "المحتوى", en: "Contents" })}</h3>
            <button type="button" onClick={() => setToc(false)} className="text-sm text-goldink">
              {tx(lang, { ru: "Закрыть", ar: "إغلاق", en: "Close" })}
            </button>
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={tx(lang, { ru: "Найти главу", ar: "ابحث عن فصل", en: "Find a chapter" })}
            className="mx-4 mb-2 h-12 rounded-2xl border border-line bg-chip px-4 text-ink outline-none"
          />
          <ul className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
            {chapters.map((item) => {
              const on = chapter.title === item.title && page >= item.page;
              return (
                <li key={`${item.page}-${item.title}`}>
                  <button
                    type="button"
                    onClick={() => go(item.page)}
                    className={`flex w-full items-baseline justify-between gap-3 border-b border-line py-3 text-start ${on ? "text-goldink" : "text-ink"}`}
                  >
                    <span className="text-sm leading-5">{item.title}</span>
                    <span className="shrink-0 text-xs tabular-nums text-soft">{digits(item.page, lang)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );

  if (full && typeof document !== "undefined") {
    return createPortal(
      <div className="fixed inset-0 z-[80] flex h-dvh w-dvw justify-center bg-[#100e0c]">{shell}</div>,
      document.body,
    );
  }
  return shell;
}

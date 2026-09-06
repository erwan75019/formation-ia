import Image from "next/image";

type VisualAsset = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

type LessonVisualPreviewProps = {
  title: string;
  description: string;
  desktop: VisualAsset;
  mobile?: VisualAsset;
};

function PreviewImage({ asset, label }: { asset: VisualAsset; label: string }) {
  return (
    <figure className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </span>
        <a
          href={asset.src}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg px-2 py-1 text-xs font-semibold text-violet-700 hover:bg-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
          aria-label={`Agrandir : ${asset.alt}`}
        >
          Agrandir ↗
        </a>
      </div>
      <Image
        src={asset.src}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        sizes={label === "Mobile" ? "(max-width: 1023px) 100vw, 360px" : "(max-width: 1023px) 100vw, 820px"}
        loading="eager"
        className="h-auto w-full bg-[#07111f] object-contain"
      />
      <figcaption className="border-t border-slate-200 px-4 py-3 text-sm leading-6 text-slate-600">
        {asset.caption}
      </figcaption>
    </figure>
  );
}

export default function LessonVisualPreview({
  title,
  description,
  desktop,
  mobile,
}: LessonVisualPreviewProps) {
  return (
    <section className="mt-8 rounded-3xl border border-violet-200 bg-violet-50 p-5 shadow-sm md:p-7">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
        Aperçu du checkpoint
      </p>
      <h2 className="mt-3 text-2xl font-bold text-slate-950">{title}</h2>
      <p className="mt-3 max-w-3xl leading-7 text-slate-700">{description}</p>
      <div className={`mt-6 grid min-w-0 gap-5 ${mobile ? "lg:grid-cols-[minmax(0,1fr)_minmax(240px,0.36fr)]" : ""}`}>
        <PreviewImage asset={desktop} label="Ordinateur" />
        {mobile ? <PreviewImage asset={mobile} label="Mobile" /> : null}
      </div>
    </section>
  );
}

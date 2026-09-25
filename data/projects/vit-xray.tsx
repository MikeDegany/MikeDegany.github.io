import Image from "next/image"
import { ProjectContent } from "./types"

const models: { name: string; scores: string[]; clean?: boolean }[] = [
  { name: "vit_base_patch16_224.dino", scores: ["clean", "clean", "clean", "clean"], clean: true },
  { name: "vit_giant_patch14_dinov2.lvd142m", scores: ["1.7%", "1.8%", "1.9%", "1.6%"] },
  { name: "vit_giant_patch14_reg4_dinov2.lvd142m", scores: ["clean", "clean", "clean", "clean"], clean: true },
  { name: "vit_base_patch16_clip_224.laion2b", scores: ["3.6%", "4.6%", "4.6%", "3.1%"] },
  { name: "vit_base_patch16_siglip_224.webli", scores: ["1.0%", "1.0%", "1.0%", "1.5%"] },
  { name: "deit3_base_patch16_224.fb_in22k_ft_in1k", scores: ["2.0%", "clean", "5.1%", "2.0%"] },
  { name: "vit_base_patch16_224.mae", scores: ["clean", "clean", "clean", "clean"], clean: true },
]

const Code = ({ children }: { children: string }) => (
  <pre className="bg-gray-900 dark:bg-black/60 text-gray-100 rounded-lg px-5 py-4 mb-6 overflow-x-auto text-sm sm:text-base font-mono leading-relaxed not-prose">
    <code>{children}</code>
  </pre>
)

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-3">
    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2.5"></span>
    <span>{children}</span>
  </li>
)

const Figure = ({ src, alt, caption, width, height }: { src: string; alt: string; caption: React.ReactNode; width: number; height: number }) => (
  <figure className="my-8">
    <div className="rounded-xl overflow-hidden shadow-lg bg-white">
      <Image src={src} alt={alt} width={width} height={height} className="w-full h-auto" />
    </div>
    <figcaption className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">{caption}</figcaption>
  </figure>
)

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-8">
    <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-foreground">{title}</h2>
    {children}
  </div>
)

const p = "leading-relaxed mb-4 text-base sm:text-lg"

export const content: ProjectContent = {
  title: "vit-xray: Look Inside Any Vision Transformer in One Command",
  body: (
    <>
      {/* Links box */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-10">
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5">🩻</span>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Open source &amp; on PyPI</h3>
            <p className="text-blue-800 dark:text-blue-200 leading-relaxed mb-4">
              <span className="font-semibold">vit-xray</span> is MIT licensed, built on timm, and one{" "}
              <code className="font-mono text-sm bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 rounded">pip install</code> away.
              Grab it, point it at a photo, and see what your backbone is really doing.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/MikeDegany/vit-xray"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                </svg>
                View on GitHub
              </a>
              <a
                href="https://pypi.org/project/vit-xray/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-100 border border-blue-300 dark:border-blue-700 text-sm font-semibold rounded-lg transition-colors duration-200"
              >
                📦 PyPI
              </a>
              <a
                href="https://youtu.be/Pzva_27Cqzo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-100 border border-blue-300 dark:border-blue-700 text-sm font-semibold rounded-lg transition-colors duration-200"
              >
                ▶ Watch on YouTube
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Intro */}
      <p className={p}>
        Here's something that surprised me the first time I saw it. Take a pretrained vision transformer, the kind
        of backbone half of us freeze and build on top of, feed it a photo, and look at the patch tokens coming out
        the other end. You'd expect every token to describe its own little patch of the image. Mostly, they do. But
        scattered across the image, usually in the most boring places, like empty sky, a blank wall, flat ground,
        you'll find a few tokens glowing roughly <span className="font-semibold">ten times brighter</span> than
        everything around them. They aren't describing their patch anymore. The model has quietly hijacked them.
      </p>
      <p className={p}>
        I built <span className="font-semibold">vit-xray</span> so you can see this for yourself, on your own images
        and your own backbone, with one command:
      </p>
      <Code>{"pip install vit-xray\nvit-xray photo.jpg"}</Code>
      <p className={p}>
        No GPU? No problem. The default backbone is a 329 MB CLIP model, and the whole thing runs in about ten
        seconds on a laptop CPU, peaking around 1.5 GB of RAM.
      </p>

      {/* Video */}
      <div className="my-10">
        <p className={p}>
          If you'd rather hear me walk through it, I put together a five-minute narrated explainer:
        </p>
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-900 shadow-xl">
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/Pzva_27Cqzo"
            title="vit-xray: 5-minute narrated explainer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>

      <Section title="So What's Actually Going On?">
        <p className={p}>
          A vision transformer cuts an image into patches and gives each patch a token. Now imagine you're the model,
          and you're looking at a patch of clear blue sky that looks exactly like the patch next to it, and the one
          next to that. There's nothing new to store there. So a large, well-trained model learns to recycle that
          token as <span className="font-semibold">scratch space</span>, a place to stash global information about
          the whole image.
        </p>
        <p className={p}>
          Clever, but it comes at a price. Those tokens end up with an L2 norm about ten times larger than their
          neighbours, and whatever sits under them is no longer described by them. This phenomenon was named and
          measured by Darcet et al. in{" "}
          <a
            href="https://arxiv.org/abs/2309.16588"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            Vision Transformers Need Registers
          </a>{" "}
          (ICLR 2024): roughly 2% of tokens, only in large enough models trained long enough.
        </p>
        <p className={p}>
          Here's the full picture: patch-token norms at the final block for seven
          pretrained backbones and four images. The bright dots are the hijacked tokens, and notice where they land:
          sky, walls, flat ground. DINO, MAE, and DINOv2 with registers stay clean.
        </p>
        <Figure
          src="/vitxray-hero.webp"
          alt="Patch-token norm maps across seven backbones and four images"
          width={2000}
          height={1061}
          caption="Patch-token L2 norm at the final block. Brighter is a higher-norm token; green labels mark the backbones that come back clean."
        />
      </Section>

      <Section title="What vit-xray Shows You">
        <p className={p}>For every image and every backbone, you get three views plus a single number:</p>
        <ul className="space-y-4 mb-6 text-base sm:text-lg">
          <Bullet>
            <span className="font-semibold">📊 Patch-norm map:</span> the L2 norm of every patch token. Artifacts pop
            out as isolated bright dots.
          </Bullet>
          <Bullet>
            <span className="font-semibold">🎨 Feature PCA:</span> the patch tokens projected down to three components
            and shown as RGB. It's the pseudo-segmentation view, and it shows you how the backbone groups the scene.
          </Bullet>
          <Bullet>
            <span className="font-semibold">👁 CLS attention:</span> what the class token is looking at. When artifacts
            are present, the attention spikes on them instead of the objects.
          </Bullet>
          <Bullet>
            <span className="font-semibold">🩻 Artifact score:</span> the fraction of tokens that belong to the
            high-norm population.
          </Bullet>
        </ul>
        <p className={p}>
          I want to be upfront about how that score works, because it's the part I cared most about getting right.{" "}
          <span className="font-semibold">There is no hardcoded cutoff.</span> The paper's own threshold was
          hand-picked for one model, and it says outright that the right value varies. So instead, vit-xray fits a
          two-component Gaussian mixture to the token norms and puts the threshold where the two components cross.
          If the norms aren't meaningfully bimodal, the score is zero and the backbone is reported clean. No magic
          numbers to tune per model.
        </p>
      </Section>

      <Section title="The Fix: Registers">
        <p className={p}>
          Here's the part I love. The fix proposed by Darcet et al. is almost embarrassingly simple: give the model a
          few dedicated extra tokens, <span className="font-semibold">registers</span>, to use as scratch space, so
          it stops stealing patch tokens for the job.
        </p>
        <p className={p}>
          Below is the same architecture, same width, same training data, on one shared colour scale. Registers are
          the only difference. Keep your eye on the attention panel on the right: without registers it spikes on the
          artifacts; with them, it traces the cats.
        </p>
        <Figure
          src="/vitxray-registers.webp"
          alt="DINOv2 ViT-g with and without register tokens"
          width={2000}
          height={1026}
          caption="DINOv2 ViT-g/14 without registers (top) and with four registers (bottom). The norm map goes from scattered 9.4× outliers to flat, and attention moves off the artifacts and onto the cats."
        />
        <p className={p}>
          You can also see the problem in the raw numbers. A backbone with artifacts has a visibly bimodal norm
          distribution: a big bulk, a gap, and a small cluster of high-norm tokens. That gap is exactly where
          vit-xray's fitted threshold lands. DINO has no gap at all.
        </p>
        <Figure
          src="/vitxray-histograms.webp"
          alt="Token-norm histograms with fitted thresholds"
          width={2000}
          height={1244}
          caption="Token-norm histograms with the fitted thresholds. Artifact-carrying backbones show a clear second population; clean ones don't."
        />
      </Section>

      <Section title="Why You Should Care">
        <p className={p}>
          If you're freezing a backbone and reading its patch tokens for{" "}
          <span className="font-semibold">
            semantic segmentation, monocular depth, feature fields, open-vocabulary detection, or robotic semantic
            mapping
          </span>
          , then those artifact tokens are corrupted inputs to your dense head. They carry global information, not
          local, so whatever is sitting underneath them gets described wrongly.
        </p>
        <p className={p}>
          This isn't just cosmetic. Darcet et al. showed it measurably hurts dense prediction and breaks unsupervised
          object discovery: DINOv2 was actually <span className="italic">worse</span> than supervised baselines with
          LOST until registers were added.
        </p>
        <p className={p}>
          My pitch is simple: it costs one command to find out which kind of backbone you have. If yours comes back
          clean, great, forget about all of this. If it doesn't, pick a register-trained variant, or look at the
          training-free fix in{" "}
          <a
            href="https://arxiv.org/abs/2506.08010"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            Vision Transformers Don't Need Trained Registers
          </a>
          .
        </p>
      </Section>

      <Section title="Works With Any timm ViT">
        <p className={p}>
          vit-xray isn't tied to a handful of models. Any{" "}
          <a
            href="https://github.com/huggingface/pytorch-image-models"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            timm
          </a>{" "}
          vision transformer works. The patch grid and the number of prefix tokens are read from the model itself,
          never hardcoded, so a plain ViT (one CLS token) and DINOv2 with registers (five prefix tokens) both come
          out right. Here's what I measured on the seven backbones in the gallery:
        </p>
        <div className="overflow-x-auto mb-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm not-prose">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="text-left px-3 py-2 font-semibold">model</th>
                {["cats", "skaters", "frisbee", "bathroom"].map((h) => (
                  <th key={h} className="text-right px-3 py-2 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {models.map((m) => (
                <tr key={m.name} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-3 py-2 font-mono text-xs sm:text-sm whitespace-nowrap">{m.name}</td>
                  {m.scores.map((s, i) => (
                    <td
                      key={i}
                      className={`px-3 py-2 text-right whitespace-nowrap ${
                        s === "clean" ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {s === "clean" ? "🟢 clean" : `🟡 ${s}`}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={p}>Two honest caveats about that table, because I'd rather you hear them from me:</p>
        <ul className="space-y-4 mb-6 text-base sm:text-lg">
          <Bullet>
            <span className="font-semibold">SigLIP has no CLS token.</span> It pools instead, so there's nothing to
            compute CLS attention from. The other panels still render, and the attention panel tells you so rather
            than crashing.
          </Bullet>
          <Bullet>
            <span className="font-semibold">DeiT3 reads clean on one image and 5.1% on another.</span> Its artifacts
            are real and stable: the same four border tokens sit at a norm of about 1500 from block 3 onward. But its
            ordinary tokens inflate over the last few blocks until they nearly catch up, so how separable they look
            at the final block depends on the image. Reading a mid-network block with{" "}
            <code className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">--layer 6</code>{" "}
            shows it unambiguously.
          </Bullet>
        </ul>
        <p className={p}>
          That second point generalizes, and it's worth remembering:{" "}
          <span className="font-semibold">
            artifacts can appear mid-network and be erased by the last block
          </span>
          , so a clean final-block reading isn't always the same as no artifacts.
        </p>
      </Section>

      <Section title="Using It">
        <p className={p}>
          For the clearest picture, use the model my figures lead with, DINOv2 ViT-g/14. It gives you a 37×37 patch
          grid instead of 14×14 and roughly twenty outlier tokens instead of seven. Fair warning, it's a 4.3 GB
          download and needs about 10 GB of RAM on CPU, which is exactly why it isn't the default.
        </p>
        <Code>{"vit-xray photo.jpg --model vit_giant_patch14_dinov2.lvd142m --all-panels"}</Code>
        <p className={p}>A few flags I reach for all the time:</p>
        <Code>
          {`vit-xray photo.jpg -m modelA -m modelB   # compare backbones, one row each
vit-xray photo.jpg --layer 6              # read a mid-network block
vit-xray photo.jpg --pca-foreground       # mask the PCA background`}
        </Code>
        <p className={p}>And if you'd rather stay in Python, it's a library too:</p>
        <Code>
          {`from vit_xray import inspect

res = inspect("photo.jpg", model="vit_base_patch16_clip_224.laion2b")

res.norm_map        # (H, W)
res.pca_rgb         # (H, W, 3)
res.attention       # (H, W), or None if the model has no CLS token
res.artifact_score  # float
res.plot()          # matplotlib Figure`}
        </Code>
        <p className={p}>
          Every figure on this page is reproducible from the repo with a single{" "}
          <code className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
            vit-xray --gallery configs/gallery.yaml
          </code>
          . It pulls four COCO images picked for their large, low-information regions, runs the whole model zoo, and
          the output is deterministic, the same figures pixel for pixel on every run.
        </p>
      </Section>

      <Section title="What It Isn't">
        <p className={p}>
          vit-xray answers exactly one question: <span className="font-semibold">are this backbone's patch features
          clean?</span> I deliberately didn't reimplement other kinds of looking-inside. If you want attention
          rollout across all layers, use{" "}
          <a
            href="https://github.com/jacobgil/vit-explain"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            vit-explain
          </a>
          . If you want to know <span className="italic">why the model made this prediction</span>, reach for{" "}
          <a
            href="https://github.com/jacobgil/pytorch-grad-cam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            pytorch-grad-cam
          </a>
          . They're complementary, and they do their jobs well.
        </p>
        <p className="leading-relaxed text-base sm:text-lg">
          Give it a try on your own backbone, and if you find something interesting, I'd love to hear about it.
        </p>
      </Section>
    </>
  ),
  images: ["/vitxray-hero.webp"],
  featuredVideo: "/videos/vitxray-teaser.mp4",
}

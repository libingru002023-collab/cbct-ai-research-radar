const items = [
  {
    title: "AI-assisted 3D implant position planning",
    authors: "Shen et al.",
    source: "International Dental Journal",
    date: "2026-08 issue; ePub 2026-06-25",
    focus: ["implant", "ianc"],
    evidence: "internal",
    relevance: "Directly relevant to posterior mandibular implant planning with mandibular nerve canal segmentation.",
    method: "3D U-Net plus Swin-Transformer for teeth, mandible, nerve canal segmentation, lingual concavity classification, and implant key-point prediction.",
    metrics: "Dental DSC 0.87-0.91; lingual concavity accuracy 0.92-0.97; safety margin from canal 3.20-3.89 mm.",
    limitation: "Retrospective internal validation; no external center or reader-study endpoint.",
    links: [
      ["PMID 42348991", "https://pubmed.ncbi.nlm.nih.gov/42348991/"],
      ["DOI", "https://doi.org/10.1016/j.identj.2026.109690"],
    ],
  },
  {
    title: "ToothFairy2 multi-structure CBCT benchmark",
    authors: "Bolelli et al.",
    source: "Medical Image Analysis",
    date: "2026-07",
    focus: ["tool", "ianc"],
    evidence: "resource",
    relevance: "Public benchmark with inferior alveolar canals, teeth, mandible, implants, and 42 maxillofacial classes.",
    method: "530 CBCT volumes, standardized challenge protocol, baseline models, and evaluation code.",
    metrics: "Highlights that fine structures, restorations, and metal artifacts remain difficult despite strong performance on large structures.",
    limitation: "Benchmark evidence, not clinical workflow validation.",
    links: [
      ["PMID 42102640", "https://pubmed.ncbi.nlm.nih.gov/42102640/"],
      ["Benchmark", "https://github.com/AImageLab-zip/ToothFairy2-Benchmark"],
    ],
  },
  {
    title: "nnU-Net detection of middle mesial canals",
    authors: "Turp et al.",
    source: "Journal of Endodontics",
    date: "2026-08",
    focus: ["transfer"],
    evidence: "internal",
    relevance: "Transferable small-canal CBCT detection design for canal continuity and case-level thresholds.",
    method: "3D nnU-Net trained on 248 CBCT volumes with 3D Slicer consensus labels.",
    metrics: "Independent test set: case-level sensitivity 94.7%, specificity 100%, kappa 0.920.",
    limitation: "Not IANC; small independent test set.",
    links: [
      ["PMID 41903680", "https://pubmed.ncbi.nlm.nih.gov/41903680/"],
      ["DOI", "https://doi.org/10.1016/j.joen.2026.03.011"],
    ],
  },
  {
    title: "TAPSeg open-source tooth and pulp segmentation",
    authors: "Zhang et al.",
    source: "Journal of Dentistry",
    date: "2026-08",
    focus: ["tool", "workflow"],
    evidence: "external",
    relevance: "Useful model for 3D Slicer integration, external testing, and one-click clinical workflow design.",
    method: "Three-stage V-Net tooth instance segmentation and nnU-Net pulp segmentation.",
    metrics: "External datasets: DSC about 91%-94%; HD95 about 0.7-1.45 mm.",
    limitation: "Not mandibular canal; public code availability should be verified before reuse.",
    links: [
      ["PMID 41865812", "https://pubmed.ncbi.nlm.nih.gov/41865812/"],
      ["DOI", "https://doi.org/10.1016/j.jdent.2026.106643"],
    ],
  },
  {
    title: "Practitioner perception of AR/VR and AI segmentation",
    authors: "Reymus et al.",
    source: "International Endodontic Journal",
    date: "2026-08",
    focus: ["workflow"],
    evidence: "pilot",
    relevance: "Directly useful for clinician confidence, usability, information extraction, and reader-study questionnaire design.",
    method: "Thirty dentists compared conventional CBCT, AI-driven 3D segmentation, AR, and VR for two difficult cases.",
    metrics: "Segmentation, AR, and VR improved information extraction and usability versus conventional slices; screen-based segmentation was most often rated clinically relevant.",
    limitation: "Pilot study with only two cases.",
    links: [
      ["PMID 41833977", "https://pubmed.ncbi.nlm.nih.gov/41833977/"],
      ["DOI", "https://doi.org/10.1111/iej.70143"],
    ],
  },
  {
    title: "DIVA-seg vessel and aneurysm segmentation",
    authors: "AJNR study",
    source: "American Journal of Neuroradiology",
    date: "2026-08",
    focus: ["transfer"],
    evidence: "external",
    relevance: "Transferable template for external validation, morphology agreement, and qualitative blinded review of tubular structures.",
    method: "Iterative pseudolabeling with nnU-Net; stable unlabeled cases added to supervised training.",
    metrics: "External vessel DSC 0.899, aneurysm DSC 0.861, mean HD 0.67 mm; Bland-Altman morphology checks.",
    limitation: "Neurovascular MRA, not dental CBCT.",
    links: [
      ["PMID 41690811", "https://pubmed.ncbi.nlm.nih.gov/41690811/"],
      ["DOI", "https://doi.org/10.3174/ajnr.A9231"],
    ],
  },
];

const tools = [
  {
    name: "DentalSegmentator",
    url: "https://github.com/gaudot/SlicerDentalSegmentator",
    detail: "3D Slicer extension for mandible, teeth, and mandibular canal segmentation. Weights are available through Zenodo; GitHub license is not clearly asserted.",
  },
  {
    name: "cbct-mandibular-canal-pipeline",
    url: "https://github.com/keqingsocute/cbct-mandibular-canal-pipeline",
    detail: "Runs DentalSegmentator and computes point-to-mask and point-to-skeleton errors. Good starter for IANC error analysis; no license asserted.",
  },
  {
    name: "ToothFairy2 Benchmark",
    url: "https://github.com/AImageLab-zip/ToothFairy2-Benchmark",
    detail: "CBCT benchmark with 42 maxillofacial classes including inferior alveolar canals. Useful for external testing and domain-shift experiments.",
  },
  {
    name: "PMCanalSeg / PMCSeg",
    url: "https://github.com/lgh010319/PMCSeg",
    detail: "191 CBCT cases for pterygopalatine and mandibular canal segmentation. Good reproducibility dataset; repository license is not declared.",
  },
  {
    name: "nnU-Net and MONAI",
    url: "https://github.com/MIC-DKFZ/nnUNet",
    detail: "Strong supervised baselines for 3D CBCT segmentation, patch sampling, and sliding-window inference. Both nnU-Net and MONAI are Apache-2.0.",
  },
  {
    name: "MedSAM2 / SAM-Med3D",
    url: "https://github.com/bowang-lab/MedSAM2",
    detail: "Promptable 3D medical segmentation tools for semi-automatic annotation and correction experiments. Useful before training a dedicated IANC model.",
  },
];

const endpoints = [
  "Dice, HD95, ASSD, and centerline distance",
  "Safety-margin violation near planned implants",
  "Reader confidence before and after AI",
  "Plan acceptance, edit, or rejection rate",
  "Planning time and annotation correction time",
  "Inter-reader kappa or ICC",
  "External center and scanner stratification",
  "Metal artifact and low-visibility subgroup analysis",
  "Clinician usability and trust survey",
];

const focusFilter = document.querySelector("#focusFilter");
const evidenceFilter = document.querySelector("#evidenceFilter");
const searchInput = document.querySelector("#searchInput");
const itemGrid = document.querySelector("#itemGrid");
const toolList = document.querySelector("#toolList");
const endpointList = document.querySelector("#endpointList");
const briefOutput = document.querySelector("#briefOutput");
const copyBrief = document.querySelector("#copyBrief");

function evidenceLabel(value) {
  return {
    external: "external / multi-center",
    internal: "internal validation",
    pilot: "pilot",
    resource: "resource",
  }[value];
}

function renderItems() {
  const focus = focusFilter.value;
  const evidence = evidenceFilter.value;
  const query = searchInput.value.trim().toLowerCase();

  const filtered = items.filter((item) => {
    const focusMatch = focus === "all" || item.focus.includes(focus);
    const evidenceMatch = evidence === "all" || item.evidence === evidence;
    const haystack = Object.values(item).flat().join(" ").toLowerCase();
    const queryMatch = !query || haystack.includes(query);
    return focusMatch && evidenceMatch && queryMatch;
  });

  itemGrid.innerHTML = filtered
    .map(
      (item) => `
        <article class="card">
          <div class="tag-row">
            ${item.focus
              .map((tag) => `<span class="tag ${tag === "ianc" || tag === "implant" ? "direct" : ""}">${tag}</span>`)
              .join("")}
            <span class="tag ${item.evidence === "pilot" ? "caution" : ""}">${evidenceLabel(item.evidence)}</span>
          </div>
          <div>
            <h3>${item.title}</h3>
            <div class="meta">${item.authors} | ${item.source} | ${item.date}</div>
          </div>
          <div>
            <p><strong>Why it matters:</strong> ${item.relevance}</p>
            <p><strong>Design notes:</strong> ${item.method}</p>
            <p><strong>Metrics:</strong> ${item.metrics}</p>
            <p><strong>Limitation:</strong> ${item.limitation}</p>
          </div>
          <div class="card-footer">
            ${item.links.map(([label, url]) => `<a class="text-link" href="${url}" target="_blank" rel="noreferrer">${label}</a>`).join("")}
          </div>
        </article>
      `,
    )
    .join("");
}

function renderTools() {
  toolList.innerHTML = tools
    .map(
      (tool) => `
        <li>
          <strong><a class="text-link" href="${tool.url}" target="_blank" rel="noreferrer">${tool.name}</a></strong>
          <p>${tool.detail}</p>
        </li>
      `,
    )
    .join("");
}

function renderEndpoints() {
  endpointList.innerHTML = endpoints
    .map(
      (endpoint) => `
        <div class="check-item">
          <span class="check-dot" aria-hidden="true"></span>
          <span>${endpoint}</span>
        </div>
      `,
    )
    .join("");
}

function buildBrief() {
  const topItems = items.slice(0, 3);
  return [
    "# CBCT AI Research Radar Brief",
    "",
    "## Highest priority",
    ...topItems.map((item, index) => `${index + 1}. ${item.title} - ${item.relevance} Key limitation: ${item.limitation}`),
    "",
    "## Reader-study endpoints",
    ...endpoints.slice(0, 6).map((endpoint) => `- ${endpoint}`),
    "",
    "## Next action",
    "Run a baseline mandibular canal segmentation workflow, report centerline/safety-margin errors, and design an assisted-versus-unaided reader study.",
  ].join("\n");
}

function syncBrief() {
  briefOutput.value = buildBrief();
}

[focusFilter, evidenceFilter, searchInput].forEach((control) => control.addEventListener("input", renderItems));

copyBrief.addEventListener("click", async () => {
  syncBrief();
  try {
    await navigator.clipboard.writeText(briefOutput.value);
    copyBrief.textContent = "Copied";
    setTimeout(() => {
      copyBrief.textContent = "Copy brief";
    }, 1400);
  } catch {
    briefOutput.select();
  }
});

renderItems();
renderTools();
renderEndpoints();
syncBrief();

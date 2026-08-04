# CBCT AI Research Radar

A compact static web project for tracking high-signal research in AI-assisted dental CBCT interpretation, mandibular canal segmentation, and implant planning workflow validation.

The project is designed as a small GitHub-ready artifact around a doctoral research direction:

- inferior alveolar nerve canal / mandibular canal identification and segmentation
- 3D CBCT for posterior mandibular implant planning
- reader studies, inter-observer agreement, and clinician confidence
- external or multi-center validation
- clinical workflow integration and treatment-planning decision support

## What It Includes

- Interactive research radar with filters for focus area and evidence level
- Structured cards for recent papers, benchmarks, and transferable methods
- Tool and dataset shortlist for quick experimentation
- Reader-study endpoint checklist
- One-click Markdown brief export for lab notes or GitHub issues
- Local hero image generated for this project
- A GitHub Actions workflow that can refresh PubMed-matched research items every morning

## Run Locally

Open `index.html` in a browser.

No build step is required. The app uses plain HTML, CSS, and JavaScript.

## Daily Update Workflow

The repository includes `.github/workflows/update-research-radar.yml`.

When GitHub Actions is enabled, it runs every morning at 06:15 Asia/Shanghai time. The workflow executes:

```bash
python scripts/update_literature.py --lookback-days 7
```

The script searches PubMed for recent records matching three profiles:

- dental CBCT, mandibular canal / inferior alveolar nerve canal, AI, segmentation, implant planning
- broader dental CBCT AI validation, reader study, and workflow studies
- transferable 3D medical-imaging work on tubular structures, vessels, nerves, canals, and decision support

New high-scoring records are appended to `data/research-items.json` and committed back to the repository.

Important limitation: the automatic update is a first-pass literature radar, not a systematic review. It flags candidate papers for manual screening; it does not guarantee that every imported record is truly clinically relevant.

## Beginner Mental Model

This project has four layers:

1. `index.html` is the page structure.
2. `styles.css` controls the visual design.
3. `app.js` loads the research data and makes filters/search/copy work.
4. `data/research-items.json` is the editable literature database.

The daily updater changes only the JSON data file. The webpage then reads that file and displays the latest saved records.

## Suggested GitHub Repo Description

> A focused research radar for AI-assisted dental CBCT interpretation, mandibular canal segmentation, implant planning validation, and clinical workflow integration.

## Suggested Next Steps

1. Enable GitHub Pages so the radar has a public web URL.
2. Check the GitHub Actions tab tomorrow morning to confirm the daily update ran.
3. Add a small notebook for baseline mandibular canal segmentation error analysis with DentalSegmentator or nnU-Net.

## Research Notes

This project is for research planning and literature triage only. It is not a diagnostic or treatment-planning device.

## License

MIT License. See `LICENSE`.

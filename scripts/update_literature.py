#!/usr/bin/env python3
"""Refresh CBCT AI research radar items from PubMed.

This script intentionally uses only the Python standard library so it can run
inside GitHub Actions without installing dependencies.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import sys
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "research-items.json"

PUBMED_QUERIES = [
    {
        "name": "direct_ianc_implant",
        "focus": ["ianc", "implant"],
        "term": '((CBCT OR "cone beam computed tomography") AND ("mandibular canal" OR "inferior alveolar nerve" OR "inferior alveolar canal") AND ("artificial intelligence" OR "deep learning" OR segmentation OR "implant planning"))',
    },
    {
        "name": "dental_cbct_ai_workflow",
        "focus": ["workflow"],
        "term": '((dental OR dentistry OR maxillofacial OR mandibular OR implant) AND (CBCT OR "cone beam computed tomography") AND ("artificial intelligence" OR "deep learning" OR "machine learning" OR segmentation OR "reader study" OR validation OR workflow))',
    },
    {
        "name": "transfer_tubular_structures",
        "focus": ["transfer"],
        "term": '((tubular OR vessel OR nerve OR canal OR airway) AND segmentation AND ("deep learning" OR "artificial intelligence") AND (3D OR CT) AND ("external validation" OR multicenter OR workflow OR "decision support"))',
    },
]


def get_json(url: str) -> dict:
    with urllib.request.urlopen(url, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def get_xml(url: str) -> ET.Element:
    with urllib.request.urlopen(url, timeout=30) as response:
        return ET.fromstring(response.read())


def pubmed_search(term: str, start_date: dt.date, end_date: dt.date, retmax: int) -> list[str]:
    dated_term = f"{term} AND ({start_date:%Y/%m/%d}[dp] : {end_date:%Y/%m/%d}[dp])"
    params = urllib.parse.urlencode(
        {
            "db": "pubmed",
            "retmode": "json",
            "retmax": str(retmax),
            "sort": "pub date",
            "term": dated_term,
        }
    )
    url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?{params}"
    data = get_json(url)
    return data.get("esearchresult", {}).get("idlist", [])


def pubmed_fetch(ids: list[str]) -> list[dict]:
    if not ids:
        return []
    params = urllib.parse.urlencode({"db": "pubmed", "retmode": "xml", "id": ",".join(ids)})
    root = get_xml(f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?{params}")
    return [parse_article(article) for article in root.findall(".//PubmedArticle")]


def parse_article(article: ET.Element) -> dict:
    pmid = text(article.find(".//PMID"))
    title = clean_text(text(article.find(".//ArticleTitle")))
    journal = text(article.find(".//Journal/Title")) or text(article.find(".//ISOAbbreviation"))
    article_date = article.find(".//ArticleDate")
    date = parse_date(article_date) or parse_pubdate(article.find(".//JournalIssue/PubDate"))
    doi = ""
    for article_id in article.findall(".//ArticleId"):
        if article_id.attrib.get("IdType") == "doi":
            doi = text(article_id)
            break
    authors = format_authors(article.findall(".//AuthorList/Author"))
    abstract = clean_text(" ".join(text(node) for node in article.findall(".//AbstractText")))
    return {
        "title": title,
        "authors": authors,
        "source": journal,
        "date": date,
        "pmid": pmid,
        "doi": doi,
        "abstract": abstract,
    }


def text(node: ET.Element | None) -> str:
    if node is None:
        return ""
    return "".join(node.itertext()).strip()


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def parse_date(node: ET.Element | None) -> str:
    if node is None:
        return ""
    year = text(node.find("Year"))
    month = text(node.find("Month")).zfill(2)
    day = text(node.find("Day")).zfill(2)
    if year and month and day:
        return f"{year}-{month}-{day}"
    return year


def parse_pubdate(node: ET.Element | None) -> str:
    if node is None:
        return ""
    parts = [text(node.find(name)) for name in ("Year", "Month", "Day")]
    return " ".join(part for part in parts if part)


def format_authors(authors: list[ET.Element]) -> str:
    names = []
    for author in authors[:3]:
        last = text(author.find("LastName"))
        initials = text(author.find("Initials"))
        if last:
            names.append(f"{last} {initials}".strip())
    if len(authors) > 3:
        names.append("et al.")
    return ", ".join(names) or "Authors not parsed"


def load_existing() -> list[dict]:
    if not DATA_PATH.exists():
        return []
    return json.loads(DATA_PATH.read_text(encoding="utf-8"))


def article_key(item: dict) -> str:
    if item.get("doi"):
        return f"doi:{item['doi'].lower()}"
    if item.get("pmid"):
        return f"pmid:{item['pmid']}"
    return f"title:{item.get('title', '').lower()}"


def score_article(article: dict) -> int:
    haystack = f"{article.get('title', '')} {article.get('abstract', '')}".lower()
    score = 0
    for keyword, weight in [
        ("mandibular canal", 8),
        ("inferior alveolar", 8),
        ("implant", 5),
        ("cbct", 5),
        ("cone beam", 5),
        ("segmentation", 4),
        ("reader", 4),
        ("external validation", 4),
        ("multi-center", 4),
        ("multicenter", 4),
        ("workflow", 3),
        ("confidence", 3),
        ("3d", 2),
    ]:
        if keyword in haystack:
            score += weight
    return score


def has_ai_or_segmentation_signal(article: dict) -> bool:
    haystack = f"{article.get('title', '')} {article.get('abstract', '')}".lower()
    signals = [
        "artificial intelligence",
        "deep learning",
        "machine learning",
        "segmentation",
        "automatic",
        "automated",
        "algorithm",
        "neural network",
        "nnunet",
        "nnU-Net".lower(),
    ]
    return any(signal in haystack for signal in signals)


def infer_focus(article: dict, default_focus: list[str]) -> list[str]:
    haystack = f"{article.get('title', '')} {article.get('abstract', '')}".lower()
    focus = set(default_focus)
    if "mandibular canal" in haystack or "inferior alveolar" in haystack:
        focus.add("ianc")
    if "implant" in haystack:
        focus.add("implant")
    if any(term in haystack for term in ["workflow", "reader", "confidence", "diagnostic reliability"]):
        focus.add("workflow")
    if any(term in haystack for term in ["dataset", "benchmark", "open-source"]):
        focus.add("tool")
    if not focus:
        focus.add("transfer")
    return sorted(focus)


def infer_evidence(article: dict) -> str:
    haystack = f"{article.get('title', '')} {article.get('abstract', '')}".lower()
    if any(term in haystack for term in ["external validation", "multi-center", "multicenter", "external dataset"]):
        return "external"
    if any(term in haystack for term in ["pilot", "proof-of-concept", "case series"]):
        return "pilot"
    if any(term in haystack for term in ["dataset", "benchmark", "open-source"]):
        return "resource"
    return "internal"


def to_radar_item(article: dict, focus: list[str], query_name: str) -> dict:
    links = []
    if article.get("pmid"):
        links.append([f"PMID {article['pmid']}", f"https://pubmed.ncbi.nlm.nih.gov/{article['pmid']}/"])
    if article.get("doi"):
        links.append(["DOI", f"https://doi.org/{article['doi']}"])

    return {
        "title": article["title"],
        "source_type": "automatically imported PubMed record",
        "authors": article["authors"],
        "source": article["source"],
        "date": article["date"],
        "focus": infer_focus(article, focus),
        "evidence": infer_evidence(article),
        "relevance": "Automatically imported because it matched the CBCT AI research radar search profile; manual screening is recommended before citing.",
        "method": summarize_method(article),
        "metrics": "Metrics not parsed automatically. Open the source and extract DSC, HD95, ASSD, kappa, ICC, time, or safety-margin endpoints if reported.",
        "limitation": f"Imported by query '{query_name}'. Relevance and evidence level need manual confirmation.",
        "pmid": article.get("pmid", ""),
        "doi": article.get("doi", ""),
        "links": links,
        "added_by": "scripts/update_literature.py",
        "added_at": dt.datetime.now(dt.UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "screening_score": score_article(article),
    }


def summarize_method(article: dict) -> str:
    abstract = article.get("abstract", "")
    if not abstract:
        return "Abstract not available from PubMed at import time."
    first_sentence = re.split(r"(?<=[.!?])\s+", abstract)[0]
    return clean_text(first_sentence)[:320]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lookback-days", type=int, default=7)
    parser.add_argument("--retmax", type=int, default=20)
    args = parser.parse_args()

    end_date = dt.date.today()
    start_date = end_date - dt.timedelta(days=args.lookback_days)
    existing = load_existing()
    seen = {article_key(item) for item in existing}
    candidates = []

    for query in PUBMED_QUERIES:
        ids = pubmed_search(query["term"], start_date, end_date, args.retmax)
        time.sleep(0.34)
        for article in pubmed_fetch(ids):
            key = article_key(article)
            if key in seen:
                continue
            seen.add(key)
            if not has_ai_or_segmentation_signal(article):
                continue
            if score_article(article) < 8:
                continue
            candidates.append(to_radar_item(article, query["focus"], query["name"]))
        time.sleep(0.34)

    candidates.sort(key=lambda item: (item["screening_score"], item.get("date", "")), reverse=True)
    updated = candidates + existing
    DATA_PATH.write_text(json.dumps(updated, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"Added {len(candidates)} new items from {start_date} to {end_date}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

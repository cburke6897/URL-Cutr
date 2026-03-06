from pathlib import Path


def _load_valid_tlds() -> set[str]:
    # Accept any whitespace-separated format: spaces, tabs, or newlines.
    tlds_path = Path(__file__).with_name("tlds.txt")
    return {tld.lower() for tld in tlds_path.read_text(encoding="utf-8").split()}


VALID_TLDS = _load_valid_tlds()

def is_valid_tld(domain: str) -> bool:
    parts = domain.rsplit(".")
    if len(parts) < 2:
        return False
    tld = parts[-1].lower().split(":")[0].split("/")[0]  # Handle potential port number and slashes
    return tld in VALID_TLDS
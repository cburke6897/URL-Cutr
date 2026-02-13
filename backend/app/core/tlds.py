import httpx

VALID_TLDS = set()

async def load_tlds():
    url = "https://data.iana.org/TLD/tlds-alpha-by-domain.txt"
    async with httpx.AsyncClient() as client:
        res = await client.get(url)
        lines = res.text.splitlines()
        # Skip first line ("# Version ...")
        for line in lines[1:]:
            VALID_TLDS.add(line.strip().lower())

def is_valid_tld(domain: str) -> bool:
    parts = domain.rsplit(".")
    if len(parts) < 2:
        return False
    tld = parts[1].lower().split(":")[0].split("/")[0]  # Handle potential port number and slashes
    return tld in VALID_TLDS
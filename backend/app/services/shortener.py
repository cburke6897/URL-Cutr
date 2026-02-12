import string
from nanoid import generate

characters = string.ascii_letters + string.digits

def generate_code(length=6):
    return generate(characters, length)
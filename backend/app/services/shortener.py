import string
from nanoid import generate

characters = string.ascii_letters + string.digits

# Function to generate a unique code for the shortened URL
def generate_code(length=6):
    return generate(characters, length)
import urllib.parse
## imagine that this was
# from react_email import render
from python import render

template_path = urllib.parse.urljoin(__file__, "./email.tsx");
print(
    render(
        template_path, 
        {
            "username": "Gabriel Miranda"
        }
    )
)
